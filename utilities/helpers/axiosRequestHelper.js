const { axiosRequest } = require('utilities/request');

const apiServer = process.env.API_SERVIS || 'http://localhost:3001';

exports.connectBattle = async ({ call }) => axiosRequest({ url: `${apiServer}/api/connect-battle`, params: call.params, viewRequest: 'post' });

exports.createBattle = async ({ call }) => axiosRequest({ url: `${apiServer}/api/create-battle`, params: call.params, viewRequest: 'post' });

exports.getBattlesByState = async (playerID = 'all') => axiosRequest({ url: `${apiServer}/api/show-battles-by-state/select?state=start&playerID=${playerID}`, viewRequest: 'get' });

exports.updateStatsBattle = async ({ battle }) => axiosRequest({ url: `${apiServer}/api/save-stats-battle`, params: battle, viewRequest: 'post' });
