const widgetsQuotes = require('utilities/webSocket/websocketConnection');

(async () => {
  await widgetsQuotes.createWebSocketConnection();
})();
