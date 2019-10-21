/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-unused-vars */
const { check } = require('express-validator');
const auth = require('../controllers/auth.controller.js');
const User = require('../models/user.model');

module.exports = (app) => {
  app.put('/signup', [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => User.findOne({ email: value })
        .then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email address already exists.');
          }
          return null;
        }))
      .normalizeEmail(),
    check('password')
      .trim()
      .isLength({ min: 5 }),
    check('name')
      .trim()
      .not()
      .isEmpty(),
  ], auth.signUp);

  app.post('/login', auth.login);
};
