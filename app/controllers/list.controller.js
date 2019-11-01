/* eslint-disable consistent-return */
const List = require('../models/list.model');
const Task = require('../models/task.model');

exports.create = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'List name cannot be empty',
    });
  }

  if (!req.body.boardId) {
    return res.status(400).send({
      message: 'Board id cannot be empty',
    });
  }

  const list = new List({
    name: req.body.name,
    boardId: req.body.boardId,
  });

  try {
    const data = await list.save();
    await res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the list.',
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const lists = await List.find();
    await res.send(lists);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving lists.',
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).send({
        message: `List not found with id ${req.params.listId}`,
      });
    }
    await res.send(list);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        message: `List not found with id ${req.params.listId}`,
      });
    }
    return res.status(500).send({
      message: `Error retrieving list with id ${req.params.listId}`,
    });
  }
};

exports.update = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'List name cannot be empty',
    });
  }

  if (!req.body.boardId) {
    return res.status(400).send({
      message: 'Board id cannot be empty',
    });
  }

  try {
    const list = await List.findByIdAndUpdate(req.params.listId, {
      name: req.body.name,
      boardId: req.body.boardId,
    }, { new: true });
    if (!list) {
      return res.status(404).send({
        message: `List not found with id ${req.params.listId}`,
      });
    }
    await res.send(list);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        message: `List not found with id ${req.params.listId}`,
      });
    }
    return res.status(500).send({
      message: `Error updating list with id ${req.params.listId}`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const list = await List.findByIdAndRemove(req.params.listId);
    const taskRemove = await Task.deleteMany({ listId: req.params.listId });
    if (!list) {
      return res.status(404).send({
        message: `List not found with id ${req.params.listId}`,
      });
    }
    await res.send({ message: `List deleted successfully! ${taskRemove.deletedCount} tasks were also removed.` });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'NotFound') {
      return res.status(404).send({
        message: `List not found with id ${req.params.listId}`,
      });
    }
    return res.status(500).send({
      message: `Could not delete list with id ${req.params.listId}`,
    });
  }
};
