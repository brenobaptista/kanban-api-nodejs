/* eslint-disable consistent-return */
const Board = require('../models/board.model.js');

exports.create = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Board name cannot be empty',
    });
  }

  const board = new Board({
    name: req.body.name,
  });

  try {
    const data = await board.save();
    await res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the board.',
    });
  }
};

exports.findAll = async (res) => {
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
    const board = await Board.findByIdAndUpdate(req.params.boardId, {
      name: req.body.name,
    }, { new: true });
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
      message: `Error updating board with id ${req.params.boardId}`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const board = await Board.findByIdAndRemove(req.params.boardId);
    if (!board) {
      return res.status(404).send({
        message: `Board not found with id ${req.params.boardId}`,
      });
    }
    await res.send({ message: 'Board deleted successfully!' });
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
