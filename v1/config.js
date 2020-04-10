let secrets;
try {
  secrets = require('./secrets.json');
}
catch (err) {
  console.log('No secrets file available :)');
}

const config = {
  ownerId: '108412658214006784', // Dosss User id
  prefix: 'Linguo',
  admins: [],
  support: [],
  token: process.env.TOKEN || secrets.token_dev,
};

export default config;
