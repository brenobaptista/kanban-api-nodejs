module.exports = () => {
  const http = require('http');

  setInterval(() => {
    http.get("http://trello-api-nodejs.herokuapp.com");
  }, 300000);
}