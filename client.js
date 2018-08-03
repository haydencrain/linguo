import discord from 'discord.js';
import logging from './utils/logging';
import helpers from './utils/helpers';
import commands from './commands/index';

const messageHandler = async (client, message) => {
  // return if message is from bot or is a client message
  if (message.author.id === client.user.id || message.author.bot) return;

  // determine which prefix is used, return if message does not contain prefix
  var prefix = helpers.determinePrefixOrMentioned(message, client);
  if (message.content.indexOf(prefix) !== 0) return;

  // split into command and args
  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();

  try {
    if (commands.hasOwnProperty(command)) commands[command].execute(message, args);
    else throw new Error(`Command \`${command}\` does not exist! Type \`Linguo help\` for a list of commands.`);
  }
  catch (err) {
    helpers.sendErrorMessage(err, err.message, message);
  }
};

const onReady = (client) => {
  console.log(`Logged in as ${client.user.tag}! Handling ${client.guilds.array().length} server(s)`);
  client.user.setActivity('`Linguo help` for help');
};

const onMemberAdd = (client, member) => {
  console.log(`New user ${member.user.username} has joined channel ${member.guild.name}`);
  member.guild.defaultChannel.sendMessage(`${member.user.username} has joined ${member.guild.name}!`);
};

const start = (config) => {
  const client = new discord.Client();
  client.config = config;

  client.on('ready', () => onReady(client));
  client.on('disconnected', () => console.log('Disconnected!'));
  client.on('guildMemberAdd', (member) => onMemberAdd(client, member));

  client.on('error', e => logging.error(e));
  client.on('warn', e => logging.warn(e));
  client.on('debug', e => logging.info(e));

  client.on('message', (message) => messageHandler(client, message));

  client.login(client.config.token);
};

export default {
  start
};
