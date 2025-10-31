const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('✅ Conectado ao banco de dados com sucesso!');
    } catch(err) {
        console.error('❌ Erro ao conectar com o banco de dados:', err);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };