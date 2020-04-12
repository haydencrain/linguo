import { Bot } from '../bot/Bot';
import { MessageHandler } from './MessageHandler';
import { FrinkiacService } from '../services/frinkiac/FrinkiacService';
import { Message } from 'discord.js';

export function installMessageHandler({
  bot,
  frinkiacService,
  errorHandler
}: {
  bot: Bot;
  frinkiacService: FrinkiacService;
  errorHandler(err: Error, errMsg: string, channel: Message['channel']): void;
}) {
  const messageHandler = new MessageHandler(bot, errorHandler);
  return { messageHandler };
}
