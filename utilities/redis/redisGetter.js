const { widgetsRate } = require('./redis');

exports.getActualWidgetsRate = async (widget) => {
  try {
    return JSON.parse(await widgetsRate.getAsync(`actual_widget_rate:${widget}`));
  } catch (error) {
    return error;
  }
};

exports.getActiveBattleByCryptoName = async (name) => widgetsRate.keysAsync(`actual_battle:*${name}*`);

exports.getOneBattle = async (name) => widgetsRate.getAsync(`${name}`);
