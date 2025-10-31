const express = require('express');
const  checkRole = require('../middleware/checkRole');
const { getAdmins, addAdmin, updateAdmin, deleteAdmin } = require('../controllers/adminController');

const router = express.Router();

// GET
router.get('/', checkRole(['ADMIN']), getAdmins);

// POST
router.post('/', checkRole(['ADMIN']), addAdmin);

// PUT
router.put('/:id', checkRole(['ADMIN']), updateAdmin);

// DELETE
router.delete('/:id', checkRole(['ADMIN']), deleteAdmin);

module.exports = router;