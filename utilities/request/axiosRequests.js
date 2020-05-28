const axios = require('axios');

module.exports = async ({ url, params, viewRequest }) => {
  try {
    const result = await axios[viewRequest](url, params);
    return { result: result.data };
  } catch (error) {
    return { error: { message: `ERROR Rest connection ${error.config.url}` } };
  }
};
