const { axiosRequest } = require('utilities/request');

const apiServer = process.env.API_SERVER;

exports.connectBattle = async ({ call }) => {
  if (call.params.cryptoName && call.params.playerID && call.params.battleID) {
    const body = {
      cryptoName: call.params.cryptoName,
      playerID: call.params.playerID,
      battleID: call.params.battleID,
    };
    return axiosRequest(`${apiServer}/api/connect-battle`, body);// add in config or env
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
    return axiosRequest(`${apiServer}/api/create-battle`, body);// add in config or env
  }
  return { error: 'error params' };
};

exports.updateStatsBattle = async ({ battle }) => {
  const body = battle;
  return axiosRequest(`${apiServer}/api/stats-battle`, body);// add in config or env
};
