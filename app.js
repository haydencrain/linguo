
// Check that node version is the required node version
if (process.version.slice(1).split('.')[0] < 8)
  throw new Error('Node 8.0.0 or higher is required. Please update Node on your system');
    
// const plugins = require('./plugins/index.js');
const Discord = require('discord.js');
const client = new Discord.Client();
client.config = require('./config.js');
// const helpers = require('./helpers.js');
const colors = require('./colors.js');

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
  member.guild.defaultChannel.sendMessage(`${member.user.username} has joined ${member.guild.name}!`)
});

client.on('error', e => { console.error(`${colors.fgRed}%s${colors.reset}`, e); });
client.on('warn', e => { console.warn(`${colors.fgYellow}%s${colors.reset}`, e); });
client.on('debug', e => { console.info(`${colors.dim}%s${colors.reset}`, e); });

/**************************************************************************************************
Command handler
**************************************************************************************************/
const commands = [
  {
    name: 'help',
    description: 'Displays available commands and a description of how to use each',
    process: (message, args) => {
      
    }
  },
  {
    name: 'dead?',
    description: 'Ask Linguo if he\'s dead',
    process: async (message, args) => { 
      
    }
  },
  {
    name: 'say',
    description: 'Linguo will repeat your message',
    process: (message, args) => { 
      
    }
  },
  {
    name: 'search',
    description: 'Search for a particular quote from The Simpsons, and Linguo will return the most relevant screencap',
    process: async (message, args) => {
      
    }
  },
  {
    name: 'image',
    description: 'Enter a particaluar episode number and timestamp, and Linguo will return the specific screencap.\n\te.g. \'S05E08 116632\'',
    process: async (message, args) => { 
    
    }
  }
];

client.on('message', async message => {
  // return if message is from bot or is a client message
  if (message.author.id === client.user.id || message.author.bot) return;

  // determine which prefix is used, return if message does not contain prefix 
  var prefix = determinePrefixOrMentioned(message, client);
  if (message.content.indexOf(prefix) !== 0) return;

  // split into command and args
  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift();
  
  var caption;
  switch (command) {
    case 'help':
      var help = '``Current available commands:\n\n';
      commands.forEach((command) => { help += `${command.name}\n\t${command.description}\n\n`; });
      help += '``';
      message.channel.send(help)
        .catch(err => message.channel.send(err));
      break;
    
    case 'dead?':
      var m = await message.channel.send('Linguo dead?');
      m.edit('Linguo IS dead!');
      break;
    
    case 'say':
      message.delete().catch(owo => { console.log(owo); });
      message.channel.send(args.join(' '));
      break;
    
    case 'search':
      var response = await frinkiac.search(args.join(' '));
      var firstData = response.data[0];
      caption = await frinkiac.caption(firstData.Episode, firstData.Timestamp);
      message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption))
        .catch(error => message.send(error));
      break;
    
    case 'image':
      caption = await frinkiac.caption(args[0], args[1]);
      message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption))
        .catch(error => message.send('Image cannot be found! Make sure you have entered both an episode number and timestamp.'));
      break;
    
    case 'random':
      caption = await frinkiac.random();
      message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption))
        .catch(error => message.send(error));
      break;
    
    case 'frinkiac':
      message.channel.send('', { files: [frinkiac.heroURL()] })
        .catch(error => message.send(error));
      break;
    
    case 'meme':
      response = await frinkiac.search(args.join(' '));
      firstData = response.data[0];
      caption = await frinkiac.caption(firstData.Episode, firstData.Timestamp);
      message.channel.send(frinkiac.memeURL(
        caption.data.Frame.Episode,
        caption.data.Frame.Timestamp,
        toSubtitleString(caption.data.Subtitles)
      ))
        .catch(error => message.channel.send(error));
      break;
  }

  // const embed = new Discord.RichEmbed()
  // .setTitle("This is your title, it can hold 256 characters")
  // .setAuthor("Author Name", "https://i.imgur.com/lm8s41J.png")
  // /*
  //  * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
  //  */
  // .setColor(0x00AE86)
  // .setDescription("This is the main body of text, it can hold 2048 characters.")
  // .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
  // .setImage("http://i.imgur.com/yVpymuV.png")
  // .setThumbnail("http://i.imgur.com/p2qNFag.png")
  // /*
  //  * Takes a Date object, defaults to current date.
  //  */
  // .setTimestamp()
  // .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  // .addField("This is a field title, it can hold 256 characters",
  //   "This is a field value, it can hold 2048 characters.")
  // /*
  //  * Inline fields may not display as inline if the thumbnail and/or image is too big.
  //  */
  // .addField("Inline Field", "They can also be inline.", true)
  // /*
  //  * Blank field, useful to create some space.
  //  */
  // .addBlankField(true)
  // .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);
});

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

client.login(process.env.TOKEN || client.config.token);