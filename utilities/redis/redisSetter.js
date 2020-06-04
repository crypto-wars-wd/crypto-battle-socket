const { widgetsRate } = require('./redis');

exports.addActualWidgetRate = async ({ widget, data }) => widgetsRate.setAsync(`actual_widget_rate:${widget}`, data);

exports.addActualBattle = async ({ path, value }) => widgetsRate.setAsync(`actual_battle:${path}`, value);

exports.redisDel = async (path) => await widgetsRate.del(path);
