const userService = require('../service/userService');

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body, req.file);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const addAdmin = async (req, res, next) => {
    try {
        const newAdmin = await userService.createAdmin(req.body, req.file);
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updateUser = await userService.editUser({ id: req.params.id, ...req.body }, req.file);
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const statusUser = async (req, res, next) => {
    try {
        const statusUser = await userService.statusUser({ id: req.params.id, ...req.body });
        res.status(200).json(statusUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await userService.removeUser(id)
        if (!deleted) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const filtersUsers = async (req, res, next) => {
    try {
        const { id, nome, status, tipo } = req.body
        const users = await userService.getFiltersUsers(id, nome, status, tipo);
        res.json(users);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getUsers, addUser, addAdmin, updateUser, deleteUser, filtersUsers, statusUser };