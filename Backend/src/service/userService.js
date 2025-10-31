const User = require('../models/User');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { Op } = require('sequelize');

const getAllUsers = async () => {
    return await User.findAll();
};

const createUser = async (data, file) => {

    if (!data.nome || !data.email || !data.senha || !data.telefone || !data.RA) {
        throw new Error('Preencha corretamente os dados.');
    };

    let imagemUrl = null;

    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'usuarios',
                use_filename: true,
                unique_filename: false
            });
            imagemUrl = result.secure_url;

        } finally {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            };
        };
    };

    const hashedPassword = await bcrypt.hash(data.senha, 10)
    return await User.create({ ...data, role: 'USER', senha: hashedPassword, imagem_url: imagemUrl });
};

const createAdmin = async (data, file) => {

    if (!data.nome || !data.email || !data.senha || !data.telefone || !data.RA) {
        throw new Error('Preencha corretamente os dados.');
    };

    let imagemUrl = null;

    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'usuarios',
                use_filename: true,
                unique_filename: false
            });
            imagemUrl = result.secure_url;

        } finally {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            };
        };
    };

    const hashedPassword = await bcrypt.hash(data.senha, 10)
    return await User.create({ ...data, role: 'ADMIN', senha: hashedPassword, imagem_url: imagemUrl });
};

const editUser = async (data, file) => {
    const user = await User.findByPk(data.id);

    if (!user) throw new Error('Usuário não encontrado!');

    // IMAGEM
    if (file) {
        try {
            if (user.imagem_url) {
                const publicId = user.imagem_url.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`usuarios/${publicId}`);
            }

            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'usuarios',
                use_filename: true,
                unique_filename: false
            });

            data.imagem_url = result.secure_url;

        } finally {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        }
    }

    // SENHA NOVA
    if (data.senhaNova) {
        if (!data.senha) throw new Error('Digite sua senha atual para alterar.');
        const validPassword = await bcrypt.compare(data.senha, user.senha);
        if (!validPassword) throw new Error('Senha atual incorreta!');
        data.senha = await bcrypt.hash(data.senhaNova, 10);
    } else {
        delete data.senha;
        delete data.senhaNova;
    };

    Object.keys(data).forEach(key => {
        if (data[key] === "" || data[key] === undefined) {
            delete data[key];
        }
    });

    await user.update(data);

    return user;
};

const statusUser = async (data) => {
    const user = await User.findByPk(data.id);

    if (!user) throw new Error('Usuário não encontrado!');

    // SENHA
    const validPassword = await bcrypt.compare(data.senha, user.senha);
    if (!validPassword) throw new Error('Senha incorreta!');

    const novoStatus = data.status === true || data.status === 'true';

    if (data.motivoBloqueio) {
        await user.update({ motivoBloqueio: data.motivoBloqueio, status: novoStatus });
    } else {
        await user.update({ motivoBloqueio: '', status: novoStatus });
    }

    return user;
};

const removeUser = async (id) => {
    const deletedCount = await User.destroy({
        where: { id: id }
    });

    return deletedCount > 0;
};

const getFiltersUsers = async (id, nome, status, tipo) => {
    const where = {};

    if (id) {
        where.id = id;
    };

    if (nome) {
        where.nome = { [Op.iLike]: `%${nome}%` };
    };

    if (status) {
        where.status = status;
    };

    if (tipo) {
        where.role = tipo;
    };

    return await User.findAll({ where });
};


module.exports = { getAllUsers, createUser, createAdmin, editUser, removeUser, getFiltersUsers, statusUser };