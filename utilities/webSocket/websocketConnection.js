const config = require('config');
const WebSocket = require('ws');
const moment = require('moment');
const { addActualWidgetRate, addActualBattle, redisDel } = require('utilities/redis/redisSetter');
const { getActualWidgetsRate, getActiveBattleByCryptoName, getOneBattle } = require('utilities/redis/redisGetter');
const { gameWidgets } = require('utilities/constants');

const { messages } = require('utilities/constants');
const { wssConnection } = require('./server');

class Widgets {
  constructor(urlConnection, apiKey) {
    this.urlConnection = urlConnection + apiKey;
    this._webSocket = null;
  }

  async createWebSocketConnection() {
    this._webSocket = new WebSocket(this.urlConnection);
    this._webSocket.onopen = (evt) => {
      console.log(`Socket onConnect, ${moment().format()}, target: `, evt.target.url);
      this.subscribeRates();
    };
    this._webSocket.onerror = (evt) => {
      this.onError(evt);
    };
    this._webSocket.onclose = (evt) => {
      console.log(`Socket onClose, ${moment().format()}, code: `, evt.code);
      this.onClose();
    };
    this._webSocket.onmessage = async (evt) => {
      await this.onWebSocketMessage(evt.data);
    };
  }


  onError(error) {
    console.error(`Connection ${error.target.url} errored, with message: `, error.message);
  }

  onClose() {
    setTimeout(() => this.createWebSocketConnection(), 5000);
  }


  async onWebSocketMessage(data) {
    const msg = JSON.parse(data.trim());
    if (msg.TYPE && msg.PRICE) {
      switch (msg.TYPE) {
        case '2':
          await this.updateInDataBase(msg);
          break;
        default:
          break;
      }
    }
  }

  subscribeRates() {
    this._webSocket.send(
      JSON.stringify({
        action: 'SubAdd',
        subs: [...(gameWidgets())],
      }),
    );
  }

  async updateInDataBase(msg) {
    const pastTick = await getActualWidgetsRate(msg.FROMSYMBOL);

    const data = {
      price: msg.PRICE,
      cryptoName: msg.FROMSYMBOL,
      fullName: msg.FROMSYMBOL + msg.TOSYMBOL,
      lastUpdate: msg.LASTUPDATE,
    };
    if (pastTick && pastTick.price < msg.PRICE) {
      data.status = 'UP';
      data.message = `${msg.FROMSYMBOL} ${messages.hit()}`;
    }
    if (pastTick && pastTick.price > msg.PRICE) {
      data.status = 'DOWN';
      data.message = `${msg.FROMSYMBOL} ${messages.getHit()}`;
    }

    await addActualWidgetRate({ widget: msg.FROMSYMBOL, data: JSON.stringify(data) });
    await this.handleActiveBattles(msg, data);
  }

  async handleActiveBattles(msg, data) {
    const activeBattles = await getActiveBattleByCryptoName(msg.FROMSYMBOL);
    const arrayToFront = [];

    for (const element of activeBattles) {
      const splitElement = element.split(':');
      const path = `${splitElement[1]}:${splitElement[2]}`;
      const battleID = splitElement[2];
      const active = await getOneBattle(element);
      const arr = active.split(':');
      const match = arr[0].match(new RegExp(`${msg.FROMSYMBOL}`));
      const firstCryptoName = arr[0].split('/')[0];
      const secondCryptoName = arr[1].split('/')[0];
      let firstCryptoHP = parseInt(arr[0].split('/')[1]);
      let secondCryptoHP = parseInt(arr[1].split('/')[1]);

      if (match === null && data.status === 'UP') {
        firstCryptoHP--;
        const result = await this.handleSpecificBattle(
          arrayToFront, firstCryptoName, firstCryptoHP,
          secondCryptoName, secondCryptoHP, path, battleID, element,
        );
        if (result === 'endBattle') return;
      }
      if (match === null && data.status === 'DOWN') {
        secondCryptoHP--;
        const result = await this.handleSpecificBattle(
          arrayToFront, firstCryptoName, firstCryptoHP,
          secondCryptoName, secondCryptoHP, path, battleID, element,
        );
        if (result === 'endBattle') return;
      }
      if (match !== null && data.status === 'UP') {
        secondCryptoHP--;
        const result = await this.handleSpecificBattle(
          arrayToFront, firstCryptoName, firstCryptoHP,
          secondCryptoName, secondCryptoHP, path, battleID, element,
        );
        if (result === 'endBattle') return;
      }
      if (match !== null && data.status === 'DOWN') {
        firstCryptoHP--;
        const result = await this.handleSpecificBattle(
          arrayToFront, firstCryptoName, firstCryptoHP,
          secondCryptoName, secondCryptoHP, path, battleID, element,
        );
        if (result === 'endBattle') return;
      }
    }
    if (arrayToFront && arrayToFront.length) {
      wssConnection.sendToEveryone({ message: data.message, battles: arrayToFront });
    }
  }

  async handleSpecificBattle(
    arrayToFront, firstCryptoName, firstCryptoHP,
    secondCryptoName, secondCryptoHP, path, battleID, element,
  ) {
    arrayToFront.push({
      id: battleID,
      healthPoints: { [`${firstCryptoName}`]: `${firstCryptoHP}`, [`${secondCryptoName}`]: `${secondCryptoHP}` },
    });

    if (firstCryptoHP <= 0 || secondCryptoHP <= 0) {
      await redisDel(element);
      wssConnection.battleEnd({ battle: { id: battleID, healthPoints: { [`${firstCryptoName}`]: `${firstCryptoHP}`, [`${secondCryptoName}`]: `${secondCryptoHP}` } } });
      return 'endBattle';
    }
    await addActualBattle({ path, value: `${firstCryptoName}/${firstCryptoHP}:${secondCryptoName}/${secondCryptoHP}` });
  }
}

const widgetsCryptocompare = new Widgets(config.widgets.socketConnection, process.env.WIDGETS_KEY || 'ff0dd30d773722079f90f4686f91b0d5c82061f20f17e6817f6db6a7a1e071e3');

module.exports = widgetsCryptocompare;
