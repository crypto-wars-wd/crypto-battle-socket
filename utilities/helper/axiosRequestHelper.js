const { axiosRequest } = require('utilities/request');

const apiServer = process.env.API_SERVER || 'http://localhost:3001';

exports.connectBattle = async ({ call }) => {
  if (call.params.cryptoName && call.params.playerID && call.params.battleID) {
    const body = {
      cryptoName: call.params.cryptoName,
      playerID: call.params.playerID,
      battleID: call.params.battleID,
    };
    return axiosRequest({ url: `${apiServer}/api/connect-battle`, params: body, viewRequest: 'post' });
  }
  return { error: 'error params' };
};

exports.createBattle = async ({ call }) => {
  if (call.params.cryptoName && call.params.playerID && call.params.healthPoints) {
    const body = {
      cryptoName: call.params.cryptoName,
      playerID: call.params.playerID,
      healthPoints: call.params.healthPoints,
    };
    return axiosRequest({ url: `${apiServer}/api/create-battle`, params: body, viewRequest: 'post' });
  }
  return { error: 'error params' };
};

exports.getBattlesByState = async () => axiosRequest({ url: `${apiServer}/api/show-battles-by-state/select?state=start`, viewRequest: 'get' });

exports.updateStatsBattle = async ({ battle }) => axiosRequest({ url: `${apiServer}/api/stats-battle`, params: battle, viewRequest: 'post' });
