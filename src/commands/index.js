import generalCommands from './generalCommands';
import voiceChannelCommands from './voiceChannelCommands';

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
    execute: generalCommands.isLinguoDead
  },
  'say': {
    description: 'Linguo will repeat your message',
    execute: generalCommands.repeatMessage
  },
  'search': {
    description: 'Search for a particular quote from The Simpsons, and Linguo will return the most relevant screencap',
    execute: generalCommands.searchQuote
  },
  'image': {
    description: 'Enter a particaluar episode number and timestamp, and Linguo will return the specific screencap. e.g. \'S05E08 116632\'',
    execute: generalCommands.getScreencap
  },
  'random': {
    description: 'Linguo will return a random image.',
    execute: generalCommands.getRandomScreencap
  },
  'meme': {
    description: 'Search for a particular quote from The Simpsons, and Linguo will return an image with the subtitles included',
    execute: generalCommands.makeMemeImage
  },
  'join': {
    description: 'Join the voice channel you are currently in',
    execute: voiceChannelCommands.joinChannel
  },
  'leave': {
    description: 'Leave the current voice channel',
    execute: voiceChannelCommands.leaveChannel
  },
  'add': {
    description: 'Add a song to a queue',
    execute: voiceChannelCommands.addSong
  },
  'queue': {
    description: 'Get the current queue of songs',
    execute: voiceChannelCommands.getQueue
  },
  'play': {
    description: 'Play the current queue of songs',
    execute: voiceChannelCommands.playQueue
  },
  'skip': {
    description: 'Skip the current song',
    execute: () => {/*empty function as it is handled elsewhere*/}
  },
  'pause': {
    description: 'Pause the current song',
    execute: () => {/*empty function as it is handled elsewhere*/ }
  },
  'resume': {
    description: 'Resume the current song',
    execute: () => {/*empty function as it is handled elsewhere*/ }
  }
};

export default index;
