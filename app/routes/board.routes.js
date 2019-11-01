const boards = require('../controllers/board.controller');
const isAuth = require('../middleware/auth.middleware');

module.exports = (app) => {
  app.post('/boards', isAuth, boards.create);

  app.get('/boards', isAuth, boards.findAll);

  app.get('/boards/:boardId', isAuth, boards.findOne);

  app.put('/boards/:boardId', isAuth, boards.update);

  app.delete('/boards/:boardId', isAuth, boards.delete);
};
