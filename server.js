const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();

app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
})

app.get('/', (req, res) => {
  res.json({"message": "Welcome to my Trello API clone made with Node.js."})
});

require('./config/herokuAwaken')();

require('./app/routes/board.routes.js')(app);
require('./app/routes/list.routes.js')(app);
require('./app/routes/task.routes.js')(app);

app.listen(process.env.PORT || 3000);