const List = require('../models/list.model.js');

exports.create = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "List name cannot be empty"
    });
  }

  if (!req.body.boardId) {
    return res.status(400).send({
      message: "Board id cannot be empty"
    });
  }

  const list = new List({
    name: req.body.name,
    boardId: req.body.boardId
  });

  list.save()
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the list."
      });
    });
};

exports.findAll = (req, res) => {
  List.find()
    .then(lists => {
      res.send(lists);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving lists."
      });
    });
};

exports.findOne = (req, res) => {
  List.findById(req.params.listId)
    .then(list => {
      if (!list) {
        return res.status(404).send({
          message: "List not found with id " + req.params.listId
        });
      }
      res.send(list);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "List not found with id " + req.params.listId
        });
      }
      return res.status(500).send({
        message: "Error retrieving list with id " + req.params.listId
      });
    });
};

exports.update = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "List name cannot be empty" 
    });
  }

  if (!req.body.boardId) {
    return res.status(400).send({
      message: "Board id cannot be empty"
    });
  }

  List.findByIdAndUpdate(req.params.listId, {
    name: req.body.name,
    boardId: req.body.boardId
  }, { new: true })
    .then(list => {
      if (!list) {
        return res.status(404).send({
          message: "List not found with id " + req.params.listId
        });
      }
      res.send(list);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "List not found with id " + req.params.listId
        });
      }
      return res.status(500).send({
        message: "Error updating list with id " + req.params.listId
      });
    });
};

exports.delete = (req, res) => {
  List.findByIdAndRemove(req.params.listId)
    .then(list => {
      if(!list) {
        return res.status(404).send({
          message: "List not found with id " + req.params.listId
        });
      }
      res.send({message: "List deleted successfully!"});
    }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "List not found with id " + req.params.listId
        });                
      }
      return res.status(500).send({
        message: "Could not delete list with id " + req.params.listId
      });
    });
};