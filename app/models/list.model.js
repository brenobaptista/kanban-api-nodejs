const mongoose = require('mongoose');

const ListSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('List', ListSchema);
