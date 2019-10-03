/* eslint-disable consistent-return */
const Board = require('../models/board.model.js');

exports.create = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Board name cannot be empty',
    });
  }

  const board = new Board({
    name: req.body.name,
  });

  board.save()
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the board.',
      });
    });
};

exports.findAll = (req, res) => {
  Board.find()
    .then((boards) => {
      res.send(boards);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving boards.',
      });
    });
};

exports.findOne = (req, res) => {
  Board.findById(req.params.boardId)
    .then((board) => {
      if (!board) {
        return res.status(404).send({
          message: `Board not found with id ${req.params.boardId}`,
        });
      }
      res.send(board);
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Board not found with id ${req.params.boardId}`,
        });
      }
      return res.status(500).send({
        message: `Error retrieving board with id ${req.params.boardId}`,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Board name cannot be empty',
    });
  }

  Board.findByIdAndUpdate(req.params.boardId, {
    name: req.body.name,
  }, { new: true })
    .then((board) => {
      if (!board) {
        return res.status(404).send({
          message: `Board not found with id ${req.params.boardId}`,
        });
      }
      res.send(board);
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Board not found with id ${req.params.boardId}`,
        });
      }
      return res.status(500).send({
        message: `Error updating board with id ${req.params.boardId}`,
      });
    });
};

exports.delete = (req, res) => {
  Board.findByIdAndRemove(req.params.boardId)
    .then((board) => {
      if (!board) {
        return res.status(404).send({
          message: `Board not found with id ${req.params.boardId}`,
        });
      }
      res.send({ message: 'Board deleted successfully!' });
    }).catch((err) => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: `Board not found with id ${req.params.boardId}`,
        });
      }
      return res.status(500).send({
        message: `Could not delete board with id ${req.params.boardId}`,
      });
    });
};
