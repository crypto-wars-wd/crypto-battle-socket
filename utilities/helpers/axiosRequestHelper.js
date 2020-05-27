const config = require('config');
const { axiosRequest } = require('utilities/request');


exports.connectBattle = async ({ call }) => axiosRequest({ url: `${config.apiUrl}api/connect-battle`, params: call.params, viewRequest: 'post' });

exports.createBattle = async ({ call }) => axiosRequest({ url: `${config.apiUrl}api/create-battle`, params: call.params, viewRequest: 'post' });

exports.getBattlesByState = async (playerID = 'all') => axiosRequest({ url: `${config.apiUrl}api/show-battles-by-state/select?state=start&playerID=${playerID}`, viewRequest: 'get' });

exports.updateStatsBattle = async ({ battles, steps, endedBattles }) => axiosRequest({ url: `${config.apiUrl}api/update-battles`, params: { battles, steps, endedBattles }, viewRequest: 'post' });
