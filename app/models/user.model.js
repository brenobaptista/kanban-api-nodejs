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
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    },
  ],
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model('User', UserSchema);
