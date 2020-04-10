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
  token: process.env.TOKEN || 'MzcxNTg4NjkxODQ1NzA5ODI1.DM4DEw.1CjWbn9X-jh0oOXl_b31F1KB3Pc',
};

export default config;
