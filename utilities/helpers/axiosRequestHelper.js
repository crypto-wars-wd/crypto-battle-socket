const config = require('config');
const { axiosRequest } = require('utilities/request');

exports.connectBattle = async ({ call }) => axiosRequest({ url: `${config.apiUrl}/connect-battle`, params: call.params, viewRequest: 'post' });

exports.createBattle = async ({ call }) => axiosRequest({ url: `${config.apiUrl}/create-battle`, params: call.params, viewRequest: 'post' });

exports.getBattlesByState = async ({ id, state }) => axiosRequest({ url: `${config.apiUrl}/get-battles?state=${state}&id=${id}`, viewRequest: 'get' });

exports.updateStatsBattle = async ({ battles, stepsCollection, endedBattles }) => axiosRequest({ url: `${config.apiUrl}/update-battles`, params: { battles, stepsCollection, endedBattles }, viewRequest: 'post' });
