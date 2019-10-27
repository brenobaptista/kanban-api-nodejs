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
  res.json({ message: 'Welcome to my Trello-like API made with Node.js. This API is used in my other project called \'Aeon Planner\'.' });
});

async function runMongoose() {
  mongoose.Promise = global.Promise;

  await mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('Successfully connected to the database');
  console.log(`Listening on port ${process.env.PORT || 8080}`);
  await app.listen(process.env.PORT || 8080);
}

runMongoose().catch((error) => {
  console.log('Could not connect to the database. Exiting now...', error);
  process.exit();
});

require('./app/routes/auth.routes')(app);
require('./app/routes/board.routes.js')(app);
require('./app/routes/list.routes.js')(app);
require('./app/routes/task.routes.js')(app);
