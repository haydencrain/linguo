import { installClient } from './client/install';
import { config, Config } from './config';
import { installLogging } from './services/logging/install';

(function (config: Config) {
  const { client } = installClient({ activityMsg: config.activityMsg });
  installLogging({ client });

  client.login(config.token);
})(config);
