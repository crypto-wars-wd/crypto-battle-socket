const SocketServer = require('ws').Server;
const _ = require('lodash');
const { messages } = require('utilities/constants');
const { addActualBattle } = require('utilities/redis/redisSetter');
const {
  createBattle, connectBattle, getBattlesByState,
} = require('utilities/helpers/axiosRequestHelper');
const validators = require('utilities/validators');

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
      ws.on('error', (err) => {
        console.error('Caught flash policy server socket error: ', err.stack);
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
        await this.createBattle(call, ws);
        break;
      case 'connect_battle':
        await this.connectBattle(call, ws);
        break;
      case 'ping':
        this.pong(ws);
        break;
      default:
        sendSomethingWrong({ call, ws, error: 'Something is wrong' });
    }
  }

  async connectUser(call) {
    const { result: { battles: startedBattle }, error } = await getBattlesByState({
      id: call.params.playerID,
      state: 'start',
    });
    if (error) console.error(error);
    if (startedBattle && startedBattle.length) {
      sendMessagesBattle({ battle: startedBattle[0], message: 'reconnect' });
    }
  }

  async createBattle(call, ws) {
    const { validated, validationError } = validators
      .validate(call, validators.battle.createBattleSchema);
    if (validationError || await this.checkBattles(validated)) {
      return sendSomethingWrong({
        ws,
        call,
        error: validationError || 'you already have active battle',
      });
    }
    const { result, error } = await createBattle({ call: validated });
    if (error) console.error(error);
    if (result && result.battle) {
      sendStateBattle({ message: 'create_battle', battle: result.battle });
    }
  }

  async connectBattle(call, ws) {
    const { validated, validationError } = validators
      .validate(call, validators.battle.connectBattleShcema);
    if (validationError) {
      return sendSomethingWrong({ ws, call, error: validationError });
    }
    validated.params.message = messages.starter(validated.params.cryptoName);
    const { result, error } = await connectBattle({ call: validated });
    if (error) console.error(error);
    if (result && result.battle) {
      sendStateBattle({ message: 'start_battle', battle: result.battle });
      const { path, value } = this.constructPathValue(result.battle);
      await addActualBattle({ path, value });
    }
  }

  pong(ws) {
    ws.send(JSON.stringify({ message: 'pong' }));
  }

  constructPathValue(battle) {
    const {
      firstPlayer: first, secondPlayer: second, _id, healthPoints: hp,
    } = battle;
    const path = `${first.cryptoName}/${second.cryptoName}:${_id}`;
    const value = `${first.cryptoName}/${hp}:${second.cryptoName}/${hp}:${first.playerID}:${second.playerID}`;

    return { path, value };
  }

  async checkBattles(call) {
    const { battles: waiting, error: getBattlesError } = await this.getBattles(call, 'waiting');
    if (getBattlesError) return console.error(getBattlesError);
    const { battles: started, error: getBattlesErrorstart } = await this.getBattles(call, 'start');
    if (getBattlesErrorstart) console.error(getBattlesErrorstart);

    return !!(waiting && waiting.length || started && started.length);
  }

  async getBattles(call, state) {
    const { result, error } = await getBattlesByState({
      id: call.params.playerID,
      state,
    });
    if (error) return { error };

    return { battles: result.battles };
  }

  sendToEveryone({ message, battles }) {
    wss.clients.forEach((user) => {
      user.send(JSON.stringify({ message, battles }));
    });
  }
}

exports.wssConnection = new WebSocket();
