// pacotes
require('dotenv/config');
const express = require('express');

// conexão com o banco de dados
require('./config/database.config')();


// inicializar o express
const app = express();

// middleware
app.use(express.json());

function logger(req, res, next) {
  console.log(req.method, req.path)
  next();
}

function isAdmin(req, res, next) {
  if(req.body.role === 'admin') {
    req.body.favoriteFood = "pizza!"
    next();
    return;
  }
  res.status(403).json('Você não tem permissão para isso.')
}


app.use(logger);

// modelos
const User = require('./models/User.model');

// rotas
app.get('/', (req, res) => {
  res.json('Bem vindo ao exemplo do Express!');
})

app.get('/user/all', async (req, res) => {
  try {
    const usersFromDB = await User.find();
    res.status(200).json(usersFromDB)
  } catch (error) {
    res.status(500).json({ description: 'Erro ao resgatar lista de usuários', error })
  }
})


app.get('/user/:userId', (req, res) => {
  const { userId } = req.params; // parâmetro de rota: user/<id> é obrigatório!
  res.json({ user: 'Param User', id: userId });
})

app.get('/user', (req, res) => {
  const { userId, username } = req.query; // parâmetro de busca: user?username=<name>&userId=<id> não é obrigatório!
  const user = {
    user: username || 'Query User',
    userId: userId || 0
  }
  res.json(user);
})

// app.use(isAdmin);

app.post('/signup', isAdmin, logger, logger, logger, async (req, res) => {
  console.log(req.body);
  const { username, email } = req.body;
  try {
    if(!username || !email) {
      return res.status(400).json('Nome de usuário e email são obrigatórios!');
    }
    const userFromDB = await User.create(req.body)
    res.status(201).json(userFromDB);
  } catch (error) {
    if(error.code === 11000) {
      res.status(500).json({ description: 'Email duplicado!' });
      return;
    }
    res.status(500).json({ description: 'Erro ao cadastrar usuário', error }) 
  }
})

// iniciar o servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}.`);
})