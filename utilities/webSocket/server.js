const SocketServer = require('ws').Server;
const _ = require('lodash');
const GameProcess = require('utilities/helper/gameProcess');

const wss = new SocketServer({ port: 4000, path: '/start' });

const sendSomethingWrong = ({ ws, battle, error }) => {
  ws.send(
    JSON.stringify({
      error: {
        battleID: _.get(battle, '_id', 'not found'),
        result: {},
        error,
      },
    }),
  );
};

const sendStatusBattle = ({ battle, status }) => {
  wss.clients.forEach((player) => {
    player.send(
      JSON.stringify({
        battle: { battleID: battle._id, status },
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
          messages: game.getStepStatus(),
        }),
      );
    }
  });
};

const startGame = ({ battle }) => {
  const game = new GameProcess({
    firstWarrior: battle.playersInfo.firstPlayer,
    secondWarrior: battle.playersInfo.secondPlayer,
    battle,
  });
  game.start();
  const gameProcess = setInterval(async () => {
    if (_.isEmpty(wss.clients)) {
      clearInterval(gameProcess);
      return console.log('All ws clients exit');
    }
    if (!_.isEmpty(game.getStepStatus())) {
      sendMessagesBattle({ battle, game });
      if (game.getStepStatus().gameStatus === 'CLOSED') {
        clearInterval(gameProcess);
        return console.log('Game end');
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
        if (call.battle && call.battle.gameStatus === 'WAITING') {
          ws.battle = call.battle._id;
          ws.playerID = call.battle.playersInfo.firstPlayer.playerID;
          sendStatusBattle({ battle: call.battle, status: 'WAITING' });
          return console.log(`Battle ${call.battle._id} created`);
        } if (call.battle && call.battle.gameStatus === 'START') {
          wss.clients.forEach((player) => {
            if (player.battle === call.battle._id && player.playerID === call.battle.playersInfo.firstPlayer.playerID) {
              ws.battle = call.battle._id;
              ws.playerID = call.battle.playersInfo.secondPlayer.playerID;
              sendStatusBattle({ battle: call.battle, status: 'START' });
              startGame({ battle: call.battle });
              return console.log(`Battle ${call.battle._id} started`);
            }
          });

        } else {
          sendSomethingWrong({ battle: call.battle, ws, error: 'Something is wrong' });
        }
      });
    });
  }
}

const wssConnection = new WebSoket();

module.exports = wssConnection;
