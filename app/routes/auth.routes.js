/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-unused-vars */
const { check } = require('express-validator');
const auth = require('../controllers/auth.controller');
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
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 chars long.'),
  ], auth.signUp);

  app.post('/login', auth.login);

  app.post('/reset', auth.reset);

  app.post('/reset/:token', auth.newPassword);
};
