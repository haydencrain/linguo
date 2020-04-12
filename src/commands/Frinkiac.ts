import { FrinkiacService, Subtitle, CaptionResponse } from '../services/frinkiac/FrinkiacService';
import { Message } from 'discord.js';

export class FrinkiacCommands {
  constructor(private frinkiacService: FrinkiacService) {}

  private toSubtitleString(subtitles: Subtitle[]) {
    let subtitleString = '';
    subtitles.forEach(subtitle => {
      subtitleString += subtitle.Content + ' \n';
    });
    return subtitleString;
  }

  private sendCaption(channel: Message['channel'], caption: CaptionResponse) {
    const {
      Subtitles,
      Frame: { Episode, Timestamp }
    } = caption;
    const message = this.toSubtitleString(Subtitles);
    const image = this.frinkiacService.imageUrl(Episode, Timestamp.toString());
    channel.send(message, { files: [image] });
  }

  async searchQuote(message: Message, args: string[]) {
    const search = args.join(' ');
    const [frame] = await this.frinkiacService.search(search);
    const caption = await this.frinkiacService.caption(frame.Episode, frame.Timestamp.toString());
    this.sendCaption(message.channel, caption);
  }

  async getScreencap(message: Message, args: string[]) {
    const [episode, timestamp] = args;
    const caption = await this.frinkiacService.caption(episode, timestamp);
    if (caption instanceof Error) {
      throw new Error('Image cannot be found! Make sure you have entered both an episode number and timestamp.');
    }
    this.sendCaption(message.channel, caption);
  }

  async getRandomScreencap(message: Message, args: string[]) {
    const caption = await this.frinkiacService.random();
    this.sendCaption(message.channel, caption);
  }

  async makeMemeImage(message: Message, args: string[]) {
    const [frame] = await this.frinkiacService.search(args.join(' '));
    const { Subtitles, Frame } = await this.frinkiacService.caption(frame.Episode, frame.Timestamp.toString());
    await message.channel.send(
      this.frinkiacService.memeUrl(Frame.Episode, Frame.Timestamp.toString(), this.toSubtitleString(Subtitles))
    );
  }
}
