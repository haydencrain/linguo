import { installBot } from './bot/install';
import { config } from './config';
import { installLogging } from './services/logging/install';
import { installMessageHandler } from './message/install';
import { installCommands } from './commands/install';
import { FrinkiacService } from './services/frinkiac/FrinkiacService';

(function () {
  const { token, prefix, activityMsg } = config;
  const frinkiacService = new FrinkiacService();
  const { bot } = installBot({ prefix, activityMsg });
  const { errorHandler } = installLogging({ bot, frinkiacService });

  installMessageHandler({ bot, frinkiacService, errorHandler });
  installCommands({ bot, frinkiacService, errorHandler });
  bot.login(token);
})();
