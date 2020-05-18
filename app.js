const { widgetsQuotes } = require('utilities/request');
const server = require('utilities/webSocket/server');

widgetsQuotes.createWebSocketConnection().then(() => console.log('Socket connect created'));
//add restartGame
