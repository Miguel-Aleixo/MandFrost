'use client'

// HOOKS
import { useEffect, useState } from "react";
import { useListarItensCarrinho } from "@/app/hooks/carrinho/listarItemCarrinho";
import { useListarCategorias } from "@/app/hooks/categoria/listarCategoria";
import { useListarProdutos } from "@/app/hooks/produto/listarProduto";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiAlertCircle, FiCheck } from "react-icons/fi";
import { IoIceCreamOutline, IoWarningOutline } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";

// COMPONENTES
import { Loading } from "@/app/components/loading/loading";
import { ToastProvider } from "@/app/components/loading/toaster";
import SuccessAnimation from "@/app/components/carrinho/SuccessAnimation";

// ===== COMPONENTE DE ITEM DO CARRINHO =====
function CarrinhoItem({
    item,
    produto,
    categoria,
    onAumentar,
    onDiminuir,
    onRemover,
    loading
}) {
    const precoTotal = produto.preco * item.quantidade;
    const estaIndisponivel = !produto || item.quantidade > produto.estoque;
    const semEstoque = produto.estoque === 0;

    return (
        <div className={`p-5 border-b border-gray-100 last:border-b-0 transition-all duration-200 ${estaIndisponivel ? 'bg-red-50' : ''}`}>
            <div className="flex gap-4">
                {/* IMAGEM DO PRODUTO */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {produto.imagem_url ? (
                        <img
                            src={produto.imagem_url}
                            alt={produto.nome}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <IoIceCreamOutline className="h-8 w-8 text-orange-500" />
                        </div>
                    )}
                </div>

                {/* INFORMAÇÕES DO PRODUTO */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                                {produto.nome}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {categoria?.nome || 'Sem categoria'}
                            </p>
                        </div>
                        <button
                            onClick={() => onRemover(item.id)}
                            disabled={loading}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                            aria-label="Remover item"
                        >
                            <FiTrash2 className="h-5 w-5" />
                        </button>
                    </div>

                    {/* ALERTAS DE INDISPONIBILIDADE */}
                    {estaIndisponivel && (
                        <div className="flex items-center gap-2 text-red-600 text-xs mb-3 bg-red-50 px-2 py-1 rounded-lg w-fit">
                            <FiAlertCircle className="h-4 w-4" />
                            {semEstoque ? (
                                <span>Produto indisponível</span>
                            ) : (
                                <span>Quantidade excede estoque ({produto.estoque} disponíveis)</span>
                            )}
                        </div>
                    )}

                    {/* CONTROLES */}
                    <div className="flex items-center justify-between">
                        {/* CONTROLE DE QUANTIDADE */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button
                                onClick={() => onDiminuir(item.id)}
                                disabled={item.quantidade === 1 || loading}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                aria-label="Diminuir quantidade"
                            >
                                <FiMinus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-bold text-gray-900 min-w-[2.5rem] text-center">
                                {item.quantidade}
                            </span>
                            <button
                                onClick={() => onAumentar(item.id)}
                                disabled={item.quantidade >= produto.estoque || loading}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                aria-label="Aumentar quantidade"
                            >
                                <FiPlus className="h-4 w-4" />
                            </button>
                        </div>

                        {/* PREÇO TOTAL */}
                        <div className="text-right">
                            <p className="text-xs text-gray-600 mb-1">
                                R$ {produto.preco} x {item.quantidade}
                            </p>
                            <p className="text-lg font-bold text-orange-600">
                                R$ {precoTotal.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== COMPONENTE DE MÉTODO DE PAGAMENTO =====
function MetodoPagamento({
    metodo,
    label,
    descricao,
    icon: Icon,
    selecionado,
    onChange
}) {
    return (
        <button
            onClick={() => onChange(metodo)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${selecionado
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
            aria-pressed={selecionado}
        >
            <div className={`p-2 rounded-lg flex-shrink-0 ${selecionado
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600'
                }`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-gray-600 text-xs">{descricao}</p>
            </div>
            {selecionado && (
                <FiCheck className="h-5 w-5 text-orange-500 flex-shrink-0" />
            )}
        </button>
    );
}

// ===== COMPONENTE DE RESUMO DO PEDIDO =====
function ResumoPedido({
    total,
    itensCarrinho,
    hasItemIndisponivel,
    metodoPagamento,
    onMetodoPagamentoChange,
    onFinalizarPedido,
    loading
}) {
    const subtotal = total;
    const desconto = 0;
    const totalFinal = (subtotal - desconto).toFixed(2);

    return (
        <div className="sticky top-24 space-y-4">
            {/* MÉTODOS DE PAGAMENTO */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-base">Método de Pagamento</h3>
                </div>
                <div className="p-5 space-y-3">
                    <MetodoPagamento
                        metodo="PIX"
                        label="PIX"
                        descricao="Transferência instantânea"
                        icon={MdOutlinePayment}
                        selecionado={metodoPagamento === 'PIX'}
                        onChange={onMetodoPagamentoChange}
                    />
                    <MetodoPagamento
                        metodo="CARTAO"
                        label="Cartão de Crédito"
                        descricao="Parcelado em até 12x"
                        icon={MdOutlinePayment}
                        selecionado={metodoPagamento === 'CARTAO'}
                        onChange={onMetodoPagamentoChange}
                    />
                    <MetodoPagamento
                        metodo="DINHEIRO"
                        label="Dinheiro"
                        descricao="Pagamento na entrega"
                        icon={MdOutlinePayment}
                        selecionado={metodoPagamento === 'DINHEIRO'}
                        onChange={onMetodoPagamentoChange}
                    />
                </div>
            </div>

            {/* CARD DE RESUMO */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* CABEÇALHO */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
                    <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <MdOutlinePayment className="text-orange-500" />
                        Resumo do Pedido
                    </h2>
                </div>

                {/* DETALHES */}
                <div className="p-5 space-y-4">
                    {/* SUBTOTAL */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-semibold text-gray-900">R$ {subtotal}</span>
                    </div>

                    {/* DESCONTO */}
                    {desconto > 0 && (
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <span className="text-gray-700">Desconto</span>
                            <span className="font-semibold text-green-600">-R$ {desconto.toFixed(2)}</span>
                        </div>
                    )}

                    {/* TOTAL */}
                    <div className="flex items-center justify-between pt-3 pb-4 border-b border-gray-100">
                        <span className="font-bold text-gray-900 text-lg">Total</span>
                        <span className="font-bold text-orange-600 text-2xl">
                            R$ {totalFinal}
                        </span>
                    </div>

                    {/* NÚMERO DE ITENS */}
                    <p className="text-sm text-gray-600">
                        {itensCarrinho.length} {itensCarrinho.length === 1 ? 'item' : 'itens'} no carrinho
                    </p>
                </div>
            </div>

            {/* BOTÃO DE FINALIZAR */}
            <button
                onClick={onFinalizarPedido}
                disabled={hasItemIndisponivel || loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg ${hasItemIndisponivel || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl active:scale-95'
                    }`}
                aria-label="Finalizar pedido"
            >
                {loading ? 'Processando...' : 'Finalizar Pedido'}
            </button>

            {/* ALERTA DE INDISPONIBILIDADE */}
            {hasItemIndisponivel && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <FiAlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-red-800 text-sm">Não é possível finalizar</p>
                        <p className="text-red-700 text-sm">Alguns produtos estão indisponíveis ou com quantidade inválida.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ===== COMPONENTE PRINCIPAL =====
export default function Carrinho() {
    // CONFIGURAÇÃO
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = Cookies.get('token');
    const router = useRouter();

    // DADOS
    const { itensCarrinho, loadingitensCarrinho, refreshitensCarrinho } = useListarItensCarrinho();
    const { categorias } = useListarCategorias();
    const { produtos } = useListarProdutos();

    // ESTADO LOCAL
    const [carregando, setCarregando] = useState(false);
    const [total, setTotal] = useState(0);
    const [metodoPagamento, setMetodoPagamento] = useState("PIX");
    const [mostrarAnimacaoConclusao, setMostrarAnimacaoConclusao] = useState(false);

    // CÁLCULO DO TOTAL
    useEffect(() => {
        if (!itensCarrinho || itensCarrinho.length === 0) {
            setTotal(0);
            return;
        }

        const novoTotal = itensCarrinho.reduce((acc, item) => {
            const produto = produtos.find(prod => prod.id === item.id_produto);
            return acc + (produto ? produto.preco * item.quantidade : 0);
        }, 0);

        setTotal(novoTotal.toFixed(2));
    }, [itensCarrinho, produtos]);

    // VERIFICAÇÃO DE INDISPONIBILIDADE
    const hasItemIndisponivel = itensCarrinho.some(item => {
        const produto = produtos.find(prod => prod.id === item.id_produto);
        return !produto || item.quantidade > produto.estoque;
    });

    // FUNÇÕES DE AÇÃO
    const editarItemCarrinho = async (id, delta) => {
        setCarregando(true);

        try {
            const res = await fetch(`${API_URL}/item-carrinho/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantidade: delta })
            });

            if (!res.ok) {
                toast.error('Erro ao atualizar item');
            } else {
                toast.success('Item atualizado');
            }
        } catch (err) {
            console.error(err);
            toast.error('Erro ao atualizar item');
        } finally {
            await refreshitensCarrinho();
            setCarregando(false);
        }
    };

    const deletarItemCarrinho = async (id) => {
        setCarregando(true);

        try {
            const res = await fetch(`${API_URL}/item-carrinho/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                toast.error('Erro ao remover item');
            } else {
                toast.success('Item removido');
            }
        } catch (err) {
            console.error(err);
            toast.error('Erro ao remover item');
        } finally {
            await refreshitensCarrinho();
            setCarregando(false);
        }
    };

    const finalizarPedido = async () => {
        if (hasItemIndisponivel) {
            toast.error('Resolva os problemas de estoque antes de finalizar');
            return;
        }

        setCarregando(true);

        try {
            console.log({
                metodo: metodoPagamento,
                total,
                itens: itensCarrinho
            });

            // Mostrar animação de sucesso
            setMostrarAnimacaoConclusao(true);

            // Após a animação, redirecionar
            setTimeout(() => {
                setMostrarAnimacaoConclusao(false);
                router.push('/usuario/cardapio');
            }, 3500);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao finalizar pedido');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pb-24">
            {/* ANIMAÇÃO DE CONCLUSÃO PREMIUM */}
            <SuccessAnimation
                open={mostrarAnimacaoConclusao}
                onFinish={() => setMostrarAnimacaoConclusao(false)}
            />

            {/* CABEÇALHO */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Voltar"
                            >
                                <FiArrowLeft className="h-6 w-6 text-gray-700" />
                            </button>
                            <div className="relative">
                                <FiShoppingCart className="h-7 w-7 text-orange-500" />
                                {itensCarrinho.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {itensCarrinho.length}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Meu Carrinho</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* LOADING */}
            <Loading carregandoListar={loadingitensCarrinho} carregandoGeral={carregando} />

            {/* TOASTER */}
            <ToastProvider />

            {/* CONTEÚDO PRINCIPAL */}
            <main className="container mx-auto px-6 py-8">
                {itensCarrinho.length === 0 ? (
                    // CARRINHO VAZIO
                    <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IoIceCreamOutline className="h-16 w-16 text-orange-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Carrinho Vazio</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                            Seu carrinho está esperando por delícias! Explore nosso cardápio e adicione alguns produtos.
                        </p>
                        <button
                            onClick={() => router.push('/usuario/cardapio')}
                            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                        >
                            Explorar Cardápio
                        </button>
                    </div>
                ) : (
                    // CARRINHO COM ITENS
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LISTA DE ITENS */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* ALERTA DE INDISPONIBILIDADE */}
                            {hasItemIndisponivel && (
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                                    <IoWarningOutline className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-yellow-800 text-sm">Atenção!</h3>
                                        <p className="text-yellow-700 text-sm">Alguns produtos podem estar indisponíveis ou com estoque limitado.</p>
                                    </div>
                                </div>
                            )}

                            {/* ITENS */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
                                    <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                        <FiShoppingCart className="text-orange-500" />
                                        Itens no Carrinho
                                    </h2>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {itensCarrinho.map(item => {
                                        const produto = produtos.find(p => p.id === item.id_produto);
                                        if (!produto) return null;

                                        const categoria = categorias.find(c => c.id === produto.id_tipo_produto);

                                        return (
                                            <CarrinhoItem
                                                key={item.id}
                                                item={item}
                                                produto={produto}
                                                categoria={categoria}
                                                onAumentar={(id) => editarItemCarrinho(id, 1)}
                                                onDiminuir={(id) => editarItemCarrinho(id, -1)}
                                                onRemover={deletarItemCarrinho}
                                                loading={carregando}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RESUMO DO PEDIDO */}
                        <ResumoPedido
                            total={total}
                            itensCarrinho={itensCarrinho}
                            hasItemIndisponivel={hasItemIndisponivel}
                            metodoPagamento={metodoPagamento}
                            onMetodoPagamentoChange={setMetodoPagamento}
                            onFinalizarPedido={finalizarPedido}
                            loading={carregando}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
