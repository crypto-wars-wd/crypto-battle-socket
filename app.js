const widgetsQuotes = require('utilities/webSocket/websocketConnection');

module.exports = (async () => {
  await widgetsQuotes.createWebSocketConnection();
})();
