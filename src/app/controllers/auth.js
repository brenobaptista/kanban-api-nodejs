const crypto = require('crypto');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'brenomb07@gmail.com',
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
      from: '"Aeon Planner" <brenomb07@gmail.com>',
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
  crypto.randomBytes(32, async (error, buffer) => {
    try {
      if (error) {
        console.log(error);
      }

      const token = buffer.toString('hex');
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(401).send({
          message: 'No account with that email found.',
        });
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();

      transporter.sendMail({
        from: '"Aeon Planner" <brenomb07@gmail.com>',
        to: req.body.email,
        subject: 'Password Reset',
        text: 'You requested a password reset. Click the link to set a new password!',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="https://aeonplanner.netlify.com/reset/${token}">link</a> to set a new password.</p>
        `,
      });

      res.status(200).send({
        message: 'Email sent successfully!',
      });
    } catch (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while resetting the password.',
      });
    }
  });
};

exports.newPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    const hashedPw = await bcrypt.hash(req.body.password, 12);

    user.password = hashedPw;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).send({ message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while setting the new password.',
    });
  }
};
