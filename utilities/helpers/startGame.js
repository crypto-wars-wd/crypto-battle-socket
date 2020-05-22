const widgetsQuotes = require('utilities/webSocket/websocketConnection');
const { wssConnection, checkStartBattles } = require('utilities/webSocket/server');
const _ = require('lodash');

module.exports = (async () => {
  await widgetsQuotes.createWebSocketConnection();
  await checkStartBattles();
})();

