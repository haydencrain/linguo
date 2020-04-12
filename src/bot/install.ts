import { Bot } from './Bot';

const ClientMessages = {
  loggedIn: client => `Logged in as ${client.user.tag}! Handling ${client.guilds.cache.array().length} server(s)`,
  disconnected: 'Disconnected!'
};

export function installBot({
  prefix,
  activityMsg
}: {
  prefix: string;
  activityMsg: string;
}): {
  bot: Bot;
} {
  const bot = new Bot({ prefix });

  bot.on('ready', () => {
    console.log(ClientMessages.loggedIn(bot));
    bot.user.setActivity(activityMsg);
  });

  bot.on('disconnect', () => console.log(ClientMessages.disconnected));

  return { bot };
}
