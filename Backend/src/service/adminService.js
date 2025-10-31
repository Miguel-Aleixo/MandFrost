const User = require('../models/User');
const bcrypt = require('bcrypt');

const getAllAdmins = async () => {
    return await User.findAll({
        where: {
            role: 'ADMIN'
        }
    });
};

const createAdmin = async (data) => {

    if (!data.nome || !data.email || !data.senha || !data.telefone || !data.RA) {
        throw new Error('Preencha corretamente os dados.');
    };

    const hashedPassword = await bcrypt.hash(data.senha, 10)
    return await User.create({ ...data, role: 'ADMIN', senha: hashedPassword });
};

const editAdmin = async (data) => {
    const admin = await User.findOne({
        where: {
            id: data.id,
            role: 'ADMIN',
        }
    });

    if (!admin) {
        throw new Error('Admin não encontrado!');
    };

    if (data.senha) {
        data.senha = await bcrypt.hash(data.senha, 10);
    }

    await admin.update(data);

    return admin;
}

const removeAdmin = async (id) => {
    const deletedCount = await User.destroy({
        where: { id: id }
    });

    return deletedCount > 0;
}

module.exports = { getAllAdmins, createAdmin, editAdmin, removeAdmin };