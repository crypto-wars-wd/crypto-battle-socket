const { widgetsRate } = require('./redis');

exports.addActualWidgetRate = async ({ widget, data }) => widgetsRate.setAsync(`actual_widget_rate:${widget}`, data);

exports.getActualWidgetsRate = async (widget) => JSON.parse(await widgetsRate.getAsync(`actual_widget_rate:${widget}`));
