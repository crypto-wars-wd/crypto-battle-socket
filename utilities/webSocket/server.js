const SocketServer = require('ws').Server;
const _ = require('lodash');
const GameProcess = require('utilities/helper/gameProcess');
const { axiosRequest } = require('utilities/request');

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
          messages: game.getStepStatus(),
        }),
      );
    }
  });
};

const connectBattle = ({ call, ws }) => {
  if (call.params.cryptoName && call.params.playerID && call.params.battleID) {
    const body = {
      cryptoName: call.params.cryptoName,
      playerID: call.params.playerID,
      battleID: call.params.battleID,
    };
    return axiosRequest('http://localhost:3001/api/connect-battle', body);
  }
  sendSomethingWrong({ call, ws, error: 'error params' });
};

const createBattle = ({ call, ws }) => {
  if (call.params.cryptoName && call.params.playerID && call.params.healthPoints) {
    const body = {
      cryptoName: call.params.cryptoName,
      playerID: call.params.playerID,
      healthPoints: call.params.healthPoints,
    };
    return axiosRequest('http://localhost:3001/api/create-battle', body);
  }
  sendSomethingWrong({ call, ws, error: 'error params' });
};

const startGame = ({ battle }) => {
  const game = new GameProcess({
    firstWarrior: battle.playersInfo.firstPlayer,
    secondWarrior: battle.playersInfo.secondPlayer,
    battle,
  });
  game.start();
  const gameProcess = setInterval(async () => {
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
        if (call.method === 'create_battle' && call.params) {
          const { result, error } = await createBattle({ call, ws });
          if (error) console.error(error);
          if (result.battle) sendStateBattle({ method: 'create_battle', battle: result.battle });

          ws.battle = result.battle._id;
        } else if (call.method === 'connect_battle' && call.params) {
          const { result, error } = await connectBattle({ call, ws });
          if (error) console.error(error);
          if (result.battle) sendStateBattle({ method: 'start_battle', battle: result.battle });

          ws.battle = result.battle._id;
          startGame({ battle: result.battle });
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
