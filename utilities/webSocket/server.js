const SocketServer = require('ws').Server;
const _ = require('lodash');
const { addActualBattle } = require('utilities/redis/redisSetter');
const {
  createBattle, connectBattle, getBattlesByState,
} = require('utilities/helpers/axiosRequestHelper');

const wss = new SocketServer({ port: 4000, path: '/socket' });

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

const sendStateBattle = ({ message, battle }) => {
  wss.clients.forEach((player) => {
    player.send(
      JSON.stringify({
        message,
        battle,
      }),
    );
  });
};

const sendMessagesBattle = ({ battle, message }) => {
  wss.clients.forEach((player) => {
    if (player.battle === battle._id) {
      player.send(
        JSON.stringify({
          message,
          battle,
        }),
      );
    }
  });
};

class WebSocket {
  constructor() {
    this.wss = wss;
    this.wss.on('connection', async (ws) => {
      console.log('Got connection from new peer');
      ws.on('message', async (message) => {
        await this.onWebSocketMessage(message, ws);
      });
    });
  }

  async onWebSocketMessage(message, ws) {
    let call = {};
    try {
      call = JSON.parse(message);
    } catch (error) {
      console.error('Error WS parse JSON message', message, error);
    }
    switch (call.method) {
      case 'connect_user':
        await this.connectUser(call);
        break;
      case 'create_battle':
        await this.createBattle(call);
        break;
      case 'connect_battle':
        await this.connectBattle(call);
        break;
      default:
        sendSomethingWrong({ call, ws, error: 'Something is wrong' });
    }
  }

  async connectUser(call) {
    const { result: { battles: startedBattle }, error } = await getBattlesByState({ id: call.params.playerID, state: 'start' });
    if (error) console.error(error);
    if (startedBattle[0]) {
      sendMessagesBattle({ battle: startedBattle[0], message: 'reconnect' });
    }
  }

  async createBattle(call) {
    const { result, error } = await createBattle({ call });
    if (error) console.error(error);
    if (result && result.battle) {
      sendStateBattle({ message: 'create_battle', battle: result.battle });
    }
  }

  async connectBattle(call) {
    const { result, error } = await connectBattle({ call });
    if (error) console.error(error);
    if (result && result.battle) {
      sendStateBattle({ message: 'start_battle', battle: result.battle });
      const path = `${result.battle.firstPlayer.cryptoName}/${result.battle.secondPlayer.cryptoName}:${result.battle._id}`;
      const value = `${result.battle.firstPlayer.cryptoName}/${result.battle.healthPoints}:${result.battle.secondPlayer.cryptoName}/${result.battle.healthPoints}:${result.battle.firstPlayer.playerID}:${result.battle.secondPlayer.playerID}`;
      await addActualBattle({ path, value });
    }
  }

  sendToEveryone({ message, battles }) {
    wss.clients.forEach((user) => {
      user.send(JSON.stringify({ message, battles }));
    });
  }
}

exports.wssConnection = new WebSocket();
