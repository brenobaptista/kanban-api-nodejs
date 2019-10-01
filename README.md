# Trello API Node.js

**My Trello-like Node.js API**

This is a project of an API made so I can use it on my other project [Aeon Planner](aeonplanner.netlify.com).

## Endpoints:

### Boards

  app.post('/boards', boards.create);

  app.get('/boards', boards.findAll);

  app.get('/boards/:boardId', boards.findOne);

  app.put('/boards/:boardId', boards.update);

  app.delete('/boards/:boardId', boards.delete);

### Lists

  app.post('/lists', lists.create);

  app.get('/lists', lists.findAll);

  app.get('/lists/:listId', lists.findOne);

  app.put('/lists/:listId', lists.update);

  app.delete('/lists/:listId', lists.delete);

### Tasks

  app.post('/tasks', tasks.create);

  app.get('/tasks', tasks.findAll);

  app.get('/tasks/:taskId', tasks.findOne);

  app.put('/tasks/:taskId', tasks.update);

  app.delete('/tasks/:taskId', tasks.delete);

## Schemas:

Boards: name
Lists: name, boardId
Tasks: name, description, listId