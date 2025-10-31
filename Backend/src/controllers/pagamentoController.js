const pagamentoService = require('../service/pagamentoService');

const criarPagamento = async (req, res, next) => {
    try {
        const { itens, total, metodoPagamento } = req.body

        if (!itens || itens.length === 0) {
            return res.status(400).json({ error: "Carrinho vazio" });
        }

        if (!metodoPagamento) {
            return res.status(400).json({ error: "Método de pagamento obrigatório" });
        }

        const pagamento = await pagamentoService.criarPagamento(itens, total, metodoPagamento);

        res.status(201).json(pagamento);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { criarPagamento }