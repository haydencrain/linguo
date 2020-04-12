import { Message } from 'discord.js';
import { Bot } from '../bot/Bot';

export class Argument {
  name: string;
  params: string[];
  constructor(private args: string) {
    const argsArr = args.trim().split(/ +/g);
    this.name = argsArr.shift();
    this.params = argsArr;
  }
}

export class MessageHandler {
  constructor(private bot: Bot) {
    this.bot.on('message', this.onMessage);
  }

  private onMessage = (message: Message) => {
    if (message.author.bot) {
      return;
    }

    if (this.bot.isSelf(message.author.id) || !this.bot.isMentioned(message.content)) {
      return;
    }

    const args = this.bot.stripMention(message.content);
    const argument = new Argument(args);
    this.runCommand(argument, message);
  };

  private runCommand(argument: Argument, message: Message) {
    const command = this.bot.getCommand(argument.name);
    // TODO: move error handler here
    command.exec(message, argument.params);
  }
}
