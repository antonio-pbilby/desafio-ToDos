const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) return response.status(404).json({ error: "Usuário não existe" });

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists)
    return response.status(400).json({ error: "O usuário já existe." });

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const todos = user.todos;

  return response.json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { title, deadline } = request.body;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at: new Date(),
  };

  user.todos.push(todo);
  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const userTodo = user.todos.find((todo) => todo.id === id);

  if (!userTodo) return response.status(404).json({ error: "ToDo not found" });

  const { title, deadline } = request.body;

  userTodo.title = title;
  userTodo.deadline = deadline;

  return response.json(userTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const userTodo = user.todos.find((todo) => todo.id === id);

  if (!userTodo) return response.status(404).json({ error: "ToDo not found" });

  userTodo.done = true;

  return response.json(userTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const userTodo = user.todos.find((todo) => todo.id === id);

  if (!userTodo) return response.status(404).json({ error: "ToDo not found" });

  user.todos.splice(userTodo, 1);

  return response.status(204).send();
});

module.exports = app;
