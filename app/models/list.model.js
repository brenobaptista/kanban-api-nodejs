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
}, {
  timestamps: true,
});

module.exports = mongoose.model('List', ListSchema);
