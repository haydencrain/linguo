import { installBot } from './bot/install';
import { config, Config } from './config';
import { installLogging } from './services/logging/install';
import { installMessageHandler } from './message/install';
import { installCommands } from './commands/install';
import { installFrinkiacService } from './services/frinkiac/install';
import { Message } from 'discord.js';

(function(config: Config) {
  const { token, prefix, activityMsg } = config;
  const { frinkiacService } = installFrinkiacService();
  const { bot } = installBot({ prefix, activityMsg });
  const { errorHandler } = installLogging({ bot, frinkiacService });

  installMessageHandler({ bot, frinkiacService, errorHandler });
  installCommands({ bot, frinkiacService, errorHandler });
  bot.login(token);
})(config);
