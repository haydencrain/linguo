import { Message } from 'discord.js';

export class GeneralCommands {
  constructor(private errorHandler?: (err: Error, errMsg: string, channel: Message['channel']) => void) {}

  async isLinguoDead(message: Message, args: string[]) {
    try {
      const response = await message.channel.send('Linguo dead?');
      response.edit('Linguo IS dead!');
    } catch (err) {
      this.errorHandler?.(err, err.message, message.channel);
    }
  }

  async repeatMessage(message: Message, args: string[]) {
    try {
      // TODO: check if has DELETE permissions before running delete method
      // await message.delete();
      message.channel.send(args.join(' '));
    } catch (err) {
      this.errorHandler?.(err, err.message, message.channel);
    }
  }
}
