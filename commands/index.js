import commands from './commands';

const getDescriptions = async (message, args) => {
  var descriptions = '```ini\n[Current available commands]\n\n';
  for (var key in index) {
    if (index.hasOwnProperty(key)) {
      descriptions += `[${key}]: ${index[key].description}\n\n`;
    }
  }
  descriptions += '```';
  await message.channel.send(descriptions);
};

const index = {
  'help': {
    description: 'Displays available commands and a description of how to use each',
    execute: getDescriptions
  },
  'dead?': {
    description: 'Ask Linguo if he\'s dead',
    execute: commands.isLinguoDead
  },
  'say': {
    description: 'Linguo will repeat your message',
    execute: commands.repeatMessage
  },
  'search': {
    description: 'Search for a particular quote from The Simpsons, and Linguo will return the most relevant screencap',
    execute: commands.searchQuote
  },
  'image': {
    description: 'Enter a particaluar episode number and timestamp, and Linguo will return the specific screencap. e.g. \'S05E08 116632\'',
    execute: commands.getScreencap
  },
  'random': {
    description: 'Linguo will return a random image.',
    execute: commands.getRandomScreencap
  },
  'meme': {
    description: 'Search for a particular quote from The Simpsons, and Linguo will return an image with the subtitles included',
    execute: commands.makeMemeImage
  },
};

export default index;
