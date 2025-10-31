const TipoProduto = require('../models/TipoProduto');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { Op } = require('sequelize');

const getAllTiposProduto = async () => {
    return await TipoProduto.findAll();
};

const createTipoProduto = async (data, file) => {

    if (!data.nome) {
        throw new Error('Preencha corretamente os dados.');
    };

    let imagemUrl = null;

    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'tipoProduto',
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

    return await TipoProduto.create({ ...data, imagem_url: imagemUrl });
};

const editTipoProduto = async (id, data, file) => {
    if (!data.nome) {
        throw new Error('Preencha corretamente os dados.');
    };

    const tipoProduto = await TipoProduto.findByPk(id);

    if (!tipoProduto) {
        throw new Error('Tipo produto não encontrado!');
    };

    if (file) {
        try {
            if (tipoProduto.imagem_url) {
                const publicId = tipoProduto.imagem_url
                    .split('/')
                    .pop()
                    .split('.')[0];
                await cloudinary.uploader.destroy(`tipoProduto/${publicId}`);
            };

            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'tipoProduto',
                use_filename: true,
                unique_filename: false
            });

            data.imagem_url = result.secure_url;
            
        } finally {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            };
        };
    };

    await tipoProduto.update(data);

    return tipoProduto;
}

const removeTipoProduto = async (id) => {
    const deletedCount = await TipoProduto.destroy({
        where: { id: id }
    });

    return deletedCount > 0;
};

const getFiltersTiposProduto = async (nome) => {
    const where = {};

    if (nome) {
        where.nome = { [Op.iLike]: `%${nome}%` };
    };

    return await TipoProduto.findAll({ where });
};

module.exports = { getAllTiposProduto, createTipoProduto, editTipoProduto, removeTipoProduto, getFiltersTiposProduto };