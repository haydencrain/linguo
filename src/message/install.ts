import { Bot } from '../bot/Bot';
import { MessageHandler } from './MessageHandler';
import { FrinkiacService } from '../services/frinkiac/FrinkiacService';
import { Message } from 'discord.js';

export function installMessageHandler({
  bot,
  frinkiacService,
  error
}: {
  bot: Bot;
  frinkiacService: FrinkiacService;
  error(err: Error);
}) {
  const errorHandler = (err: Error, errMsg: string, channel: Message['channel']) => {
    error(err);
    channel.send('Error: ' + errMsg, { files: [frinkiacService.imageUrl('S12E18', '1232440')] });
  };

  const messageHandler = new MessageHandler(bot, errorHandler);
  return { messageHandler };
}
