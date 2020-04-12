import chalk from 'chalk';
import { Bot } from '../../bot/Bot';

export function installLogging({ bot }: { bot: Bot }): { error(msg: Error) } {
  const error = (msg: Error) => console.debug(chalk.red(msg));
  const warn = (msg: string) => console.debug(chalk.yellow(msg));
  const info = (msg: string) => console.debug(chalk.dim.white(msg));
  bot.on('error', error);
  bot.on('warn', warn);
  bot.on('debug', info);
  return { error };
}
