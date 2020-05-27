const config = require('config');
const { axiosRequest } = require('utilities/request');

exports.connectBattle = async ({ call }) => axiosRequest({ url: `${config.apiUrl}api/connect-battle`, params: call.params, viewRequest: 'post' });

exports.createBattle = async ({ call }) => axiosRequest({ url: `${config.apiUrl}api/create-battle`, params: call.params, viewRequest: 'post' });

exports.getBattlesByState = async ({ id, state }) => axiosRequest({ url: `${config.apiUrl}api/get-battles?state=${state}&id=${id}`, viewRequest: 'get' });

exports.updateStatsBattle = async ({ battles, steps, endedBattles }) => axiosRequest({ url: `${config.apiUrl}api/update-battles`, params: { battles, steps, endedBattles }, viewRequest: 'post' });
