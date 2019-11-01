/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const Task = require('../models/task.model');
const User = require('../models/user.model');

exports.create = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Task name cannot be empty',
    });
  }

  if (!req.body.listId) {
    return res.status(400).send({
      message: 'List id cannot be empty',
    });
  }

  const task = new Task({
    name: req.body.name,
    description: req.body.description,
    listId: req.body.listId,
    creator: req.userId,
  });

  try {
    await task.save();
    const user = await User.findById(req.userId);
    user.tasks.push(task);
    await user.save();
    res.status(201).json({
      message: 'Task created successfully!',
      task,
      creator: { _id: user._id, name: user.name },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the task.',
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const tasks = await Task.find();
    await res.send(tasks);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving tasks.',
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).send({
        message: `Task not found with id ${req.params.taskId}`,
      });
    }
    await res.send(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        message: `Task not found with id ${req.params.taskId}`,
      });
    }
    return res.status(500).send({
      message: `Error retrieving task with id ${req.params.taskId}`,
    });
  }
};

exports.update = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Task name cannot be empty',
    });
  }

  if (!req.body.listId) {
    return res.status(400).send({
      message: 'List id cannot be empty',
    });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, {
      name: req.body.name,
      description: req.body.description,
      listId: req.body.listId,
    }, { new: true });
    if (!task) {
      return res.status(404).send({
        message: `Task not found with id ${req.params.taskId}`,
      });
    }
    await res.send(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        message: `Task not found with id ${req.params.taskId}`,
      });
    }
    return res.status(500).send({
      message: `Error updating task with id ${req.params.taskId}`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove(req.params.taskId);
    if (!task) {
      return res.status(404).send({
        message: `Task not found with id ${req.params.taskId}`,
      });
    }
    await res.send({ message: 'Task deleted successfully!' });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'NotFound') {
      return res.status(404).send({
        message: `Task not found with id ${req.params.taskId}`,
      });
    }
    return res.status(500).send({
      message: `Could not delete task with id ${req.params.taskId}`,
    });
  }
};
