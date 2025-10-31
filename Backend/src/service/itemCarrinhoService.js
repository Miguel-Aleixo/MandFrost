const ItemCarrinho = require('../models/ItemCarrinho');
const Usuario = require('../models/User');
const Produto = require('../models/Produto');

const getAllItensCarrinhos = async (id_usuario) => {
    return await ItemCarrinho.findAll({
        where: {
            id_usuario: id_usuario
        }
    });
};

const createItemCarrinho = async (id_usuario, id_produto, quantidade) => {

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        throw new Error('Usuario não encontrado');
    };

    const produto = await Produto.findByPk(id_produto);

    if (!produto) {
        throw new Error('Produto não encontrado');
    } 

    const itemCarrinhoExistente = await ItemCarrinho.findOne({
        where: { id_usuario: usuario.id, id_produto: produto.id }
    });

    if (itemCarrinhoExistente) {
        const quantidadeNova = itemCarrinhoExistente.quantidade + quantidade
        
        if(quantidadeNova > produto.estoque) {
            itemCarrinhoExistente.quantidade = produto.estoque
        } else {  
            itemCarrinhoExistente.quantidade = quantidadeNova;
        }

        await itemCarrinhoExistente.save();

        return itemCarrinhoExistente;
    }

    return await ItemCarrinho.create({ id_usuario: usuario.id, id_produto: produto.id, quantidade: quantidade })
};

const editItemCarrinho = async (id_carrinho, quantidade) => {

    const itemCarrinho = await ItemCarrinho.findByPk(id_carrinho);

    if (!itemCarrinho) {
        throw new Error('Item do carrinho não encontrado');
    };

    const quantidadeNova = itemCarrinho.quantidade + quantidade
    itemCarrinho.quantidade = quantidadeNova

    await itemCarrinho.save();

    return itemCarrinho
};

const removeItemCarrinho = async (id) => {
    const deletedCount = await ItemCarrinho.destroy({
        where: { id: id }
    });

    return deletedCount > 0;
}



module.exports = { getAllItensCarrinhos, createItemCarrinho, editItemCarrinho, removeItemCarrinho }