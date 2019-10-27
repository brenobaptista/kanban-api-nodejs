/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
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

    const info = await transporter.sendMail({
      from: '"Aeon Planner" <breno.maia@acensjr.com>',
      to: email,
      subject: 'Welcome to Aeon!',
      text: 'I\'m glad you joined my little app project! Feel free to give me feedback about it. Enjoy!',
      html: '<b>I\'m happy you joined my little app project! Feel free to give me feedback about it. Enjoy!</b>',
    });

    // eslint-disable-next-line no-console
    console.log('Message sent: %s', info.messageId);
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
    res.status(200).json({ token, userId: loadedUser._id.toString() });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while authenticating the user.',
    });
  }
};
