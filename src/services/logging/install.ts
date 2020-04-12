import chalk from 'chalk';
import { Bot } from '../../bot/Bot';
import { FrinkiacService } from '../frinkiac/FrinkiacService';
import { Message } from 'discord.js';

export function installLogging({
  bot,
  frinkiacService
}: {
  bot: Bot;
  frinkiacService: FrinkiacService;
}): {
  errorHandler(err: Error, errMsg: string, channel: Message['channel']): void;
} {
  const error = (msg: Error) => console.debug(chalk.red(msg));
  const warn = (msg: string) => console.debug(chalk.yellow(msg));
  const info = (msg: string) => console.debug(chalk.dim.white(msg));

  bot.on('error', error);
  bot.on('warn', warn);
  bot.on('debug', info);

  const errorHandler = (err: Error, errMsg: string, channel: Message['channel']) => {
    error(err);
    channel.send('Error: ' + errMsg, { files: [frinkiacService.imageUrl('S12E18', '1232440')] });
  };

  return { errorHandler };
}
