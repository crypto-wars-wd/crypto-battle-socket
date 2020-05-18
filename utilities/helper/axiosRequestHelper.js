const { axiosRequest } = require('utilities/request');

exports.connectBattle = async ({ call, ws }) => {
  if (call.params.cryptoName && call.params.playerID && call.params.battleID) {
    const body = {
      cryptoName: call.params.cryptoName,
      playerID: call.params.playerID,
      battleID: call.params.battleID,
    };
    return axiosRequest('http://localhost:3001/api/connect-battle', body);// add in config or env
  }
  return { error: 'error params' };
};

exports.createBattle = async ({ call, ws }) => {
  if (call.params.cryptoName && call.params.playerID && call.params.healthPoints) {
    const body = {
      cryptoName: call.params.cryptoName,
      playerID: call.params.playerID,
      healthPoints: call.params.healthPoints,
    };
    return axiosRequest('http://localhost:3001/api/create-battle', body);// add in config or env
  }
  return { error: 'error params' };
};

exports.updateStatsBattle = async ({ battle }) => {
  const body = battle;
  return axiosRequest('http://localhost:3001/api/stats-battle', body);// add in config or env
};
