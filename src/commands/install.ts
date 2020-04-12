import { Message } from 'discord.js';
import { FrinkiacService } from '../services/frinkiac/FrinkiacService';
import { Bot } from '../bot/Bot';
import { GeneralCommands } from './General';
import { FrinkiacCommands } from './Frinkiac';
import { Command } from '../classes/Command';

export function installCommands({ bot, frinkiacService }: { bot: Bot; frinkiacService: FrinkiacService }) {
  const getHelp = (message: Message, args: string[]) => {
    message.channel.send(bot.commandDescriptions);
  };

  const generalCommands = new GeneralCommands();
  const frinkiacCommands = new FrinkiacCommands(frinkiacService);

  bot.addCommands([
    new Command({
      name: 'help',
      description: 'Displays available commands and a description of how to use each',
      exec: (...args) => getHelp(...args)
    }),
    new Command({
      name: 'dead?',
      description: "Ask Linguo if he's dead",
      exec: (...args) => generalCommands.isLinguoDead(...args)
    }),
    new Command({
      name: 'say',
      description: 'Linguo will repeat your message',
      exec: (...args) => generalCommands.repeatMessage(...args)
    }),
    new Command({
      name: 'search',
      description:
        'Search for a particular quote from The Simpsons, and Linguo will return the most relevant screencap',
      exec: (...args) => frinkiacCommands.searchQuote(...args)
    }),
    new Command({
      name: 'image',
      description:
        "Enter a particaluar episode number and timestamp, and Linguo will return the specific screencap. e.g. 'S05E08 116632'",
      exec: (...args) => frinkiacCommands.getScreencap(...args)
    }),
    new Command({
      name: 'random',
      description: 'Linguo will return a random image',
      exec: (...args) => frinkiacCommands.getRandomScreencap(...args)
    }),
    new Command({
      name: 'meme',
      description:
        'Search for a particular quote from The Simpsons, and Linguo will return an image with the subtitles included',
      exec: (...args) => frinkiacCommands.makeMemeImage(...args)
    })
  ]);
}
