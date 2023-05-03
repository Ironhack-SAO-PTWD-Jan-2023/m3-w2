const mongoose = require('mongoose'); // ODM

async function connect() {
  const DB_URI = process.env.ATLAS_URI || 'mongodb:localhost/express-example' ;
  try {
    const x = await mongoose.connect(DB_URI);
    console.log(`Conectado ao banco de dados: ${x.connections[0].name}`);
  } catch (error) {
    console.log('Erro ao conectar o banco de dados', error);
  }
}

module.exports = connect;