const express = require('express');
const multer = require('multer');
const { getUsers, addUser, addAdmin, updateUser, deleteUser, filtersUsers, statusUser } = require('../controllers/userController');
const checkRole = require('../middleware/checkRole');

const router = express.Router();
const upload = multer({ dest: 'uploads/'})

// GET
router.get('/', checkRole(['ADMIN']), getUsers);

// POST
router.post('/', upload.single('imagem'),addUser);

// POST ADMIN
router.post('/admin', checkRole(['ADMIN']), upload.single('imagem'), addAdmin);

// PUT
router.put('/:id', checkRole(['ADMIN', 'USER']), upload.single('imagem'), updateUser);

// MUDAR STATUS DO USUARIO
router.put('/status/:id', checkRole(['ADMIN']), statusUser);

// DELETE
router.delete('/:id', checkRole(['ADMIN', 'USER']), deleteUser);

// FILTRO
router.post('/filtro', checkRole(['ADMIN', 'USER']), filtersUsers);

module.exports = router;