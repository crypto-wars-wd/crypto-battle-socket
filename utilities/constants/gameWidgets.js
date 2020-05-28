const config = require('config');

const nameServers = {};
nameServers.bitfinex = [
  'DASH~USD',
  'EOS~USD',
  'BTC~USD',
  'BCH~USD',
  'BAT~USD',
  'ETH~USD',
  'ZEC~USD',
  'LTC~USD',
  'XRP~USD',
  'NEO~USD',
  'XMR~USD',
  'ZRX~USD'];

nameServers.P2PB2B = [
  'WAVES~USD',
];

exports.gameWidgets = () => {
  const widgets = [];
  for (const server of Object.keys(nameServers)) {
    nameServers[server].forEach((widget) => {
      widgets.push(`${config.widgets.server[server]}~${widget}`);
    });
  }
  return widgets;
  // add ICON, METAL
};
