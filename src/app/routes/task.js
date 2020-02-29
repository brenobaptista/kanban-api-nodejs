const tasks = require('../controllers/task');
const isAuth = require('../middleware/auth');

module.exports = (app) => {
  app.post('/tasks', isAuth, tasks.create);

  app.get('/tasks', isAuth, tasks.findAll);

  app.get('/tasks/:taskId', isAuth, tasks.findOne);

  app.put('/tasks/:taskId', isAuth, tasks.update);

  app.delete('/tasks/:taskId', isAuth, tasks.delete);
};
