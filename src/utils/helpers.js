const isDevelopment = () => {
  return process.env.ENVIRONMENT === 'development';
};

const getMessageArgs = (client, message) => {
  // return if message is from bot or is a client message
  if (message.author.id === client.user.id || message.author.bot)
    return null;

  // determine which prefix is used, return if message does not contain prefix
  var prefix = determinePrefixOrMentioned(message, client);
  if (message.content.indexOf(prefix) !== 0)
    return null;

  // split into command and args
  return message.content.slice(prefix.length).trim().split(/ +/g);
}

const sendErrorMessage = (err, errMsg, message) => {
  console.log(err);
  message.channel.send('Error: ' + errMsg, { files: ['https://frinkiac.com/img/S12E18/1232440.jpg'] });
};

const determinePrefixOrMentioned = (message, client) => {
  const prefixMention = new RegExp(`<@!?${client.user.id}>`);
  return message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : client.config.prefix;
};

const toSubtitleString = (subtitles) => {
  var subtitleString = '';
  subtitles.forEach(subtitle => { subtitleString += subtitle.Content + ' \n'; });
  return subtitleString;
};

export default {
  isDevelopment,
  getMessageArgs,
  sendErrorMessage,
  determinePrefixOrMentioned,
  toSubtitleString
};

