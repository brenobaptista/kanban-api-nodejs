/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../models/user.model');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'breno.maia@acensjr.com',
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPw,
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });

    await transporter.sendMail({
      from: '"Aeon Planner" <breno.maia@acensjr.com>',
      to: email,
      subject: 'Welcome to Aeon!',
      text: 'I\'m glad you joined my little app project! Feel free to give me feedback about it. Enjoy!',
      html: '<b>I\'m happy you joined my little app project! Feel free to give me feedback about it. Enjoy!</b>',
    });

    // eslint-disable-next-line no-console
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the user.',
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        message: 'A user with this email could not be found.',
      });
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).send({
        message: 'Wrong password!',
      });
    }
    const token = jwt.sign({
      email: loadedUser.email,
      userId: loadedUser._id.toString(),
    }, 'gabriela', { expiresIn: '1h' });
    res.status(200).json({ token, userId: loadedUser._id.toString(), expiresIn: 3600 });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while authenticating the user.',
    });
  }
};

exports.reset = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            message: 'No account with that email found.',
          });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        transporter.sendMail({
          from: '"Aeon Planner" <breno.maia@acensjr.com>',
          to: req.body.email,
          subject: 'Password Reset',
          text: 'You requested a password reset. Click the link to set a new password!',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="https://aeonplanner.netlify.com/reset/${token}">link</a> to set a new password.</p>
          `,
        });
        return res.status(200).send({
          message: 'Email sent successfully!',
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.newPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const passwordToken = req.params.token;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => res.status(200).send({ message: 'Email sent successfully!' }))
    .catch((error) => {
      console.log(error);
    });
};
