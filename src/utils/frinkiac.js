import axios from 'axios';
import * as queryString from 'query-string';
import util from 'util';

const SEARCH_URL = 'https://frinkiac.com/api/search?%s';
const MEME_URL = 'https://frinkiac.com/meme/%s/%s.jpg?%s';
const CAPTION_URL = 'https://frinkiac.com/api/caption?%s';
const IMAGE_URL = 'https://frinkiac.com/img/%s/%s.jpg';
const FAVICON = 'https://frinkiac.com/favicon.ico';
const RAND_URL = 'https://frinkiac.com/api/random';
const HERO_URL = 'https://frinkiac.com/img/hero.gif';

const searchURL = query => {
  query = queryString.stringify({ q: query || '' });
  return util.format(SEARCH_URL, query);
};

const memeURL = (episode, timestamp, caption) => {
  // b64lines=Ymx1cnN0IG9mIHRpbWVzIQ==
  // eventually clean emojis
  if (typeof Buffer === 'function') {
    caption = new Buffer(caption).toString('base64');
  } else if (window && typeof window.btoa === 'function') {
    caption = window.btoa(caption);
  }

  const query = queryString.stringify({
    b64lines: caption
  });

  return util.format(MEME_URL, episode, timestamp, query);
};

const captionURL = (episode, timestamp) => {
  const query = queryString.stringify({ e: episode, t: timestamp });
  return util.format(CAPTION_URL, query);
};

const imageURL = (episode, timestamp) => {
  return util.format(IMAGE_URL, episode, timestamp);
};

const randomURL = () => {
  return util.format(RAND_URL);
};

const heroURL = () => {
  return util.format(HERO_URL);
};

const caption = (episode, timestamp) => {
  return axios(captionURL(episode, timestamp))
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

const search = query => {
  return axios(searchURL(query))
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

const meme = (episode, timestamp, caption) => {
  return axios(memeURL(episode, timestamp, caption))
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

const random = () => {
  return axios(randomURL())
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

const getImageUrl = (episode, timestamp) => {
  return imageURL(episode, timestamp);
};

export default {
  caption,
  search,
  meme,
  random,
  getImageUrl
};
