const SocketServer = require('ws').Server;
const _ = require('lodash');
const GameProcess = require('utilities/helper/gameProcess');
const { getActualWidgetsRate } = require('utilities/redis/redisHelper');
const {
  createBattle, connectBattle, updateStatsBattle, getBattlesByState,
} = require('utilities/helper/axiosRequestHelper');

const wss = new SocketServer({ port: 4000, path: '/start' });

const sendSomethingWrong = ({ ws, call, error }) => {
  ws.send(
    JSON.stringify({
      error: {
        playerID: _.get(call, 'params.playerID', 'not found'),
        result: {},
        message: error,
      },
    }),
  );
};

const sendStateBattle = ({ method, battle }) => {
  wss.clients.forEach((player) => {
    player.send(
      JSON.stringify({
        method,
        battle,
      }),
    );
  });
};

const sendMessagesBattle = ({ battle, game }) => {
  console.log('step');
  wss.clients.forEach((player) => {
    if (player.battle === battle._id) {
      player.send(
        JSON.stringify({
          messages: game,
        }),
      );
    }
  });
};


const startGame = async ({ battle, ws }) => {
  const game = new GameProcess({
    firstWarrior: battle.playersInfo.firstPlayer,
    secondWarrior: battle.playersInfo.secondPlayer,
    widgetCurrentPrice: [
      (await getActualWidgetsRate(battle.playersInfo.firstPlayer.cryptoName)).price,
      (await getActualWidgetsRate(battle.playersInfo.secondPlayer.cryptoName)).price,
    ],
    battle: _.cloneDeep(battle),
  });
  await game.start();

  const gameProcess = setInterval(async () => {
    await game.nextStep();
    const status = game.getStepStatus();
    if (!_.isEmpty(status)) {
      const { result, error } = await updateStatsBattle({ battle: status, ws });
      if (error) console.error(error);
      sendMessagesBattle({ battle, game: result });
      if (status.gameStatus === 'END') {
        sendStateBattle({ method: 'end_battle', battle: result.battle });
        clearInterval(gameProcess);
      }
    }
  }, 1000);
};

class WebSoket {
  constructor() {
    this.wss = wss;
    this.wss.on('connection', async (ws) => {
      console.log('Got connection from new peer');
      ws.on('message', async (message) => {
        console.log('Message', message);
        let call = {};
        try {
          call = JSON.parse(message);
        } catch (error) {
          console.error('Error WS parse JSON message', message, error);
        }
        if (call.method === 'connect_user' && call.params.playerID) {
          const { result: { battles: startedBattles }, error } = await getBattlesByState();
          if (error) console.error(error);
          const result = _.find(
            startedBattles, (battle) => _.get(battle, 'playersInfo.firstPlayer.playerID') === call.params.playerID
                  || _.get(battle, 'playersInfo.secondPlayer.playerID') === call.params.playerID,
          );
          if (result) {
            ws.battle = result._id;
            sendMessagesBattle({ battle: result, game: { battle: result } });
          }
        } else if (call.method === 'create_battle' && call.params) {
          const { result, error } = await createBattle({ call, ws });
          if (error) console.error(error);
          if (result.battle) sendStateBattle({ method: 'create_battle', battle: result.battle });

          ws.battle = result.battle._id;
        } else if (call.method === 'connect_battle' && call.params) {
          const { result, error } = await connectBattle({ call, ws });
          if (error) console.error(error);
          if (result.battle) sendStateBattle({ method: 'start_battle', battle: result.battle });

          ws.battle = result.battle._id;
          await startGame({ battle: result.battle, ws });
          return console.log(`Battle ${result.battle._id} started`);
        } else {
          sendSomethingWrong({ call, ws, error: 'Something is wrong' });
        }
      });
    });
  }
}

const wssConnection = new WebSoket();

module.exports = wssConnection;
