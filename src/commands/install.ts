import { Message } from 'discord.js';
import { FrinkiacService } from '../services/frinkiac/FrinkiacService';
import { Bot, Command } from '../bot/Bot';
import { GeneralCommands } from './General';
import { FrinkiacCommands } from './Frinkiac';

export function installCommands({
  bot,
  frinkiacService,
  error
}: {
  bot: Bot;
  frinkiacService: FrinkiacService;
  error(err: Error);
}) {
  const errorHandler = (err: Error, errMsg: string, channel: Message['channel']) => {
    console.log('hello');
    error(err);
    channel.send('Error: ' + errMsg, { files: [frinkiacService.imageUrl('S12E18', '1232440')] });
  };

  const getHelp = (message: Message, args: string[]) => {
    message.channel.send(bot.commandDescriptions);
  };

  const generalCommands = new GeneralCommands(errorHandler);
  const frinkiacCommands = new FrinkiacCommands(frinkiacService, errorHandler);

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
      name: 'random',
      description: 'Linguo will return a random image',
      exec: (...args) => frinkiacCommands.getRandomScreencap(...args)
    })
  ]);
}
