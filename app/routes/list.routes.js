const lists = require('../controllers/list.controller');
const isAuth = require('../middleware/auth.middleware');

module.exports = (app) => {
  app.post('/lists', isAuth, lists.create);

  app.get('/lists', isAuth, lists.findAll);

  app.get('/lists/:listId', isAuth, lists.findOne);

  app.put('/lists/:listId', isAuth, lists.update);

  app.delete('/lists/:listId', isAuth, lists.delete);
};
