import frinkiac from '../utils/frinkiac';
import helpers from '../utils/helpers';

const isLinguoDead = async (message, args) => {
  var m = await message.channel.send('Linguo dead?');
  m.edit('Linguo IS dead!');
};

const repeatMessage = async (message, args) => {
  try {
    await message.delete().catch(owo => { console.log(owo); });
    await message.channel.send(args.join(' '));
  }
  catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const searchQuote = async (message, args) => {
  try {
    var response = await frinkiac.search(args.join(' '));
    var firstData = response.data[0];
    var caption = await frinkiac.caption(firstData.Episode, firstData.Timestamp);
    await message.channel.send(helpers.toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
  }
  catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const getScreencap = async (message, args) => {
  try {
    var caption = await frinkiac.caption(args[0], args[1]);
    if (caption instanceof Error)
      throw new Error('Image cannot be found! Make sure you have entered both an episode number and timestamp.');
    message.channel.send(helpers.toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
  }
  catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const getRandomScreencap = async (message, args) => {
  try {
    var caption = await frinkiac.random();
    await message.channel.send(helpers.toSubtitleString(caption.data.Subtitles), toImageAttachment(caption));
  }
  catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const makeMemeImage = async (message, args) => {
  try {
    var response = await frinkiac.search(args.join(' '));
    var firstData = response.data[0];
    var caption = await frinkiac.caption(firstData.Episode, firstData.Timestamp);
    await message.channel.send(frinkiac.memeURL(
      caption.data.Frame.Episode,
      caption.data.Frame.Timestamp,
      helpers.toSubtitleString(caption.data.Subtitles)
    ));
  }
  catch (err) { helpers.sendErrorMessage(err, err.message, message); }
};

const toImageAttachment = (caption) => {
  return ({
    files: [frinkiac.getImageUrl(
      caption.data.Frame.Episode,
      caption.data.Frame.Timestamp
    )]
  });
};

export default {
  isLinguoDead,
  repeatMessage,
  searchQuote,
  getScreencap,
  getRandomScreencap,
  makeMemeImage,
}
