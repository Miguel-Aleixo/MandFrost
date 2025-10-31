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
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { IoIceCreamOutline, IoWarningOutline } from "react-icons/io5";

// COMPONENTES
import { Loading } from "@/app/components/loading/loading";
import { ToastProvider } from "@/app/components/loading/toaster";


export default function Carrinho() {
    // FORMULARIO
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = Cookies.get('token');

    // NAVEGAÇÃO
    const router = useRouter();

    // LISTAGEM
    const { itensCarrinho, loadingitensCarrinho, refreshitensCarrinho } = useListarItensCarrinho();
    const { categorias, loadingCategorias, refreshCategorias } = useListarCategorias();
    const { produtos, loadingProdutos, refreshProdutos } = useListarProdutos();

    // LOADING
    const [carregando, setCarregando] = useState(false);

    // VALOR TOTAL
    const [total, setTotal] = useState(0)
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

    // DISPONIBILIDADE DE PRODUTO
    const hasItemIndisponivel = itensCarrinho.some(item => {
        const produto = produtos.find(prod => prod.id === item.id_produto);
        return !produto || item.quantidade > produto.estoque;
    });

    // EDITAR 
    const editarItemCarrinho = async (id, delta) => {
        setCarregando(true)

        try {
            const res = await fetch(`${API_URL}/item-carrinho/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quantidade: delta
                })
            });

            if (!res.ok) {
                toast.error('Erro ao atualizar item do carrinho')
            } else {
                toast.success('Sucesso ao atualizar item do carrinho')
            };

        } catch (err) {
            console.log(err);
        } finally {
            await refreshitensCarrinho();
            setCarregando(false)
        }
    };

    // DELETAR
    const deletarItemCarrinho = async (id) => {
        setCarregando(true)

        try {
            const res = await fetch(`${API_URL}/item-carrinho/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                toast.error('Erro ao tirar do carrinho')
            } else {
                toast.success('Sucesso ao tirar do carrinho')
            }
        } catch (err) {
            console.log(err);
        } finally {
            await refreshitensCarrinho();
            setCarregando(false);
        }
    };

    // FINALIZAR PEDIDO
    const [metodoPagamento, setMetodoPagamento] = useState("PIX");

    const finalizarPedido = async () => {
        console.log(metodoPagamento, total, itensCarrinho);



    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24">

            {/* CABEÇALHO*/}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">

                            <div className="flex items-center gap-3">
                                <div className="relative p-2 left-1">
                                    <FiShoppingCart className="h-7 w-7 text-orange-500" />
                                    {itensCarrinho.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {itensCarrinho.length}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-xl font-bold text-gray-800">Meu Carrinho</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* LOADING */}
            <Loading carregandoListar={loadingitensCarrinho} carregandoGeral={carregando} />

            {/* TOASTER */}
            <ToastProvider />

            {/* CONTEÚDO PRINCIPAL */}
            <main className="container mx-auto px-4 py-6">
                {itensCarrinho.length === 0 ? (

                    // CARRINHO VAZIO
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoIceCreamOutline className="h-12 w-12 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Carrinho vazio</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Seu carrinho está esperando por delícias! Explore nosso cardápio e adicione alguns produtos.
                        </p>
                        <button
                            onClick={() => router.push('/usuario/cardapio')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
                        >
                            Explorar Cardápio
                        </button>
                    </div>
                ) : (
                    // CARRINHO COM ITENS
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LISTA DE ITENS */}
                        <div className="lg:col-span-2 space-y-4">

                            {/* ALERTAS */}
                            {hasItemIndisponivel && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                                    <IoWarningOutline className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-yellow-800 text-sm">Atenção!</h3>
                                        <p className="text-yellow-700 text-sm">Alguns produtos podem estar indisponíveis ou com estoque limitado.</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-5 border-b border-gray-100">
                                    <h2 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                                        <FiShoppingCart className="text-orange-500" />
                                        Itens no Carrinho
                                    </h2>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {itensCarrinho.map(item => {
                                        const produto = produtos.find(p => p.id === item.id_produto);
                                        if (!produto) return null;

                                        const categoria = categorias.find(c => c.id === produto.id_tipo_produto);
                                        const precoTotal = produto.preco * item.quantidade;
                                        const estaIndisponivel = !produto || item.quantidade > produto.estoque;
                                        const semEstoque = produto.estoque === 0;

                                        return (
                                            <div key={item.id} className="p-5">
                                                <div className="flex gap-4">
                                                    {/* IMAGEM DO PRODUTO */}
                                                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
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

                                                    {/* INFORMAÇÕES DO PRODUTO*/}
                                                    <div className="flex-grow min-w-0">
                                                        <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                                                            {produto.nome}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm mb-2">
                                                            {categoria?.nome || 'Sem categoria'}
                                                        </p>

                                                        {estaIndisponivel ? (
                                                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                                                <FiAlertCircle className="h-4 w-4" />
                                                                {semEstoque ? (
                                                                    <span>Produto indisponível</span>
                                                                ) : (
                                                                    <span>Estoque insuficiente</span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-orange-600">
                                                                R$ {precoTotal.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* CONTROLES DE QUANTIDADE */}
                                                    <div className="flex flex-col items-end gap-3">
                                                        <button
                                                            onClick={() => deletarItemCarrinho(item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                            title="Remover item"
                                                        >
                                                            <FiTrash2 className="h-4 w-4" />
                                                        </button>

                                                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                                                            <button
                                                                onClick={() => editarItemCarrinho(item.id, -1)}
                                                                disabled={item.quantidade <= 1}
                                                                className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <FiMinus className="h-3 w-3" />
                                                            </button>

                                                            <span className="px-3 py-1 text-sm font-semibold min-w-[2rem] text-center text-gray-800">
                                                                {item.quantidade}
                                                            </span>

                                                            <button
                                                                onClick={() => editarItemCarrinho(item.id, +1)}
                                                                disabled={item.quantidade >= produto.estoque}
                                                                className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <FiPlus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RESUMO DO PEDIDO */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
                                <div className="p-5 ">
                                    <h2 className="font-semibold text-gray-800 text-lg">Resumo do Pedido</h2>
                                </div>

                                <div className="p-5 pt-0 space-y-4">

                                    {/* MÉTODOS DE PAGAMENTO */}
                                    <div className="pl-1">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Método de Pagamento</h3>
                                        <div className="space-y-2">
                                            {["PIX", "CARTAO_DEBITO", "CARTAO_CREDITO"].map(metodo => (
                                                <label key={metodo} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        value={metodo}
                                                        checked={metodoPagamento === metodo}
                                                        onChange={() => setMetodoPagamento(metodo)}
                                                        className="text-orange-500 focus:ring-orange-500"
                                                    />
                                                    <span className="text-gray-700">
                                                        {metodo === "PIX" && "Pix"}
                                                        {metodo === "CARTAO_DEBITO" && "Cartão Débito"}
                                                        {metodo === "CARTAO_CREDITO" && "Cartão Crédito"}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* TOTAL */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                                            <span>Total</span>
                                            <span>R$ {total}</span>
                                        </div>
                                    </div>

                                    <button
                                        disabled={itensCarrinho.length === 0 || hasItemIndisponivel}
                                        onClick={finalizarPedido}
                                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 mt-4 
          ${itensCarrinho.length === 0 || hasItemIndisponivel
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                            }`}
                                    >
                                        Finalizar Pedido
                                    </button>

                                    {hasItemIndisponivel && (
                                        <p className="text-xs text-red-600 text-center">
                                            Remova os produtos indisponíveis para finalizar o pedido
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}