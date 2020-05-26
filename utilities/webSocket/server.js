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
          // const { result: { battles: startedBattle }, error } = await getBattlesByState(call.params.playerID);
          // if (error) console.error(error);
          //
          // // player has only one active game
          // if (startedBattle[0]) {
          //   ws.battle = startedBattle[0]._id;
          //   sendMessagesBattle({ battle: startedBattle[0] });
          // }
        } else if (call.method === 'create_battle' && call.params) {
          const { result, error } = await createBattle({ call });
          if (error) console.error(error);
          if (result && result.battle) {
            sendStateBattle({ message: 'create_battle', battle: result.battle });
          }
        } else if (call.method === 'connect_battle' && call.params) {
          const { result, error } = await connectBattle({ call, ws });
          if (error) console.error(error);
          if (result && result.battle) {
            sendStateBattle({ message: 'start_battle', battle: result.battle });
            const path = `${result.battle.firstPlayer.cryptoName}/${result.battle.secondPlayer.cryptoName}:${result.battle._id}`;
            const value = `${result.battle.firstPlayer.cryptoName}/${result.battle.healthPoints}:${result.battle.secondPlayer.cryptoName}/${result.battle.healthPoints}`;
            await addActualBattle({ path, value });
          }
        } else {
          sendSomethingWrong({ call, ws, error: 'Something is wrong' });
        }
      });
    });
  }

  sendToEveryone({ message, battles }) {
    wss.clients.forEach((user) => {
      user.send(JSON.stringify({ message, battles }));
    });
  }

  battleEnd({ battle }) {
    wss.clients.forEach((user) => {
      user.send(JSON.stringify({ message: 'end_battle', battle }));
    });
  }
}

exports.wssConnection = new WebSocket();
