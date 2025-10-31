const express = require('express');
const checkRole = require('../middleware/checkRole');
const { criarPagamento } = require('../controllers/pagamentoController');

const router = express.Router();

// PAGAMENTO
router.post('/ ', checkRole(['ADMIN', 'USER']), criarPagamento);

module.exports = router