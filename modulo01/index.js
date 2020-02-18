const express = require('express');

const server = express();

server.use(express.json());

//Query params = ?teste=1
//Route params = /users/1
//Request body = { "name": "Anderson", "email": "anderson@rocketseat.com.br" }

//Create, Read, Update, Delete

const users = ['Anderson', 'Maykel', 'Carlos'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método ${req.method}; URL ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User not found on request body" });
  }

  return next();
}

function checkUserOnArray(req, res, next) {
  const user = users[req.params.index]

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });

  }
  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserOnArray, (req, res) => {
  return res.json(req.user);
})

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserOnArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserOnArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

server.listen(3000);