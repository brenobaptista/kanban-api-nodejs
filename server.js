/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');

const dbConfig = require('./config/database.config.js');

const app = express();

app.use(compression());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my Trello API clone made with Node.js.' });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode || 500).json({
    message: error.message,
    data: error.data,
  });
});

async function runMongoose() {
  mongoose.Promise = global.Promise;

  await mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('Successfully connected to the database');
  console.log(`Listening on port ${process.env.PORT || 3000}`);
  await app.listen(process.env.PORT || 3000);
}

runMongoose().catch((error) => {
  console.log('Could not connect to the database. Exiting now...', error);
  process.exit();
});

require('./config/herokuAwaken')();

require('./app/routes/auth.routes')(app);
require('./app/routes/board.routes.js')(app);
require('./app/routes/list.routes.js')(app);
require('./app/routes/task.routes.js')(app);
