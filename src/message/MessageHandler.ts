import { Message } from 'discord.js';
import { Bot } from '../bot/Bot';
import { Argument } from '../classes/Argument';

export class MessageHandler {
  constructor(
    private bot: Bot,
    private errorHandler: (err: Error, errMsg: string, channel: Message['channel']) => void
  ) {
    this.bot.on('message', (...args) => this.onMessage(...args));
  }

  private onMessage(message: Message) {
    if (message.author.bot) {
      return;
    }

    if (this.bot.isSelf(message.author.id) || !this.bot.isMentioned(message.content)) {
      return;
    }

    const args = this.bot.stripMention(message.content);
    const argument = new Argument(args);
    this.runCommand(argument, message);
  }

  private runCommand(argument: Argument, message: Message) {
    try {
      const command = this.bot.getCommand(argument.name);
      if (!command) {
        throw new Error('Command not found!');
      }
      command.exec(message, argument.params);
    } catch (err) {
      this.errorHandler(err, err.message, message.channel);
    }
  }
}
