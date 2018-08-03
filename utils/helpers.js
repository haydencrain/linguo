const isDevelopment = () => {
  return process.env.ENVIRONMENT === 'development';
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
  sendErrorMessage,
  determinePrefixOrMentioned,
  toSubtitleString
}

