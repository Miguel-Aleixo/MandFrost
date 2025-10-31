const criarPagamento = async (itens, validator, metodoPagamento) => {
    let pagamento = null;

    // PIX
    if (metodoPagamento === "PIX") {
        pagamento = {
            tipo: "PIX",
            qrCode: `00020126580014BR.GOV.BCB.PIX0136pix@seudominio.com520400005303986540${total}5802BR5913Loja Teste6009Sao Paulo62070503***6304ABCD`,
        };
    };

    // CARTÃO
    if (["CARTAO_DEBITO", "CARTAO_CREDITO"].includes(metodoPagamento)) {
        pagamento = {
            tipo: metodoPagamento,
            status: "AGUARDANDO_MAQUININHA",
        };
    }
};

module.exports = { criarPagamento }