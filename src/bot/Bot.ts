import { Client, ClientOptions, Message } from 'discord.js';
import { Command } from '../classes/Command';

export type BotOptions = {
  prefix?: string;
};

export class Bot extends Client {
  commands: Command[] = [];

  constructor(private opts: BotOptions, clientOpts?: ClientOptions) {
    super(clientOpts);
  }

  get prefix() {
    return this.opts.prefix;
  }

  get commandDescriptions() {
    let description = '```ini\n[Current available commands]\n\n';
    this.commands.forEach(command => {
      description += `[${command.name}]: ${command.description}\n\n`;
    });
    description += '```';
    return description;
  }

  isSelf(id: string) {
    return this.user.id === id;
  }

  isMentioned(content: string) {
    return content.toLowerCase().startsWith(this.prefix) || content.replace(/[<@!>]/g, '').startsWith(this.user.id);
  }

  stripMention(content: string) {
    if (content.startsWith(this.prefix)) {
      return content.slice(this.prefix.length);
    } else {
      return content.replace(/[<@!>]/g, '').slice(this.user.id.length);
    }
  }

  addCommand(command: Command) {
    this.commands.push(command);
  }

  addCommands(commands: Command[]) {
    this.commands.push(...commands);
  }

  getCommand(name: string) {
    const command = this.commands.find(c => c.name === name);
    if (!command) {
      throw new Error(`Command \`${name}\` does not exist!`);
    }
    return command;
  }
}
