let secrets;
try {
  secrets = require('../secrets.json');
} catch (err) {
  console.log('No secrets file available :)');
}

export type Config = {
  ownerId: string;
  prefix: string;
  activityMsg: string;
  admins: string[];
  support: string[];
  token: string;
};

export const config: Config = {
  ownerId: '108412658214006784', // Dosss User id
  prefix: 'Linguo',
  activityMsg: '`Linguo help` for help',
  admins: [],
  support: [],
  token: process.env.TOKEN || secrets.token
};
