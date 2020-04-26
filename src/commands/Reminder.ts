import { Message, TextChannel, DMChannel, NewsChannel } from 'discord.js';

const THIRTY_MINUTES = 1000 * 60 * 30;
const ONE_HOUR = THIRTY_MINUTES * 2;
const WATER_GIF = 'https://media0.giphy.com/media/3orif8UAkN2dvt8MGA/source.gif';

type Channel = TextChannel | DMChannel | NewsChannel;

class WaterReminder {
  shouldRemind: boolean = false;

  constructor(private channel: Channel) {}

  subscribe() {
    this.shouldRemind = true;
    this.reminderLoop();
  }

  unsubscribe() {
    this.shouldRemind = false;
  }

  private reminderLoop() {
    setTimeout(() => {
      if (this.shouldRemind) {
        this.channel.send('REMEMBER TO DRINK WATER KINGS', { files: [WATER_GIF] });
        this.reminderLoop();
      }
    }, ONE_HOUR);
  }
}

export class ReminderCommands {
  reminders = new Map<string, WaterReminder>();

  constructor() {}

  private startReminder(message: Message) {
    const { channel } = message;
    const reminder = new WaterReminder(channel);
    this.reminders.set(channel.id, reminder);
    reminder.subscribe();
    message.channel.send('Reminder Set!');
  }

  private stopReminder(message: Message) {
    const { channel } = message;
    const reminder = this.reminders.get(channel.id);
    if (!reminder) {
      message.channel.send('No reminders have been set on this channel!');
      return;
    }
    reminder.unsubscribe();
    this.reminders.delete(channel.id);
    message.channel.send('Reminder Removed!');
  }

  reminder(message: Message, args: string[]) {
    const [type] = args;
    switch (type) {
      case 'start':
        this.startReminder(message);
        break;
      case 'stop':
        this.stopReminder(message);
        break;
      default:
        throw new Error(`argument \`${type}\` doesn't exist for reminders!`);
    }
  }
}
