const { handleProxyRequest } = require('../backend/proxy-core');

module.exports = (req, res) => {
  handleProxyRequest(req, res, { mode: 'hosted' });
};
