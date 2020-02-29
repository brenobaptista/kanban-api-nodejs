const List = require('../models/list');
const Task = require('../models/task');
const User = require('../models/user');

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
    creator: req.userId,
  });

  try {
    await list.save();
    const user = await User.findById(req.userId);
    user.lists.push(list);
    await user.save();
    res.status(201).json({
      message: 'List created successfully!',
      list,
      creator: { _id: user._id, name: user.name },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the list.',
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const user = req.get('userId');
    const lists = await List.find({ creator: user });
    await res.send(lists);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving lists.',
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = req.get('userId');
    const list = await List.find({ _id: req.params.listId, creator: user });
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
    const list = await List.findById(req.params.listId);

    if (!list) {
      return res.status(404).send({
        message: `List not found with id ${req.params.listId}`,
      });
    }

    if (list.creator.toString() !== req.userId) {
      return res.status(403).send({
        message: 'Not authorized!',
      });
    }

    list.name = req.body.name;
    list.boardId = req.body.boardId;

    const result = await list.save();
    res.status(200).json({ message: 'List updated!', list: result });
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
    const list = await List.findById(req.params.listId);

    if (!list) {
      return res.status(404).send({
        message: `List not found with id ${req.params.listId}`,
      });
    }

    if (list.creator.toString() !== req.userId) {
      return res.status(403).send({
        message: 'Not authorized!',
      });
    }

    await List.findByIdAndRemove(req.params.listId);

    const user = await User.findById(req.userId);

    user.lists.pull(req.params.listId);

    const tasks = await Task.find({ listId: req.params.listId });
    tasks.map((task) => user.tasks.pull(task._id));
    const taskRemove = await Task.deleteMany({ listId: req.params.listId });

    await user.save();

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
