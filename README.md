# Trello API Node.js

**My Trello-like Node.js API**

This is a project of an API made so I can use it on my other project [Aeon Planner](https://aeonplanner.netlify.com/home).

## Endpoints:

### Boards

```

  post('/boards')

  get('/boards')

  get('/boards/:boardId')

  put('/boards/:boardId')

  delete('/boards/:boardId')
  
```

### Lists

```

  post('/lists')

  get('/lists')

  get('/lists/:listId')

  put('/lists/:listId')

  delete('/lists/:listId')
  
```

### Tasks

```

  post('/tasks')

  get('/tasks')

  get('/tasks/:taskId')

  put('/tasks/:taskId')

  delete('/tasks/:taskId')
  
```

## Schemas:

```

Boards: name
Lists: name, boardId
Tasks: name, description, listId

```
