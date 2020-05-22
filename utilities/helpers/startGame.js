const widgetsQuotes = require('utilities/webSocket/websocketConnection');
const { wssConnection, checkStartBattles } = require('utilities/webSocket/server');

module.exports = (async () => {
  await widgetsQuotes.createWebSocketConnection();
  await checkStartBattles();
})();
