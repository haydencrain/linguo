const secrets = require('./secrets.json');

const config = {
  'ownerId': '108412658214006784', // Dosss User id
  'prefix': 'Linguo',
  'admins': [],
  'support': [],
  'token': process.env.TOKEN || secrets.token,
};

module.exports = config;
