# Kanban API Node.js

> A kanban node.js API featuring CRUD (board, list and task) and authentication.

## Table of Contents

- [Features](#features)
- [Documentation](#documentation)
  * [Boards](#boards)
  * [Lists](#lists)
  * [Tasks](#tasks)
  * [Sign Up](#sign-up)
  * [Login](#login)
  * [Schemas](#schemas)
- [Support](#support)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## Features

* CRUD for boards, lists and tasks (if you delete a board, automatically you delete its lists and tasks. The same happens if you delete a list)
* Authentication (pure code, not Auth0)

## Documentation

#### This is a project of an API made so I can use it on my other project [Aeon Planner](https://aeonplanner.netlify.com/home).

#### API URL: https://kanban-api-nodejs.herokuapp.com

### Endpoints:

#### Boards

```
  post('/boards')

  get('/boards')

  get('/boards/:boardId')

  put('/boards/:boardId')

  delete('/boards/:boardId')
```

#### Lists

```
  post('/lists')

  get('/lists')

  get('/lists/:listId')

  put('/lists/:listId')

  delete('/lists/:listId')
```

#### Tasks

```
  post('/tasks')

  get('/tasks')

  get('/tasks/:taskId')

  put('/tasks/:taskId')

  delete('/tasks/:taskId')
```

#### Sign Up

```
  put('/signup')
```

#### Login

```
  post('/login')
```

### Schemas:

```
Boards: name
Lists: name, boardId
Tasks: name, listId, description (optional)
User: email, password, boards (array)
```

## Support

Please [open an issue](../../issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](../../compare?expand=1).

1. Fork this repository.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request.

## Author

| [![brenobaptista](https://avatars1.githubusercontent.com/u/47641641?s=120&v=4)](https://github.com/brenobaptista) |
| ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [Breno Baptista](https://github.com/brenobaptista) |

## License

This project is licensed under the [GPL-3.0 License](/LICENSE)
