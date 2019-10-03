const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
  name: String,
  description: String,
  listId: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', TaskSchema);
