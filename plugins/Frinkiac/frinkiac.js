const axios = require('axios');
const queryString = require('query-string');
const util = require('util');

const SEARCH_URL = 'https://frinkiac.com/api/search?%s';
const MEME_URL = 'https://frinkiac.com/meme/%s/%s.jpg?%s';
const CAPTION_URL = 'https://frinkiac.com/api/caption?%s';
const IMAGE_URL = 'https://frinkiac.com/img/%s/%s.jpg';
const FAVICON = 'https://frinkiac.com/favicon.ico';
const RAND_URL = 'https://frinkiac.com/api/random';
const HERO_URL = 'https://frinkiac.com/img/hero.gif';

exports.searchURL = query => {
  query = queryString.stringify({ q: query || '' });
  return util.format(SEARCH_URL, query);
};

exports.memeURL = (episode, timestamp, caption) => {
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

exports.captionURL = (episode, timestamp) => {
  const query = queryString.stringify({ e: episode, t: timestamp });
  return util.format(CAPTION_URL, query);
};

exports.imageURL = (episode, timestamp) => {
  return util.format(IMAGE_URL, episode, timestamp);    
};

exports.randomURL = () => {
  return util.format(RAND_URL);
};

exports.heroURL = () => { 
  return util.format(HERO_URL);
};

exports.caption = (episode, timestamp) => {
  return axios(this.captionURL(episode, timestamp))
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

exports.search = query => {
  return axios(this.searchURL(query))
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

exports.meme = (episode, timestamp, caption) => {
  return axios(this.memeURL(episode, timestamp, caption))
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

exports.random = () => {
  return axios(this.randomURL())
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};


