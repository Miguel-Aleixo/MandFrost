const express = require('express');
const multer = require('multer');
const  checkRole = require('../middleware/checkRole');
const { getTiposProduto, addTipoProduto, updateTipoProduto, deleteTipoProduto, filtersTiposProduto } = require('../controllers/tipoProdutoController');

const router = express.Router();
const upload = multer({ dest: 'uploads/'})

// GET
router.get('/', checkRole(['ADMIN', 'USER']), getTiposProduto);

// POST
router.post('/', checkRole(['ADMIN']), upload.single('imagem'), addTipoProduto);

// PUT
router.put('/:id', checkRole(['ADMIN']), upload.single('imagem'), updateTipoProduto);

// DELETE
router.delete('/:id', checkRole(['ADMIN']), deleteTipoProduto);

// FILTRO
router.post('/filtro', checkRole(['ADMIN', 'USER']), filtersTiposProduto);

module.exports = router;