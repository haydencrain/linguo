const Discord = require("discord.js");
const config = require("./bot.config.json");

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Serving ${client.channels.length} channels`);
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



bot.on('error', e => { console.error(e); });
// these have not yet been re-added afaik
// bot.on('warn', e => { console.warn(e); });
// bot.on('debug', e => { console.info(e); });

client.login(config.token);