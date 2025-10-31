'use client'

// HOOKS
import { useState } from "react";
import { useToken } from "@/app/hooks/auth/verificaRole";
import { useListarCategorias } from "@/app/hooks/categoria/listarCategoria";
import { useListarProdutos } from "@/app/hooks/produto/listarProduto";
import { useListarItensCarrinho } from "@/app/hooks/carrinho/listarItemCarrinho";
import toast from "react-hot-toast";

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { IoIceCreamOutline } from "react-icons/io5";

// COMPONENTES
import { Buscar } from "@/app/components/cardapio/buscar";
import { Loading } from "@/app/components/loading/loading";
import { ToastProvider } from "@/app/components/loading/toaster";

export default function Cardapio() {
  // FORMULARIO
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get('token');

  // PEGAR ID DO USUARIO
  const token_usuario = useToken();
  const id_usuario = token_usuario?.id

  // FILTRAGEM
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  // LISTAGEM
  const { categorias, loadingCategorias, refreshCategorias } = useListarCategorias();
  const { produtos, loadingProdutos, refreshProdutos } = useListarProdutos(nome, categoriaId);
  const { itensCarrinho, loadingitensCarrinho, refreshitensCarrinho } = useListarItensCarrinho();

  // LOADING
  const [carregando, setCarregando] = useState(false)

  // ATUALIZAR QUANTIDADE
  const [quantidades, setQuantidades] = useState({});
  const atualizarQuantidades = (id_produto, delta, estoque) => {
    setQuantidades(prev => {
      const atual = prev[id_produto] || 0;
      const novoValor = Math.max(0, Math.min(atual + delta, estoque));
      return { ...prev, [id_produto]: novoValor };
    });
  }

  // ADICIONAR NO CARRINHO
  const adicionarAoCarrinho = async (id_produto) => {
    const quantidade = quantidades[id_produto];

    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/item-carrinho`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_usuario: id_usuario,
          id_produto: id_produto,
          quantidade: quantidade
        })
      });

      if (!res.ok) {
        toast.error("Erro ao adicionar ao carrinho");
        return;
      } else {
        toast.success("Adicionado ao carrinho");
        setQuantidades(prev => ({ ...prev, [id_produto]: 0 }));
      };
    } catch (err) {
      console.log(err);
    } finally {
      await refreshitensCarrinho();
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Buscar value={nome} setValue={setNome} />

      {/* LOADING */}
      <Loading carregandoListar={loadingitensCarrinho} carregandoGeral={carregando} />

      {/* TOASTER */}
      <ToastProvider />

      {/* CONTEÚDO */}
      <main className="container mx-auto px-6 pt-20 py-8">
        {produtos.length === 0 ? (
          <div className="text-center py-16">
            <IoIceCreamOutline className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-2 text-gray-500">
              Tente ajustar os filtros ou termos de busca.
            </p>
          </div>
        ) : (
          <>

            {/* ORDENAÇÃO */}
            <div className="pl-2 flex py-5 justify-between items-center">
              <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                <button
                  onClick={() => setCategoriaId('')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full border border-zinc-200 text-sm font-medium transition-colors ${categoriaId === ''
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Todos
                </button>

                {categorias.map(categoria => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaId(categoria.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full border border-zinc-200 text-sm font-medium transition-colors ${categoriaId === categoria.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {categoria.nome}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTA PRODUTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map(produto => {
                const quantidade = quantidades[produto.id] || 0;
                const itemCarrinho = itensCarrinho.filter(item => item.id_produto === produto.id && item.id_usuario === id_usuario);
                const quantidadeNoCarrinho = itemCarrinho[0]?.quantidade || 0;

                const disponivel = produto.estoque - quantidadeNoCarrinho
                const estaDisponivel = disponivel <= 0 ? false : true;

                return (
                  <div
                    key={produto.id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* IMAGEM DO PRODUTO */}
                    <div
                      className="h-48 relative bg-center bg-cover hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url(${produto.imagem_url})` }}
                    />

                    {/* INFORMAÇÕES DO PRODUTO */}
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 text-lg">{produto.nome}</h3>
                        <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-xs px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                          {categorias.filter(cat => cat.id === produto.id_tipo_produto).map(cat => (
                            <span key={cat.id}>{cat.nome}</span>
                          ))}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{produto.descricao}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                          R$ {produto.preco}
                        </span>
                        {!estaDisponivel && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Indisponível
                          </span>
                        )}
                        {estaDisponivel && produto.estoque < 10 && (
                          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                            Últimas {produto.estoque - quantidadeNoCarrinho} unidades
                          </span>
                        )}
                      </div>

                      {/* CONTROLES DE QUANTIDADE E ADICIONAR NO CARRINHO */}
                      {estaDisponivel ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center py-1 border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => atualizarQuantidades(produto.id, -1, produto.estoque)}
                              disabled={quantidade === 0}
                              className="px-2 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <FiMinus className="h-3 w-3" />
                            </button>

                            <span className={`px-3 py-1 text-sm font-medium min-w-[2rem] text-center ${quantidade < 1
                              ? 'text-gray-300'
                              : 'text-black'
                              }`}>
                              {quantidade}
                            </span>

                            <button
                              onClick={() => atualizarQuantidades(produto.id, +1, produto.estoque)}
                              disabled={quantidade >= produto.estoque - quantidadeNoCarrinho}
                              className="px-2 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <FiPlus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* BOTÃO ADICIONAR */}
                          <button
                            onClick={() => adicionarAoCarrinho(produto.id)}
                            disabled={quantidade === 0}
                            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-3 rounded-lg shadow transition-colors"
                          >
                            <FiShoppingCart className="h-4 w-4" />
                            Adicionar
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-500 text-sm font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                        >
                          Produto Indisponível
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}