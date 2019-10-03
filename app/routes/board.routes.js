const boards = require('../controllers/board.controller.js');

module.exports = (app) => {
  app.post('/boards', boards.create);

  app.get('/boards', boards.findAll);

  app.get('/boards/:boardId', boards.findOne);

  app.put('/boards/:boardId', boards.update);

  app.delete('/boards/:boardId', boards.delete);
};
