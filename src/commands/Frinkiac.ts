import { FrinkiacService, Frame, Subtitle } from '../services/frinkiac/FrinkiacService';
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

  toImageAttachment({ Episode, Timestamp }: Frame): { files: string[] } {
    return {
      files: [this.frinkiacService.imageUrl(Episode, Timestamp.toString())]
    };
  }

  async searchQuote(message: Message, args: string[]) {
    const [data1] = await this.frinkiacService.search(args.join(' '));
    const caption = await this.frinkiacService.caption(data1.Episode, data1.Timestamp.toString());
    await message.channel.send(this.toSubtitleString(caption.Subtitles), this.toImageAttachment(caption.Frame));
  }

  async getScreencap(message: Message, args: string[]) {
    const caption = await this.frinkiacService.caption(args[0], args[1]);
    if (caption instanceof Error)
      throw new Error('Image cannot be found! Make sure you have entered both an episode number and timestamp.');
    message.channel.send(this.toSubtitleString(caption.Subtitles), this.toImageAttachment(caption.Frame));
  }

  async getRandomScreencap(message: Message, args: string[]) {
    const caption = await this.frinkiacService.random();
    message.channel.send(this.toSubtitleString(caption.Subtitles), this.toImageAttachment(caption.Frame));
  }

  async makeMemeImage(message: Message, args: string[]) {
    const [data1] = await this.frinkiacService.search(args.join(' '));
    var caption = await this.frinkiacService.caption(data1.Episode, data1.Timestamp.toString());
    await message.channel.send(
      this.frinkiacService.memeUrl(
        caption.Frame.Episode,
        caption.Frame.Timestamp.toString(),
        this.toSubtitleString(caption.Subtitles)
      )
    );
  }
}
