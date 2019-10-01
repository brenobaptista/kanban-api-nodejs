const mongoose = require('mongoose');

const BoardSchema = mongoose.Schema({
  name: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Board', BoardSchema);