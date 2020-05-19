const { widgetsQuotes } = require('utilities/request');
const { wssConnection, checkStartBattles } = require('utilities/webSocket/server');

module.exports = (async () => {
  await widgetsQuotes.createWebSocketConnection();
  await checkStartBattles();
})();
