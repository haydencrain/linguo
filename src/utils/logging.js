import chalk from 'chalk';

const error = (msg) => console.debug(chalk.red(msg));
const warn = (msg) => console.debug(chalk.warn(msg));
const info = (msg) => console.debug(chalk.dim.white(msg));

export default {
  error,
  warn,
  info
};
