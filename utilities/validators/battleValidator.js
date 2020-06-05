const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.createBattleSchema = Joi.object().keys({
  method: Joi.string().required(),
  params: Joi.object().keys({
    cryptoName: Joi.string()
      .valid('BAT', 'BCH', 'BTC', 'DASH', 'EOS', 'ETH', 'LTC', 'NEO', 'WAVES', 'XMR', 'XRP', 'ZEC', 'ZRX')
      .required(),
    playerID: Joi.string().required(),
    healthPoints: Joi.number().min(1).required(),
    betType: Joi.string().valid('HIVE', 'HBD', 'STEEM', 'SBD'),
    amount: Joi.number().min(1),
  }).with('betType', 'amount').with('amount', 'betType'),
}).options(options);

exports.connectBattleShcema = Joi.object().keys({
  method: Joi.string().required(),
  params: Joi.object().keys({
    cryptoName: Joi.string()
      .valid('BAT', 'BCH', 'BTC', 'DASH', 'EOS', 'ETH', 'LTC', 'NEO', 'WAVES', 'XMR', 'XRP', 'ZEC', 'ZRX')
      .required(),
    playerID: Joi.string().required(),
    battleID: Joi.string().required(),
    betType: Joi.string().valid('HIVE', 'HBD', 'STEEM', 'SBD'),
    amount: Joi.number().min(1),
  }).with('betType', 'amount').with('amount', 'betType'),
}).options(options);
