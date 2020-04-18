import { Message, Guild, StreamDispatcher, TextChannel, DMChannel, NewsChannel, VoiceConnection } from 'discord.js';
import ytdl from 'ytdl-core';

type MessageChannel = TextChannel | DMChannel | NewsChannel;

class SongDetail {
  url: string;
  title: string;
  requester: string;

  constructor({ url, title, requester }: { url: string; title: string; requester: string }) {
    this.url = url;
    this.title = title;
    this.requester = requester;
  }
}

class GuildPlaylist {
  guild: Guild;
  queue: SongDetail[] = [];
  currentSong?: SongDetail;
  isPlaying: boolean = false;
  private dispatcher?: StreamDispatcher;
  private messageChannel?: MessageChannel;

  constructor(guild: Guild) {
    this.guild = guild;
  }

  private bindDispatcherEvents() {
    this.dispatcher.on('finish', () => this.playNextSong());
    this.dispatcher.on('error', (err) => console.log(err));
  }

  private playNextSong() {
    this.isPlaying = false;
    this.dispatcher.destroy();
    this.play();
  }

  get guildId() {
    return this.guild.id;
  }

  get queueDetails() {
    const listLimit = 15;
    let songItem: string[] = [];
    this.queue.forEach((song, i) => {
      songItem.push(`${i + 1}. ${song.title} - Requested by: ${song.requester}`);
    });

    let queueDetails = `__**Music Queue:**__ Currently **${this.queue.length}** songs queued`;
    if (this.queue.length > listLimit) {
      queueDetails += ' *[Only next 15 shown]*';
    }
    if (this.queue.length == 0) {
      queueDetails += '\nAdd some songs to the queue with the "add" command!';
    } else {
      queueDetails += `\n\`\`\`${songItem.slice(0, listLimit).join('\n')}\`\`\``;
    }
    return queueDetails;
  }

  setMessageChannel(channel: MessageChannel): void {
    this.messageChannel = channel;
  }

  async add(url: string, requester: string): Promise<SongDetail> {
    try {
      const info = await ytdl.getInfo(url);
      const song = new SongDetail({
        url,
        title: info.title,
        requester
      });
      this.queue.push(song);
      return song;
    } catch (err) {
      throw new Error('Invalid youtube link: ' + err.message);
    }
  }

  play(): void {
    const { voice: voiceChannel } = this.guild;
    if (!voiceChannel) {
      this.messageChannel.send('Please join a voice channel first!');
      return undefined;
    }

    if (this.isPlaying) {
      this.messageChannel.send('A song is already playing!');
      return undefined;
    }

    this.currentSong = this.queue.shift();
    if (!this.currentSong) {
      this.messageChannel.send('No more songs left in the queue!');
      return undefined;
    }

    this.startPlayback(this.currentSong, voiceChannel.connection);
  }

  private async startPlayback(song: SongDetail, connection: VoiceConnection): Promise<void> {
    const { url, title, requester } = song;
    const stream = await ytdl(url, { filter: 'audioonly' });
    this.dispatcher = connection.play(stream);
    this.isPlaying = true;
    this.bindDispatcherEvents();
    this.messageChannel.send(`Playing: **${title}** as requested by: **${requester}**`);
  }

  skip(): void {
    this.playNextSong();
  }

  pause(): void {
    this.dispatcher?.pause();
    this.messageChannel.send(`Playback Paused!`);
  }

  resume(): void {
    this.dispatcher?.resume();
    this.messageChannel.send(`Playback Resumed!`);
  }
}

export class VoiceChannelCommands {
  guildPlaylists: GuildPlaylist[] = [];

  constructor(private errorHandler?: (err: Error, errMsg: string, channel: Message['channel']) => void) {}

  private getGuildPlaylist(guild: Guild): GuildPlaylist {
    let playlist = this.guildPlaylists.find((p) => p.guildId === guild.id);
    if (!playlist) {
      playlist = new GuildPlaylist(guild);
      this.guildPlaylists.push(playlist);
    }
    return playlist;
  }

  async join(message: Message, args: string[]) {
    const {
      member: { voice },
      guild,
      channel
    } = message;

    if (!voice.channel) {
      throw new Error('Unable to connect to voice channel! Ensure that you have joined a voice channel');
    }
    try {
      await voice.channel.join();
      // creates playlist if none exists
      this.getGuildPlaylist(guild);
      channel.send(`Connected to channel ${voice.channel.name}`);
    } catch (err) {
      this.errorHandler?.(err, err.message, channel);
    }
  }

  async leave(message: Message, args: string[]) {
    const {
      member: { voice },
      channel
    } = message;

    if (!voice.channel) {
      throw new Error('Not currently in a voice channel!');
    }
    try {
      voice.channel.leave();
      channel.send(`Left channel ${voice.channel.name}`);
    } catch (err) {
      this.errorHandler?.(err, err.message, message.channel);
    }
  }

  async add(message: Message, args: string[]) {
    const { guild, author, channel } = message;
    const [url] = args;

    if (!url) {
      throw new Error('Enter a url after the "add" command');
    }

    const guildPlaylist = this.getGuildPlaylist(guild);
    const song = await guildPlaylist.add(url, author.username);
    channel.send(`Added **${song.title}** to the queue`);
  }

  getQueue(message: Message, args: string[]) {
    const { guild, channel } = message;
    const guildPlaylist = this.getGuildPlaylist(guild);
    channel.send(guildPlaylist.queueDetails);
  }

  play(message: Message, args: string[]) {
    const { guild, channel } = message;
    const guildPlaylist = this.getGuildPlaylist(guild);
    guildPlaylist.setMessageChannel(channel);
    guildPlaylist.play();
  }

  pause(message: Message, args: string[]) {
    const { guild } = message;
    const guildPlaylist = this.getGuildPlaylist(guild);
    guildPlaylist.pause();
  }

  resume(message: Message, args: string[]) {
    const { guild } = message;
    const guildPlaylist = this.getGuildPlaylist(guild);
    guildPlaylist.resume();
  }

  skip(message: Message, args: string[]) {
    const { guild } = message;
    const guildPlaylist = this.getGuildPlaylist(guild);
    guildPlaylist.skip();
  }
}
