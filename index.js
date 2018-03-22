// Check that node version is the required node version
if (process.version.slice(1).split(".")[0] < 8)
    throw new Error("Node 8.0.0 or higher is required. Please update Node on your system");

const Discord = require("discord.js");

const client = new Discord.Client();
client.config = require ("./config.js");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! Serving ${client.channels.array.length} channels`);
  });
  
  client.on('disconnected', () => {
    console.log('Disconnected!');
  })
  
  const prefix = '!linguo';
  client.on('message', (msg) => {
    if(!msg.content.startsWith(prefix)) return;
  
    if (msg.content.startsWith(`${prefix} dead`)) {
      msg.reply('Linguo IS dead');
    }
  });
  
  client.on('guildMemberAdd', (member) => {
    console.log(`New user ${member.user.username} has joined channel ${member.guild.name}`);
    member.guild.defaultChannel.sendMessage(`${member.user.username} has joined this Discord server!`)
  });
  
  
  
  client.on('error', e => { console.error(e); });
  // these have not yet been re-added afaik
  // bot.on('warn', e => { console.warn(e); });
  // bot.on('debug', e => { console.info(e); });
  
  client.login(client.config.token);