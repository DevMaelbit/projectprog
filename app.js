require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const userRoutes = require('./routes/user');
const app = express();

// Middleware para JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar a conexão com o MySQL usando Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

// Testar a conexão com o banco de dados
sequelize.authenticate()
    .then(() => {
        console.log('Conectado ao MySQL');
    })
    .catch((err) => {
        console.error('Não foi possível conectar ao MySQL:', err);
    });

// Sincronizar modelos (caso esteja utilizando o Sequelize para definir modelos)
sequelize.sync();

// Rotas
app.use('/api/users', userRoutes);

// Servir arquivos estáticos
app.use(express.static('public'));

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = sequelize; // Exportar a instância do sequelize para ser usada em outros arquivos

const sequelize = require('./config/database');
const User = require('./models/User');

sequelize.sync({ force: false })
    .then(() => {
        console.log('Tabelas sincronizadas');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar as tabelas:', error);
    });

