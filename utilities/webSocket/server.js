const SocketServer = require('ws').Server;
const _ = require('lodash');
const GameProcess = require('utilities/helpers/gameProcess');
const { getActualWidgetsRate } = require('utilities/redis/redisGetter');
const {
  createBattle, connectBattle, updateStatsBattle, getBattlesByState,
} = require('utilities/helpers/axiosRequestHelper');

let messages = [];

const wss = new SocketServer({ port: 4000, path: '/start' });

const saveStateBattle = () => {
  setInterval(async () => {
    if (!_.isEmpty(messages)) {
      const { result, error } = await updateStatsBattle({ battles: messages });
      if (error) console.error(error);
      if (result && result.battles) {
        const updatedStatsBattles = result.battles;
        updatedStatsBattles.forEach((battle) => {
          if (battle.gameStatus === 'END') sendStateBattle({ method: 'end_battle', battle });
          else sendMessagesBattle({ battle });
        });
      }
    }
    messages = [];
  }, 1000);
};

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

const sendMessagesBattle = ({ battle }) => {
  wss.clients.forEach((player) => {
    if (player.battle === battle._id) {
      player.send(
        JSON.stringify({
          messages: battle,
        }),
      );
    }
  });
};

const startGame = async ({
  battle, firstPlayer, secondPlayer,
}) => {
  console.log(`Start game ${battle._id}`);
  const game = new GameProcess({
    firstWarrior: firstPlayer,
    secondWarrior: secondPlayer,
    widgetCurrentPrice: [
      (await getActualWidgetsRate(battle.firstPlayer.cryptoName)).price,
      (await getActualWidgetsRate(battle.secondPlayer.cryptoName)).price,
    ],
    battle: _.cloneDeep(battle),
  });
  await game.start();

  const gameProcess = setInterval(async () => {
    await game.nextStep();
    const status = game.getStepStatus();
    if (!_.isEmpty(status)) {
      await messages.push(status);
      if (status.gameStatus === 'END') {
        clearInterval(gameProcess);
      }
    }
  }, 900);
};

class WebSocket {
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
          const { result: { battles: startedBattle }, error } = await getBattlesByState(call.params.playerID);
          if (error) console.error(error);

          // player has only one active game
          if (startedBattle[0]) {
            ws.battle = startedBattle[0]._id;
            sendMessagesBattle({ battle: startedBattle[0] });
          }
        } else if (call.method === 'create_battle' && call.params) {
          const { result, error } = await createBattle({ call, ws });
          if (error) console.error(error);
          if (result && result.battle) {
            sendStateBattle({ method: 'create_battle', battle: result.battle });
            ws.battle = _.get(result, 'battle._id');
          }
        } else if (call.method === 'connect_battle' && call.params) {
          const { result, error } = await connectBattle({ call, ws });
          if (error) console.error(error);
          if (result && result.battle) {
            sendStateBattle({ method: 'start_battle', battle: result.battle });

            ws.battle = _.get(result, 'battle._id');
            await startGame({
              battle: result.battle,
              firstPlayer: _.get(result, 'battle.firstPlayer'),
              secondPlayer: _.get(result, 'battle.secondPlayer'),
            });
          }
        } else {
          sendSomethingWrong({ call, ws, error: 'Something is wrong' });
        }
      });
    });
  }
}

exports.checkStartBattles = async () => {
  saveStateBattle();
  const { result, error } = await getBattlesByState();
  if (error) console.error(error);
  if (result && result.battles && _.isArray(result.battles) && _.isEmpty(result.battles)) {
    const startedBattles = result.battles;
    startedBattles.forEach((battle) => {
      if (battle.steps.length > 0) {
        const { playersStats } = battle.steps[battle.steps.length - 1];
        startGame({ firstPlayer: playersStats[0], secondPlayer: playersStats[1], battle });
      } else {
        startGame({ firstPlayer: battle.firstPlayer, secondPlayer: battle.secondPlayer, battle });
      }
    });
  }
};

exports.wssConnection = new WebSocket();
