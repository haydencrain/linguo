let secrets;
try {
  secrets = require('./secrets.json');
}
catch (err) {
  console.log('No secrets file available :)');
}

type Config = {
  ownerId: string,
  prefix: string,
  admins: string[],
  support: string[],
  token: string,
}

const config: Config = {
  ownerId: '108412658214006784', // Dosss User id
  prefix: 'Linguo',
  admins: [],
  support: [],
  token: process.env.TOKEN || secrets.token,
};

export default config;
