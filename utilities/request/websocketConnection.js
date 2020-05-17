const config = require('config');
const WebSocket = require('ws');
const moment = require('moment');
const { addActualWidgetRate } = require('utilities/redis/redisHelper');
const { gameWidgets } = require('utilities/constants');

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
        subs: [...gameWidgets],
      }),
    );
  }

  async updateInDataBase(msg) {
    const data = JSON.stringify({
      price: msg.PRICE,
      widgetName: msg.FROMSYMBOL,
      fullName: msg.FROMSYMBOL + msg.TOSYMBOL,
      lastUpdate: msg.LASTUPDATE,
    });
    await addActualWidgetRate({ widget: msg.FROMSYMBOL, data });
  }
}

const widgetsCryptocompare = new Widgets(config.widgets.socketConnection, config.widgets.apiKey);

module.exports = widgetsCryptocompare;
