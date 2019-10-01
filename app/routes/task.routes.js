module.exports = (app) => {
  const tasks = require('../controllers/task.controller.js');

  app.post('/tasks', tasks.create);

  app.get('/tasks', tasks.findAll);

  app.get('/tasks/:taskId', tasks.findOne);

  app.put('/tasks/:taskId', tasks.update);

  app.delete('/tasks/:taskId', tasks.delete);
}