const Joi = require('@hapi/joi');

const options = { allowUnknown: true, stripUnknown: true };

exports.createBattleSchema = Joi.object().keys({
  method: Joi.string().required(),
  params: Joi.object().keys({
    cryptoName: Joi.string()
      .valid('BAT', 'BCH', 'BTC', 'DASH', 'EOS', 'ETH', 'LTC', 'NEO', 'WAVES', 'XMR', 'XRP', 'ZEC', 'ZRX')
      .required(),
    playerID: Joi.string().required(),
    healthPoints: Joi.number().required(),
  }),
}).options(options);

exports.connectBattleShcema = Joi.object().keys({
  method: Joi.string().required(),
  params: Joi.object().keys({
    cryptoName: Joi.string()
      .valid('BAT', 'BCH', 'BTC', 'DASH', 'EOS', 'ETH', 'LTC', 'NEO', 'WAVES', 'XMR', 'XRP', 'ZEC', 'ZRX')
      .required(),
    playerID: Joi.string().required(),
    battleID: Joi.string().required(),
  }),
}).options(options);
