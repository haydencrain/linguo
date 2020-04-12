import { installBot } from './bot/install';
import { config, Config } from './config';
import { installLogging } from './services/logging/install';
import { installMessageHandler } from './message/install';
import { installCommands } from './commands/install';
import { installFrinkiacService } from './services/frinkiac/install';

(function(config: Config) {
  const { token, prefix, activityMsg } = config;
  const { bot } = installBot({ prefix, activityMsg });
  const { error } = installLogging({ bot });
  const { frinkiacService } = installFrinkiacService();
  installMessageHandler({ bot, frinkiacService, error });
  installCommands({ bot, frinkiacService });
  bot.login(token);
})(config);
