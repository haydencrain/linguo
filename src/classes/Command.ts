import { Message } from 'discord.js';

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
