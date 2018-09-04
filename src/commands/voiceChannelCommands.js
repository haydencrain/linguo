import helpers from '../utils/helpers';
import ytdl from 'ytdl-core';
const passes = 1;
let queue = {};

const playQueue = async (message) => {
  try {
    const id = message.guild.id;
    if (!queue[id])
      throw new Error('There are currently no songs in the queue! Add some songs to the queue first');
    if (!message.guild.voiceConnection)
      throw new Error('Add me to a voice channel first by using the command "join"');

    queue[id].playing = true;
    console.log(queue);
    await play(queue[id].songs.shift(), id, message);

  } catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const play = async (song, id, message) => {
  try {
    console.log(song);
    if (!song) {
      await message.channel.sendMessage('Song Queue is empty');
      queue[id].playing = false;
      return;
    }
    await message.channel.sendMessage(`Playing: **${song.title}** as requested by: **${song.requester}**`);
    const dispatcher = message.guild.voiceConnection.playStream(ytdl(song.url, { audioonly: true }), { passes: passes });
    const collector = message.channel.createCollector(m => m);
    collector.on('message', async m => {
      let args = helpers.getMessageArgs(message.client, m);
      if (!args) return;
      let command = args.shift().toLowerCase();
      switch (command) {
        case 'pause':
          await m.channel.sendMessage('Paused Playback!');
          dispatcher.pause();
          break;
        case 'resume':
          await m.channel.sendMessage('Resumed Playback!');
          dispatcher.resume();
          break;
        case 'skip':
          await m.channel.sendMessage('Song Skipped!');
          dispatcher.end();
          break;
        default:
          break;
      }
    });
    dispatcher.on('end', async () => {
      collector.stop();
      await play(queue[id].songs.shift(), id, message);
    });
    dispatcher.on('error', async (err) => {
      await message.channel.sendMessage('error: ' + err);
      collector.stop();
      await play(queue[id].songs.shift(), id, message);
    });
  } catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const addSong = async (message, args) => {
  try {
    const url = args[0];
    if (!url)
      throw new Error('Enter a url after the "add" command');
    await ytdl.getInfo(url, async (err, info) => {
      if (err)
        throw new Error('Invalid youtube link: ' + err.message);
      const id = message.guild.id;
      if (!queue.hasOwnProperty(message.guild.id)) {
        queue[id] = {};
        queue[id].playing = false;
        queue[id].songs = [];
      }
      queue[id].songs.push({
        url: url,
        title: info.title,
        requester: message.author.username
      });
      await message.channel.sendMessage(`Added **${info.title}** to the queue`);
    });
  } catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const getQueue = async (message) => {
  try {
    const id = message.guild.id;
    if (!queue[id])
      return await message.channel.sendMessage('Queue is empty! Add some songs to the queue first with the "add" command');
    let toSend = [];
    queue[id].songs.forEach((song, i) => {
      toSend.push(`${i + 1}. ${song.title} - Requested by: ${song.requester}`);
    });
    await message.channel.sendMessage(`__**Music Queue:**__ Currently **${toSend.length}** songs queued ${(toSend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${toSend.slice(0, 15).join('\n')}\`\`\``);
  } catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const joinChannel = async (message) => {
  try {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice')
      throw new Error('Unable to connect to voice channel! Ensure that you have joined a voice channel');
    await voiceChannel.join();
    await message.channel.send(`Connected to channel ${voiceChannel.name}`);
  }
  catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const leaveChannel = async (message) => {
  try {
    const clientMember = await message.guild.fetchMember(message.client.user);
    const voiceChannel = clientMember.voiceChannel;
    if (!voiceChannel)
      throw new Error('Not currently in a voice channel!');
    await voiceChannel.leave();
    await message.channel.send(`Left channel ${voiceChannel.name}`);
  } catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

export default {
  addSong,
  getQueue,
  playQueue,
  joinChannel,
  leaveChannel
};
