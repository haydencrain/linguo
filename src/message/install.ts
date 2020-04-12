import { Bot } from '../bot/Bot';
import { MessageHandler } from './MessageHandler';

export function installMessageHandler({ bot }: { bot: Bot }): { messageHandler: MessageHandler } {
  const messageHandler = new MessageHandler(bot);
  return { messageHandler };
}
