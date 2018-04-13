
// Check that node version is the required node version
if (process.version.slice(1).split('.')[0] < 8)
  throw new Error('Node 8.0.0 or higher is required. Please update Node on your system');
    
// const plugins = require('./plugins/index.js');
const Discord = require('discord.js');
const client = new Discord.Client();
client.config = require('./config.js');
const helpers = require('./helpers.js');
const colors = require('./colors.js');

// plugins
const plugins = require('./plugins');
const frinkiac = plugins.frinkiac;

/**************************************************************************************************
Client actions
**************************************************************************************************/
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Serving ${client.channels.array.length} channels`);
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
client.on('message', async message => {
  // return if message is from bot or is a client message
  if (message.author.id === client.user.id || message.author.bot) return;

  // determine which prefix is used, return if message does not contain prefix 
  var prefix = helpers.determinePrefixOrMentioned(message, client);
  if (message.content.indexOf(prefix) !== 0) return;

  // split into command and args
  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift();

  var caption, query, search, firstData;
  switch (command) {
    case 'help':
      message.channel.send('nah sorry can\'t help you');
      break;

    case 'dead?':
      var m = await message.channel.send('Linguo dead?');
      m.edit('Linguo IS dead!');
      break;
    
    case 'say': 
      message.delete().catch(owo => { message.send(owo);});    
      message.channel.send(args.join(' '));
      break;
    
    case 'search':
      query = args.join(' ');
      search = await frinkiac.search(query);
      firstData = search.data[0];
      caption = await frinkiac.caption(firstData.Episode, firstData.Timestamp);
      message.channel.send(caption.data.Subtitles[0].Content, { files: [frinkiac.imageURL(firstData.Episode, firstData.Timestamp)] })
        .catch(error => message.send(error));
      break;

    case 'image':
      caption = await frinkiac.caption(args[0], args[1]);  
      message.channel.send(caption.data.Subtitles[0].Content, { files: [frinkiac.imageURL(args[0], args[1])] })
        .catch(error => message.send('Image cannot be found! Make sure you have entered both an episode number and timestamp.'));
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

client.login(client.config.token);