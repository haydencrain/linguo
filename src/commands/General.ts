import { Message } from 'discord.js';

export class GeneralCommands {
  constructor() {}

  async isLinguoDead(message: Message, args: string[]) {
    const response = await message.channel.send('Linguo dead?');
    response.edit('Linguo IS dead!');
  }

  async repeatMessage(message: Message, args: string[]) {
    // TODO: check if has DELETE permissions before running delete method
    // await message.delete();
    message.channel.send(args.join(' '));
  }
}
