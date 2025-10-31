const express = require('express');
const multer = require('multer');
const  checkRole = require('../middleware/checkRole');
const { getProdutos, addProduto, updateProduto, deleteProduto, filtersProdutos } = require('../controllers/produtoController');

const router = express.Router();
const upload = multer({ dest: 'uploads/'})

// GET
router.get('/', checkRole(['ADMIN', 'USER']), getProdutos);

// POST
router.post('/', checkRole(['ADMIN']), upload.single('imagem'), addProduto);

// PUT
router.put('/:id', checkRole(['ADMIN']), upload.single('imagem'), updateProduto);

// DELETE
router.delete('/:id', checkRole(['ADMIN']), deleteProduto);

// FILTRO
router.post('/filtro', checkRole(['ADMIN', 'USER']), filtersProdutos);

module.exports = router;