const { widgetsRate } = require('./redis');

exports.getActualWidgetsRate = async (widget) => JSON.parse(await widgetsRate.getAsync(`actual_widget_rate:${widget}`));

exports.getActiveBattleByCryptoName = async (name) => await widgetsRate.keysAsync(`actual_battle:*${name}*`);

exports.getOneBattle = async (name) => await widgetsRate.getAsync(`${name}`);

