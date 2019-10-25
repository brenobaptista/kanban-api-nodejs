/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

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
    },
    'gabriela',
    { expiresIn: '1h' });
    res.status(200).json({ token, userId: loadedUser._id.toString() });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while authenticating the user.',
    });
  }
};
