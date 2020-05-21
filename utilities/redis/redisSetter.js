const { widgetsRate } = require('./redis');

exports.addActualWidgetRate = async ({ widget, data }) => widgetsRate.setAsync(`actual_widget_rate:${widget}`, data);
