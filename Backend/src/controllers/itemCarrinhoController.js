const itemCarrinhoService = require('../service/itemCarrinhoService');

const getItensCarrinhos = async (req, res, next) => {
    try {
        const { id_usuario } = req.params
        const itensCarrinhos = await itemCarrinhoService.getAllItensCarrinhos(id_usuario);
        res.json(itensCarrinhos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addItemCarrinho = async (req, res, next) => {
    try {
        const { id_usuario, id_produto, quantidade } = req.body;        ;
        
        const newItemCarrinho = await itemCarrinhoService.createItemCarrinho(id_usuario, id_produto, quantidade);
        res.status(201).json(newItemCarrinho);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateItemCarrinho = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantidade } = req.body;

        const updatedItemCarrinho = await itemCarrinhoService.editItemCarrinho(id, quantidade);
        res.status(200).json(updatedItemCarrinho);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteItemCarrinho = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await itemCarrinhoService.removeItemCarrinho(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.status(200).json({ message: 'Produto removido com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getItensCarrinhos, addItemCarrinho, updateItemCarrinho, deleteItemCarrinho }