const adminService = require('../service/adminService');

const getAdmins = async (req, res, next) => {
    try {
        const admins = await adminService.getAllAdmins();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addAdmin = async (req, res, next) => {
    try {
        const newAdmin = await adminService.createAdmin(req.body);
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateAdmin = async (req, res, next) => {
    try {
        const updateAdmin = await adminService.editAdmin({ id: req.params.id, ...req.body });
        res.status(200).json(updateAdmin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deleteAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await adminService.removeAdmin(id)
        if (!deleted) {
            return res.status(404).json({ message: 'Admin não encontrado' });
        }
        res.status(200).json({ message: 'Admin deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { getAdmins, addAdmin, updateAdmin, deleteAdmin };