const redis = require('redis');
const bluebird = require('bluebird');
const config = require('config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const widgetsRate = redis.createClient();

widgetsRate.select(config.redis.widgetsRate);


module.exports = { widgetsRate };
