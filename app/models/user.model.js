const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'I am new!',
  },
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
