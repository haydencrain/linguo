import { Client, ClientOptions, Message } from 'discord.js';

export type BotOptions = {
  prefix?: string;
};

export class Command {
  name: string;
  description: string;
  exec: (message: Message, args: string[]) => void;

  constructor({
    name,
    description,
    exec
  }: {
    name: string;
    description: string;
    exec: (message: Message, args: string[]) => void;
  }) {
    this.name = name;
    this.description = description;
    this.exec = exec;
  }
}

export class Bot extends Client {
  commands: Command[] = [];

  constructor(private opts: BotOptions, clientOpts?: ClientOptions) {
    super(clientOpts);
  }

  get mentionTag() {
    return `<@!${this.user.id}>`;
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
    return content.startsWith(this.prefix) || content.startsWith(this.mentionTag);
  }

  stripMention(content: string) {
    if (content.startsWith(this.prefix)) {
      return content.slice(this.prefix.length);
    } else {
      return content.slice(this.mentionTag.length);
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
      throw new Error('Command Not Found');
    }
    return command;
  }
}
