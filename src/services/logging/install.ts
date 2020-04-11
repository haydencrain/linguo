import { Client } from 'discord.js';
import chalk from 'chalk';

export function installLogging({ client }: { client: Client }) {
  const error = (msg) => console.debug(chalk.red(msg));
  const warn = (msg) => console.debug(chalk.yellow(msg));
  const info = (msg) => console.debug(chalk.dim.white(msg));
  client.on('error', error);
  client.on('warn', warn);
  client.on('debug', info);
}
