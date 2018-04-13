
exports.determinePrefixOrMentioned = (message, client) => {
  const prefixMention = new RegExp(`<@!?${client.user.id}>`)
  return message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : client.config.prefix;
}
