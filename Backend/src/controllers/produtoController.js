const produtoService = require('../service/produtoService');

const getProdutos = async (req, res, next) => {
    try {
        const produtos = await produtoService.getAllProdutos();
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addProduto = async (req, res, next) => {
    try {
        const newProduto = await produtoService.createProduto(req.body, req.file);
        res.status(201).json(newProduto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateProduto = async (req, res, next) => {
    try {
        const updatedProduto = await produtoService.editProduto(req.params.id, req.body, req.file);
        res.status(200).json(updatedProduto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteProduto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await produtoService.removeProduto(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const filtersProdutos = async (req, res, next) => {
    try {
        const { nome, categoria } = req.body
        const produtos = await produtoService.getFiltersProdutos(nome, categoria);
        res.json(produtos);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getProdutos, addProduto, updateProduto, deleteProduto, filtersProdutos };
