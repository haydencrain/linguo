const axios = require('axios');
const queryString = require('query-string');
const util = require('util');

const SEARCH_URL = 'https://frinkiac.com/api/search?%s';
const MEME_URL = 'https://frinkiac.com/meme/%s/%s?%s';
const CAPTION_URL = 'https://frinkiac.com/api/caption?%s';
const IMAGE_URL = 'https://frinkiac.com/img/%s/%s.jpg';

var axiosGet = query => {
  return axios(query)
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

exports.searchURL = query => {
  query = queryString.stringify({ q: query || '' });
  return util.format(SEARCH_URL, query);
};

exports.captionURL = (episode, timestamp) => {
  const query = queryString.stringify({ e: episode, t: timestamp });
  return util.format(CAPTION_URL, query);
};

exports.imageURL = (episode, timestamp) => {
  return util.format(IMAGE_URL, episode, timestamp);    
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


