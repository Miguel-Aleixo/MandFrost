const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB, sequelize } = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

connectDB();

sequelize.sync({ alter: true }).then(() => {
    console.log('Modelos sincronizados com o banco');
})

// ROTA USUARIO
app.use('/users', require('./routes/userRoutes'));

// ROTA CARRINHO
app.use('/item-carrinho', require('./routes/itemCarrinhoRoutes'));

// ROTA TIPO PRODUTO
app.use('/tipo-produto', require('./routes/tipoProdutoRoutes'));

// ROTA PRODUTO
app.use('/produto', require('./routes/produtoRoutes'))

// ROTA AUTENTICAÇÃO
app.use('/login', require('./routes/authRoutes'));

// ROTA PAGAMENTO
app.use('/pagamento', require('./routes/pagamentoRoutes'));

module.exports = app;
