const Produto = require('../models/Produto');
const TipoProduto = require('../models/TipoProduto');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { Op } = require('sequelize');

const getAllProdutos = async () => {
    return await Produto.findAll();
};

const createProduto = async (data, file) => {

    if (!data.id_tipo_produto || !data.nome || !data.preco || !data.estoque) {
        throw new Error('Preencha corretamente os dados.');
    };

    const tipoProduto = await TipoProduto.findByPk(data.id_tipo_produto);

    if (!tipoProduto) {
        throw new Error('Tipo de produto não encontrado!');
    };

    let imagemUrl = null;

    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'produto',
                use_filename: true,
                unique_filename: false
            });
            imagemUrl = result.secure_url;
        } finally {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        };
    };

    return await Produto.create({ ...data, imagem_url: imagemUrl });
};

const editProduto = async (id, data, file) => {
    const produto = await Produto.findByPk(id);

    const tipoProduto = await TipoProduto.findByPk(data.id_tipo_produto)

    if (!tipoProduto) {
        throw new Error('Tipo de produto não encontrado!');
    }

    if (!produto) {
        throw new Error('Produto não encontrado!');
    };

    if (file) {
        try {
            if (produto.imagem_url) {
                const publicId = produto.imagem_url
                    .split('/')
                    .pop()
                    .split('.')[0];
                await cloudinary.uploader.destroy(`produto/${publicId}`);
            };
    
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'produto',
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

    await produto.update(data);

    return produto;
}

const removeProduto = async (id) => {
    const deletedCount = await Produto.destroy({
        where: { id: id }
    });

    return deletedCount > 0;
}

const getFiltersProdutos = async (nome, categoria) => {
    const where = {};

    if (nome) {
        where.nome = { [Op.iLike]: `%${nome}%` };
    };

    if (categoria) {
        where.id_tipo_produto = categoria;
    };

    return await Produto.findAll({ where });
};

module.exports = { getAllProdutos, createProduto, editProduto, removeProduto, getFiltersProdutos };