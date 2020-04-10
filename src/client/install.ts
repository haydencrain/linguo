import { Client } from 'discord.js';

const ClientMessages = {
  loggedIn: (client) => `Logged in as ${client.user.tag}! Handling ${client.guilds.cache.array().length} server(s)`,
  disconnected: 'Disconnected!',
};

export function installClient(): { client: Client } {
  const client = new Client();

  const handleReady = () => {
    console.log(ClientMessages.loggedIn(client));
    client.user.setActivity('`Linguo help` for help');
  };
  const handleDisconnect = () => console.log(ClientMessages.disconnected);
  client.on('ready', handleReady);
  client.on('disconnect', handleDisconnect);
  return { client };
}
