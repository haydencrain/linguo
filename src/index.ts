import { installClient } from "./client/install";
import config from './config';
import { installLogging } from "./logging/install";

(function(config) {
  const { client } = installClient();
  installLogging({ client });


  client.login(config.token);
})(config);


