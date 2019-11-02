/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const Board = require('../models/board.model');
const List = require('../models/list.model');
const Task = require('../models/task.model');
const User = require('../models/user.model');

exports.create = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Board name cannot be empty',
    });
  }

  const board = new Board({
    name: req.body.name,
    creator: req.userId,
  });

  try {
    await board.save();
    const user = await User.findById(req.userId);
    user.boards.push(board);
    await user.save();
    res.status(201).json({
      message: 'Board created successfully!',
      board,
      creator: { _id: user._id, name: user.name },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the board.',
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const boards = await Board.find();
    await res.send(boards);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving boards.',
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).send({
        message: `Board not found with id ${req.params.boardId}`,
      });
    }
    await res.send(board);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        message: `Board not found with id ${req.params.boardId}`,
      });
    }
    return res.status(500).send({
      message: `Error retrieving board with id ${req.params.boardId}`,
    });
  }
};

exports.update = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Board name cannot be empty',
    });
  }

  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).send({
        message: `Board not found with id ${req.params.boardId}`,
      });
    }

    if (board.creator.toString() !== req.userId) {
      return res.status(403).send({
        message: 'Not authorized!',
      });
    }

    board.name = req.body.name;
    const result = await board.save();
    res.status(200).json({ message: 'Board updated!', board: result });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).send({
        message: `Board not found with id ${req.params.boardId}`,
      });
    }
    return res.status(500).send({
      message: `Error updating board with id ${req.params.boardId}`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).send({
        message: `Board not found with id ${req.params.boardId}`,
      });
    }

    if (board.creator.toString() !== req.userId) {
      return res.status(403).send({
        message: 'Not authorized!',
      });
    }

    await Board.findByIdAndRemove(req.params.boardId);

    const user = await User.findById(req.userId);

    const listFind = await List.find({ boardId: req.params.boardId });

    listFind.map(async (list) => {
      user.lists.pull({ _id: list._id });
      const tasks = await Task.find({ listId: list._id });
      tasks.map((task) => user.tasks.pull(task._id));
      await Task.deleteMany({ listId: list._id });
    });

    const listRemove = await List.deleteMany({ boardId: req.params.boardId });
    user.boards.pull(req.params.boardId);
    await user.save();
    res.status(200).json({ message: `Board deleted successfully! ${listRemove.deletedCount} lists and their respective tasks were also removed.` });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'NotFound') {
      return res.status(404).send({
        message: `Board not found with id ${req.params.boardId}`,
      });
    }
    return res.status(500).send({
      message: `Could not delete board with id ${req.params.boardId}`,
    });
  }
};
