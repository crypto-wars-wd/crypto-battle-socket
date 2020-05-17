const axios = require('axios');

module.exports = async (url, params) => {
  try {
    const result = await axios.post(url, params);
    return { result: result.data };
  } catch (error) {
    return { error: { message: `ERROR Rest connection ${error.config.url}` } };
  }
};
