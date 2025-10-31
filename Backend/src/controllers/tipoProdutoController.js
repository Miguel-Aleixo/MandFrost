const tipoProdutoService = require('../service/tipoProdutoService');

const getTiposProduto = async (req, res, next) => {
    try {
        const tiposProduto = await tipoProdutoService.getAllTiposProduto();
        res.json(tiposProduto);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addTipoProduto = async (req, res, next) => {
    try {
        const newTipoProduto = await tipoProdutoService.createTipoProduto(req.body, req.file);
        res.status(201).json(newTipoProduto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateTipoProduto = async (req, res, next) => {
    try {
        const updateTipoProduto = await tipoProdutoService.editTipoProduto(req.params.id, req.body, req.file);
        res.status(200).json(updateTipoProduto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deleteTipoProduto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await tipoProdutoService.removeTipoProduto(id)
        if (!deleted) {
            return res.status(404).json({ message: 'Tipo produto não encontrado' });
        }
        res.status(200).json({ message: 'Tipo produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const filtersTiposProduto = async (req, res, next) => {
    try {
        const { nome } = req.body
        const tiposProduto = await tipoProdutoService.getFiltersTiposProduto(nome);
        res.json(tiposProduto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getTiposProduto, addTipoProduto, updateTipoProduto, deleteTipoProduto, filtersTiposProduto };