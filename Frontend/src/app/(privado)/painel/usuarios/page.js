'use client'

// HOOOKS
import { useListarUsuarios } from '@/app/hooks/usuario/listarUsuario';
import { useState } from 'react';

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { IoIosArrowDown } from "react-icons/io";
import { FiSearch } from 'react-icons/fi';
import { FaUser, FaUserCheck, FaUserTimes, FaUserShield } from "react-icons/fa";
import { Loading } from '@/app/components/loading/loading';
import { ToastProvider } from '@/app/components/loading/toaster';
import toast from 'react-hot-toast';
export default function Usuarios() {
    // FILTRO
    const [nome, setNome] = useState('');
    const [status, setStatus] = useState('');
    const [tipo, setTipo] = useState('');

    // MODAL
    const [modalAberto, setModalAberto] = useState(false);
    const [motivo, setMotivo] = useState("");
    const [senha, setSenha] = useState("");
    const [idUsuario, setIdUsuario] = useState(0);
    const [statusUsuario, setStatusUsuario] = useState(false);

    // LOADING
    const [carregando, setCarregando] = useState(false);

    const openModal = (id, status) => {
        setIdUsuario(id)
        setStatusUsuario(status)

        setModalAberto(prev => {
            document.body.style.overflow = !prev ? "hidden" : "auto";
            return !prev;
        })
    };

    const handleConfirm = (e) => {
        e.preventDefault();

        statusUser(idUsuario, statusUsuario)

        document.body.style.overflow = "auto";
        setModalAberto(false);

        setMotivo("");
        setSenha("");
    };

    // URL
    const URL = process.env.NEXT_PUBLIC_API_URL;

    // TOKEN
    const token = Cookies.get('token');

    const id = ''

    // LISTAGEM DE USUARIOS
    const { usuarios, loadingUsuarios, refreshUsuarios } = useListarUsuarios(id, nome, status, tipo);

    // EXPANDIR CARD
    const [activeUser, setActiveUser] = useState(null);
    const toggleUser = (id) => {
        setActiveUser(activeUser === id ? null : id);
    };

    // ALTERAR STATUS DO USUARIO
    const statusUser = async (id, status) => {
        try {
            setCarregando(true);

            const res = await fetch(`${URL}/users/status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: !status,
                    mensagemBloqueio: motivo,
                    senha: senha
                })
            })

            if (!res.ok) {
                toast.error('Senha incorreta');
            } else {
                toast.success('Sucesso ao alterar status do usuario');
            };
        } catch (err) {
            console.log(err);
        } finally {
            await refreshUsuarios();
            setCarregando(false);
        };
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">
            <div className="">
                {/* CABEÇALHO */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-orange-500">Painel de Usuários</h1>
                    <p className="text-gray-600">Clique em um usuário para ver detalhes</p>
                </div>

                {/* LOADING */}
                <Loading carregandoListar={loadingUsuarios} carregandoGeral={carregando} />

                {/* TOASTER */}
                <ToastProvider />

                {/* MODAL */}
                {modalAberto && (
                    <div className="fixed inset-0 flex items-center justify-center text-black bg-black/40 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                            <h2 className="text-xl font-semibold mb-4">{statusUsuario ? 'Desativar' : 'Ativar'} Conta</h2>
                            <form onSubmit={handleConfirm} className="flex flex-col space-y-4">
                                {statusUsuario ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                                        <textarea
                                            value={motivo}
                                            onChange={(e) => setMotivo(e.target.value)}
                                            placeholder="Explique o motivo da desativação"
                                            className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                    <input
                                        type="password"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder="Digite sua senha"
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => openModal()}
                                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ESTATÍSTICAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">

                    {/* TOTAL USUÁRIOS */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-700">Total de Usuários</h2>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaUser className="text-blue-600 text-xl" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-blue-600 mb-2">{usuarios.length}</p>
                        <p className="text-sm text-gray-500">Total de usuários no sistema</p>
                    </div>

                    {/* USUÁRIOS ATIVOS */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-700">Usuários Ativos</h2>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaUserCheck className="text-green-600 text-2xl" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-green-600 mb-2">{usuarios.filter(user => user.status === true).length}</p>
                        <p className="text-sm text-gray-500">Total de usuários ativos</p>
                    </div>

                    {/* ADMINISTRADORES */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-700">Total de Administradores</h2>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FaUserShield className="text-purple-600 text-2xl" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-purple-600 mb-2">{usuarios.filter(user => user.role === 'ADMIN').length}</p>
                        <p className="text-sm text-gray-500">Total de administradores</p>
                    </div>

                    {/* USUÁRIOS INATIVOS */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-700">Usuários Inativos</h2>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <FaUserTimes className="text-red-600 text-2xl" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-red-600 mb-2">{usuarios.filter(user => user.status === false).length}</p>
                        <p className="text-sm text-gray-500">Total de usuários inativos</p>
                    </div>
                </div>

                {/* FLTROS E BUSCA */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 text-black">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className='flex flex-row gap-4 w-full md:w-auto'>
                            <div className='w-full md:w-auto'>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-3 py-2 w-full md:w-auto border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 cursor-pointer"
                                >
                                    <option value={''}>Todos os status</option>
                                    <option value={true}>Ativo</option>
                                    <option value={false}>Inativo</option>
                                </select>
                            </div>

                            <div className="flex flex-wrap gap-2 w-full md:w-auto" >
                                <select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    className="px-3 py-2 w-full md:w-auto border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 cursor-pointer"
                                >
                                    <option value={''}>Todos os tipos</option>
                                    <option value={'ADMIN'}>Administrador</option>
                                    <option value={'USER'}>Usuário</option>
                                </select>
                            </div>
                        </div>

                        <div className="relative flex-1 w-full">
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="peer w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-orange-500" />
                        </div>

                    </div>
                </div>

                {/* LISTA DE USUÁRIOS */}
                <div className="space-y-4">
                    {usuarios.map((usuario) => {

                        // PEGAR INICIAIS DO USUARIO
                        const nomes = usuario.nome.split(' ');
                        const primeiroNome = nomes[0];
                        const ultimoNome = nomes.length > 1 ? nomes[nomes.length - 1] : primeiroNome;
                        const iniciais = `${primeiroNome[0]}${ultimoNome[0]}`.toUpperCase();

                        return (
                            <div
                                key={usuario.id}
                                className={`bg-white shadow rounded-lg p-4 transition-all duration-300 cursor-pointer ${activeUser === usuario.id ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => toggleUser(usuario.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-800 font-bold">
                                                {iniciais}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm text-black">{usuario.nome}</h3>
                                            <p className="text-gray-600 text-xs">{usuario.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 gap-2">
                                        <div className='flex flex-col md:flex-row gap-2 items-center'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${usuario.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {usuario.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${usuario.ativo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {usuario.status ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                        <IoIosArrowDown
                                            className={`w-5 h-5 text-gray-400 transition-transform ${activeUser === usuario.id ? 'transform rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* DETALHES DO USUÁRIO (EXPANDÍVEL) */}
                                <div className={`overflow-hidden transition-all duration-500 ${activeUser === usuario.id ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                                    <div className="border-t pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">RA</h4>
                                                <p className="text-gray-800">{usuario.RA}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                                                <p className="text-gray-800">{usuario.telefone}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Data de Criação</h4>
                                                <p className="text-gray-800">{new Date(usuario.createdAt).toLocaleDateString('pt-BR')}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Último Acesso</h4>
                                                <p className="text-gray-800">{usuario.ultimoAcesso}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex space-x-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal(usuario.id, usuario.status)
                                                }}
                                                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${usuario.status
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}>
                                                {usuario.status ? 'Desativar' : 'Ativar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
}