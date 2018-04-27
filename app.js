
// Check that node version is the required node version
if (process.version.slice(1).split('.')[0] < 8)
  throw new Error('Node 8.0.0 or higher is required. Please update Node on your system');
    
const Discord = require('discord.js');
const client = new Discord.Client();
client.config = require('./config.js');

const chalk = require('chalk');
const error = chalk.red;
const warn = chalk.warn;
const debug = chalk.dim.white;

const Raven = require('raven');
Raven.config('https://10f30fa174bc42aeb4d26249f8cd89a8@sentry.io/1197471', {
  captureUnhandledRejections: true
}).install();

// plugins
const plugins = require('./plugins');
const frinkiac = plugins.frinkiac;

/**************************************************************************************************
Client actions
**************************************************************************************************/
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Handling ${client.guilds.array().length} server(s)`);
  client.user.setActivity('`Linguo help` for help');
});
  
client.on('disconnected', () => {
  console.log('Disconnected!');
});

client.on('guildMemberAdd', (member) => {
  console.log(`New user ${member.user.username} has joined channel ${member.guild.name}`);
  member.guild.defaultChannel.sendMessage(`${member.user.username} has joined ${member.guild.name}!`);
});

client.on('error', e => console.error(error(e)));
client.on('warn', e => console.warn(warn(e)));
client.on('debug', e => console.info(debug(e)));

/**************************************************************************************************
Command handler
**************************************************************************************************/
const commands = {
  'help': {
    description: 'Displays available commands and a description of how to use each',
    execute: async (message, args) => {
      try {
        var help = '```ini\n[Current available commands]\n\n';
        for (var key in commands) {
          if (commands.hasOwnProperty(key)) {
            help += `[${key}]: ${commands[key].description}\n\n`;
          }
        }
        help += '```';
        await message.channel.send(help);
      }
      catch (err) { sendErrorMessage(err, err.message, message); }
    }
  },
  'dead?': {
    description: 'Ask Linguo if he\'s dead',
    execute: async (message, args) => {
      try {
        var m = await message.channel.send('Linguo dead?');
        m.edit('Linguo IS dead!');
      }
      catch (err) { sendErrorMessage(err, err.message, message); }
    }
  },
  'say': {
    description: 'Linguo will repeat your message',
    execute: async (message, args) => {
      try {
        await message.delete().catch(owo => { console.log(owo); });
        await message.channel.send(args.join(' '));
      }
      catch (err) { sendErrorMessage(err, err.message, message); }
    }
  },
  'search': {
    description: 'Search for a particular quote from The Simpsons, and Linguo will return the most relevant screencap',
    execute: async (message, args) => {
      try {
        var response = await frinkiac.search(args.join(' '));
        var firstData = response.data[0];
        var caption = await frinkiac.caption(firstData.Episode, firstData.Timestamp);
        await message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
      }
      catch (err) { sendErrorMessage(err, err.message, message); }
    }
  },
  'image': {
    description: 'Enter a particaluar episode number and timestamp, and Linguo will return the specific screencap. e.g. \'S05E08 116632\'',
    execute: async (message, args) => {
      try {
        var caption = await frinkiac.caption(args[0], args[1]);
        if (caption instanceof Error)
          throw new Error('Image cannot be found! Make sure you have entered both an episode number and timestamp.');
        message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
      }
      catch (err) { sendErrorMessage(err, err.message, message); }
    }
  },
  'random': {
    description: 'Linguo will return a random image.',
    execute: async (message, args) => {
      try {
        var caption = await frinkiac.random();
        await message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
      }
      catch (err) { sendErrorMessage(err, err.message, message); }
    }
  },
  'meme': {
    description: 'Search for a particular quote from The Simpsons, and Linguo will return an image with the subtitles included',
    execute: async (message, args) => {
      try {
        var response = await frinkiac.search(args.join(' '));
        var firstData = response.data[0];
        var caption = await frinkiac.caption(firstData.Episode, firstData.Timestamp);
        await message.channel.send(frinkiac.memeURL(
          caption.data.Frame.Episode,
          caption.data.Frame.Timestamp,
          toSubtitleString(caption.data.Subtitles)
        ));
      }
      catch (err) { sendErrorMessage(err, err.message, message); }
    }
  },
};

client.on('message', async message => {
  // return if message is from bot or is a client message
  if (message.author.id === client.user.id || message.author.bot) return;

  // determine which prefix is used, return if message does not contain prefix 
  var prefix = determinePrefixOrMentioned(message, client);
  if (message.content.indexOf(prefix) !== 0) return;

  // split into command and args
  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();

  try {
    if (commands.hasOwnProperty(command)) commands[command].execute(message, args);
    else throw new Error(`Command \`${command}\` does not exist! Type \`Linguo help\` for a list of commands.`);
  }
  catch (err) {
    sendErrorMessage(err, err.message, message);
  }
});

/**************************************************************************************************
Helper functions
**************************************************************************************************/
const sendErrorMessage = (err, errMsg, message) => {
  console.log(err);
  message.channel.send('Error: ' + errMsg, { files: ['https://frinkiac.com/img/S12E18/1232440.jpg'] });
};

const determinePrefixOrMentioned = (message, client) => {
  const prefixMention = new RegExp(`<@!?${client.user.id}>`);
  return message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : client.config.prefix;
};

const toSubtitleString = (subtitles) => {
  var subtitleString = '';
  subtitles.forEach(subtitle => { subtitleString += subtitle.Content + ' \n'; });
  return subtitleString;
};

const toImageAttachment = (caption) => {
  return ({
    files: [frinkiac.imageURL(
      caption.data.Frame.Episode,
      caption.data.Frame.Timestamp
    )]
  });
};

const toMemeAttachment = (caption) => {
  var memeURL = frinkiac.memeURL(
    caption.data.Frame.Episode,
    caption.data.Frame.Timestamp,
    toSubtitleString(caption.data.Subtitles)
  );
  console.log(memeURL);
  return ({
    files: [memeURL]
  });
};

/**************************************************************************************************
Client Login
**************************************************************************************************/
client.login(client.config.token);