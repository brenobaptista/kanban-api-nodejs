const mongoose = require('mongoose');

const BoardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Board', BoardSchema);
