const http = require('http');

module.exports = () => {
  setInterval(() => {
    http.get('http://trello-api-nodejs.herokuapp.com');
  }, 300000);
};
