import { FrinkiacService } from '../services/frinkiac/FrinkiacService';
import { Message } from 'discord.js';

export class FrinkiacCommands {
  constructor(
    private frinkiacService: FrinkiacService,
    private errorHandler?: (err: Error, errMsg: string, channel: Message['channel']) => void
  ) {}

  async searchQuote(message: Message, args: string[]) {
    try {
      const [data1] = await this.frinkiacService.search(args.join(' '));
      const caption = await this.frinkiacService.caption(data1.Episode, data1.Timestamp);
      await message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
    } catch (err) {
      this.errorHandler?.(err, err.message, message.channel);
    }
  }

  async getScreencap(message: Message, args: string[]) {
    try {
      const caption = await this.frinkiacService.caption(args[0], args[1]);
      if (caption instanceof Error)
        throw new Error('Image cannot be found! Make sure you have entered both an episode number and timestamp.');
      message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
    } catch (err) {
      this.errorHandler?.(err, err.message, message.channel);
    }
  }

  async getRandomScreencap(message: Message, args: string[]) {
    try {
      const caption = await this.frinkiacService.random();
      message.channel.send(toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
    } catch (err) {
      this.errorHandler?.(err, err.message, message.channel);
    }
  }

  async makeMemeImage(message: Message, args: string[]) {
    try {
      const [data1] = await this.frinkiacService.search(args.join(' '));
      var caption = await this.frinkiacService.caption(data1.Episode, data1.Timestamp);
      await message.channel.send(
        this.frinkiacService.meme(
          caption.data.Frame.Episode,
          caption.data.Frame.Timestamp,
          toSubtitleString(caption.data.Subtitles)
        )
      );
    } catch (err) {
      this.errorHandler?.(err, err.message, message.channel);
    }
  }
}

const toSubtitleString = (subtitles: { Content: string }[]) => {
  let subtitleString = '';
  subtitles.forEach(subtitle => {
    subtitleString += subtitle.Content + ' \n';
  });
  return subtitleString;
};

const toImageAttachment = (caption: any) => {
  return {
    files: [this.imageUrl(caption.data.Frame.Episode, caption.data.Frame.Timestamp)]
  };
};
