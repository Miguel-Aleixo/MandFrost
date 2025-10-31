const express = require('express');
const  checkRole = require('../middleware/checkRole');
const { getItensCarrinhos, addItemCarrinho, updateItemCarrinho, deleteItemCarrinho } = require('../controllers/itemCarrinhoController');

const router = express.Router();

// GET
router.get('/:id_usuario', checkRole(['USER', 'ADMIN']), getItensCarrinhos);

// POST
router.post('/', checkRole(['USER', 'ADMIN']), addItemCarrinho);

// PUT
router.put('/:id', checkRole(['USER', 'ADMIN']), updateItemCarrinho);

// DELETE
router.delete('/:id', checkRole(['USER', 'ADMIN']), deleteItemCarrinho);

module.exports = router;