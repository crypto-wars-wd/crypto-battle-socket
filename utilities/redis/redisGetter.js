const { widgetsRate } = require('./redis');

exports.getActualWidgetsRate = async (widget) => JSON.parse(await widgetsRate.getAsync(`actual_widget_rate:${widget}`));

exports.getActiveBattleByCryptoName = async (name) => importUserClient.keysAsync(`import_user_error:*${name}`);
