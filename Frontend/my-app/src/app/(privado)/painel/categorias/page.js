'use client'

// HOOKS
import { useState } from 'react'
import { useListarProdutos } from '@/app/hooks/produto/listarProduto'
import { useListarCategorias } from '@/app/hooks/categoria/listarCategoria'

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { FiSearch, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import { FaTags } from "react-icons/fa6";
import { IoMdCube } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import Image from 'next/image';

export default function PainelProdutos() {
    // FILTRAGEM
    const [nome, setNome] = useState('');

    // LISTAGEM
    const { categorias, loadingCategorias, refreshCategorias } = useListarCategorias(nome);
    const { produtos, loadingProdutos, refreshProdutos } = useListarProdutos();

    // FORMULÁRIO
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = Cookies.get('token');

    const [Form, setForm] = useState({
        id: 0,
        nome: '',
        descricao: '',
        imagem: '',
    })

    // MODAL
    const [modalAberto, setModalAberto] = useState(false)
    const [categoriaEditando, setCategoriaEditando] = useState(false)

    // PREVIEW
    const [preview, setPreview] = useState('');
    const [nomePreview, setNomePreview] = useState('');

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...Form, imagem: file });
            setNomePreview(file.name)
            setPreview(URL.createObjectURL(file));
        }
    }

    // CRIAR 
    const handleCriarCategoria = async () => {
        const formData = new FormData();

        formData.append("nome", Form.nome);
        formData.append("descricao", Form.descricao);

        if (Form.imagem) {
            formData.append("imagem", Form.imagem);
        };

        try {
            const res = await fetch(`${API_URL}/tipo-produto`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                alert('Erro ao criar o categoria');
            } else {
                alert('Sucesso ao criar o categoria');
            };

        } catch (err) {
            console.log(err);
        } finally {
            setModalAberto(false);
            setCategoriaEditando(false);
            setPreview('');
            setNomePreview('');
            setForm({
                id: 0,
                nome: '',
                descricao: '',
                imagem: '',
            })
            refreshCategorias();
        }
    };

    // EDITAR
    const EditarCategoria = (categoria) => {
        if (categoria.imagem_url) {
            const url = categoria.imagem_url;
            setNomePreview(`${categoria.nome}.jpg`);
            setPreview(url);
        }

        setForm({
            id: categoria.id,
            nome: categoria.nome,
            descricao: categoria.descricao,
            imagem: '',
        });

    };

    const handleEditarCategoria = async () => {
        const formData = new FormData();

        formData.append("nome", Form.nome);
        formData.append("descricao", Form.descricao);

        if (Form.imagem) {
            formData.append("imagem", Form.imagem);
        };

        try {
            const res = await fetch(`${API_URL}/tipo-produto/${Form.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                alert('Erro ao editar o categoria');
            } else {
                alert('Sucesso ao editar o categoria');
            };

        } catch (err) {
            console.log(err);
        } finally {
            setModalAberto(false);
            setCategoriaEditando(false);
            setPreview('');
            setNomePreview('');
            setForm({
                id: 0,
                nome: '',
                descricao: '',
                imagem: '',
            })
            refreshCategorias();
        }
    };

    // DELETAR
    const handleDeletarCategoria = async (id) => {
        try {
            const res = await fetch(`${API_URL}/tipo-produto/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!res.ok) {
                alert('Erro ao deletar categoria');
            } else {
                alert('Sucesso ao criar categoria');
            }
        } catch (err) {
            console.log(err);
        } finally {
            refreshCategorias();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* CABEÇALHO */}
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-orange-500">Painel de Categorias</h1>
                <p className="text-gray-600">Gerencie todas categorias do cardápio</p>
            </div>

            {/* MODAL */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-orange-600">
                            <h2 className="text-xl text-orange-500 font-semibold">
                                {categoriaEditando ? 'Editar Categoria' : 'Novo Categoria'}
                            </h2>
                            <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600">
                                <IoIosClose className='h-10 w-10' />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                if (categoriaEditando) {
                                    handleEditarCategoria();
                                } else {
                                    handleCriarCategoria();
                                }
                            }}
                            className="p-6 space-y-4"
                        >
                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    required
                                    value={Form.nome}
                                    onChange={(e) => setForm({ ...Form, nome: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                />
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    required
                                    value={Form.descricao}
                                    onChange={(e) => setForm({ ...Form, descricao: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                />
                            </div>

                            {/* Imagem */}
                            <div className='relative'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>

                                {preview ? (
                                    <div>
                                        <input
                                            placeholder={nomePreview || ''}
                                            className="w-full px-3 py-2 placeholder-black border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        />
                                        <div className='absolute h-[35px] w-15 top-[28px] right-8'>
                                            <Image
                                                src={preview || ''}
                                                alt='Imagem produto'
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                        <IoIosClose
                                            onClick={(e) => {
                                                setPreview('')
                                                setNomePreview('')
                                                setForm({ ...Form, imagem: '' })
                                            }}
                                            className='absolute h-8 w-8 text-red-500 right-[2px] top-[30px]'
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        onChange={handleChangeImage}
                                        accept="image/*"
                                        value={undefined}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    />
                                )}
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                                >
                                    {categoriaEditando ? 'Salvar' : 'Criar'} Categoria
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ESTATÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                {/* CARD PRODUTOS */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-700">Produtos</h2>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <IoMdCube className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-2">{produtos.length}</p>
                    <p className="text-sm text-gray-500">Total de produtos no sistema</p>
                </div>

                {/* CARD CATEGORIAS */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-700">Categorias</h2>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaTags className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 mb-2">{categorias.length}</p>
                    <p className="text-sm text-gray-500">Total de categorias criadas</p>
                </div>
            </div>

            {/* FLTROS E BUSCA */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 text-black">
                <div className="flex flex-col-reverse md:flex-row gap-4 items-center">

                    <div className='flex flex-row gap-4 w-full'>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Buscar categorias..."
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="peer w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-orange-500" />
                        </div>
                    </div>

                    {/* BOTÃO ADICIONAR */}
                    <button
                        onClick={() => {
                            setCategoriaEditando(false);
                            setPreview('');
                            setNomePreview('');
                            setForm({
                                id: 0,
                                nome: '',
                                descricao: '',
                                imagem: '',
                            })
                            setModalAberto(true)
                        }}
                        className="bg-orange-500 whitespace-nowrap w-full md:w-auto hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 cursor-pointer"
                    >
                        <FiPlus className="h-4 w-4" />
                        Nova Categoria
                    </button>
                </div>
            </div>

            {/* LISTA DE CATEGORIAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map(categoria => {

                    const numeroProdutos = produtos.filter(prod => prod.id_tipo_produto === categoria.id).length;

                    return (
                        <div key={categoria.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* IMAGEM DA CATEGORIA */}
                            <div className="h-48 relative bg-center bg-cover"
                                style={{ backgroundImage: `url(${categoria.imagem_url})` }}>
                            </div>

                            {/* INFOMAÇOES */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-800 text-lg">{categoria.nome}</h3>
                                </div>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{categoria.descricao}</p>

                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm ${numeroProdutos > 10 ? 'text-green-600' : numeroProdutos > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {numeroProdutos} produtos adicionados
                                    </span>
                                </div>

                                {/* Ações */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            EditarCategoria(categoria)
                                            setCategoriaEditando(true)
                                            setModalAberto(true)
                                        }}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <FiEdit className="h-4 w-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeletarCategoria(categoria.id)}
                                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
