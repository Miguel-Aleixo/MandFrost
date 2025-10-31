'use client'

// HOOKS 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToken } from "@/app/hooks/auth/verificaRole";
import { useListarUsuarios } from "@/app/hooks/usuario/listarUsuario";

// COMPONENENTES
import { IMaskInput } from 'react-imask';
import { ToastProvider } from "@/app/components/loading/toaster";
import toast from "react-hot-toast";

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEdit, FiSave, FiX, FiUpload } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { Loading } from "@/app/components/loading/loading";

export default function MinhaConta() {
    // FORMULARIO
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = Cookies.get('token');

    // NAVEGAÇÃO
    const router = useRouter();

    // TOKEN DECODIFICADO
    const token_decodificado = useToken();

    // FILTRAGEM
    const id_usuario = token_decodificado?.id

    // LISTAGEM 
    const { usuarios, loadingUsuarios, refreshUsuarios } = useListarUsuarios(id_usuario);
    const usuario = usuarios[0];

    // DATA CRIAÇÃO
    const dataCriacao = usuario?.createdAt ? new Date(usuario.createdAt) : null;

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const mes = dataCriacao ? meses[dataCriacao.getMonth()] : "";
    const ano = dataCriacao ? dataCriacao.getFullYear() : "";

    // MODAL 
    const [modal, setModal] = useState(false);

    // DADOS
    const [Form, setForm] = useState({});
    const [FormSenha, setFormSenha] = useState({
        senhaAtual: "",
        senhaNova: "",
        confirmarSenha: ""
    });
    const [Imagem, setImagem] = useState('')

    // LOADING
    const [carregando, setCarregando] = useState(false)

    // EDITAR PERFIL
    const [editando, setEditando] = useState(false);
    const handleSave = async (e, file) => {
        if (e) e.preventDefault();

        if (modal) {
            if (FormSenha.senhaNova === FormSenha.senhaAtual) return alert('A senha nova é igual a senha atual!')
            if (FormSenha.senhaNova !== FormSenha.confirmarSenha) return alert('Confimar senha não é igual a senha nova!')
        }

        setCarregando(true);

        const formData = new FormData();

        formData.append("nome", Form.nome ?? usuario.nome);
        formData.append("email", Form.email ?? usuario.email);
        formData.append("telefone", Form.telefone ?? usuario.telefone);
        formData.append("senha", FormSenha.senhaAtual);
        formData.append("senhaNova", FormSenha.senhaNova);

        if (file || Imagem) {
            formData.append("imagem", file || Imagem);
        };

        try {
            const res = await fetch(`${API_URL}/users/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (modal) {
                if (!res.ok) {
                    toast.error('Senha incorreta');
                    return;
                } else {
                    toast.success('Senha alterada com sucesso');
                };
            } else if (Imagem) {
                if (!res.ok) {
                    toast.error('Erro ao mudar foto');
                    return;
                } else {
                    toast.success('Foto alterada com sucesso');
                };
            } else {
                if (!res.ok) {
                    toast.error('Erro ao editar o perfil');
                    return;
                } else {
                    toast.success('Sucesso ao editar o perfil');
                };
            };
        } catch (err) {
            console.log(err);
        } finally {
            if (modal) {
                setModal(false);
                setFormSenha({
                    senhaAtual: '',
                    senhaNova: '',
                    confirmarSenha: ''
                });
            } else if (Imagem) {
                setImagem('');
            }
            setEditando(false);
            await refreshUsuarios();
            setCarregando(false);
        };
    };

    const handleInputChange = (field, value) => {
        if (modal) {
            setFormSenha(prev => ({
                ...prev,
                [field]: value
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-8">

            {/* CABEÇALHO */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold text-gray-800">Minha Conta</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* LOADING */}
            <Loading carregandoListar={loadingUsuarios} carregandoGeral={carregando} />

            {/* TOASTER */}
            <ToastProvider />

            {/* MODAL */}
            {modal === true && (
                <div className="fixed inset-0 flex items-center justify-center text-black bg-black/40 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-semibold mb-4">Mudar senha</h2>
                        <form onSubmit={handleSave} className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Senha atual</label>
                                <input
                                    type="password"
                                    value={FormSenha.senhaAtual}
                                    onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
                                    placeholder="Digite sua senha"
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Senha nova</label>
                                <input
                                    type="password"
                                    value={FormSenha.senhaNova}
                                    onChange={(e) => handleInputChange('senhaNova', e.target.value)}
                                    placeholder="Digite sua senha"
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
                                <input
                                    type="password"
                                    value={FormSenha.confirmarSenha}
                                    onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                                    placeholder="Digite sua senha"
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(false);
                                        setFormSenha({
                                            senhaAtual: '',
                                            senhaNova: '',
                                            confirmarSenha: ''
                                        });
                                    }}
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

            {/* CONTEÚDO */}
            <main className="container mx-auto px-4 py-6">

                {/* CARD DE PERFIL */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="relative">

                        {/* BANNER */}
                        <div className="h-20 "></div>

                        {/* FOTO DE PERFIL */}
                        <div className="absolute -bottom-12 left-6">
                            <div className="relative">
                                <div className="bg-gray-50 rounded-full ">
                                    {usuario?.imagem_url ? (

                                        <div className="w-25 h-25 rounded-full relative bg-center bg-cover"
                                            style={{ backgroundImage: `url(${usuario?.imagem_url})` }}>
                                        </div>

                                    ) : (
                                        <div
                                            className="w-25 h-25 rounded-full relative bg-center bg-cover"
                                            style={{ backgroundImage: `url(/imagens/sem-foto.jpg)` }}>
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="imagem"
                                    className="absolute bottom-0 right-0 bg-orange-400 text-white p-2 rounded-full shadow-md hover:bg-orange-500 transition-colors">
                                    <FiUpload className="h-4 w-4" />
                                </label>
                                <input
                                    id="imagem"
                                    type="file"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setImagem(file);
                                            await handleSave(null, file);
                                        }
                                    }}
                                    className="hidden" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-6 px-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-gray-800">{usuario?.nome || 'Carregando...'}</h2>
                            {!editando && (
                                <button
                                    onClick={() => {
                                        setEditando(true);
                                        setForm({ ...usuario });
                                    }}
                                    className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <FiEdit className="h-4 w-4" />
                                    Editar
                                </button>
                            )}
                        </div>
                        <p className="text-gray-600">Membro desde {mes} {ano}</p>
                    </div>
                </div>

                {/* FORMULÁRIO DE INFORMAÇÕES */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800 text-lg">Informações Pessoais</h3>
                        <p className="text-gray-600 text-sm">Gerencie suas informações de conta</p>
                    </div>

                    <div className="p-5 space-y-4 text-black">

                        {/* NOME */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FiUser className="h-4 w-4 text-gray-500" />
                                Nome Completo
                            </label>
                            {editando ? (
                                <input
                                    type="text"
                                    value={Form.nome}
                                    onChange={(e) => handleInputChange('nome', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duaration-200"
                                />
                            ) : (
                                <p className="text-gray-800">{usuario?.nome || 'Carregando...'}</p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FiMail className="h-4 w-4 text-gray-500" />
                                E-mail
                            </label>
                            {editando ? (
                                <input
                                    type="email"
                                    value={Form.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duaration-200"
                                />
                            ) : (
                                <p className="text-gray-800">{usuario?.email || 'Carregando...'}</p>
                            )}
                        </div>

                        {/* TELEFONE */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FiPhone className="h-4 w-4 text-gray-500" />
                                Telefone
                            </label>
                            {editando ? (
                                <IMaskInput
                                    type="tel"
                                    mask='(00) 00000-0000'
                                    value={Form.telefone}
                                    onAccept={(e) => setForm(prev => ({ ...prev, telefone: e }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duaration-200"
                                />
                            ) : (
                                <p className="text-gray-800">{usuario?.telefone || 'Carregando...'}</p>
                            )}
                        </div>

                        {/* BOTÕES DE AÇÃO */}
                        {editando && (
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setEditando(false);
                                    }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiX className="h-4 w-4" />
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiSave className="h-4 w-4" />
                                    Salvar Alterações
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* OPÇÕES ADICIONAIS */}
                <div className="mt-6 space-y-4">

                    {/* ALTERAR SENHA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">Segurança</h3>
                        </div>
                        <div className="p-5">
                            <button
                                onClick={() => setModal(true)}
                                className="w-full flex items-center justify-between p-4 pl-0 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <FiLock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-800">Alterar Senha</p>
                                        <p className="text-sm text-gray-600">Atualize sua senha de acesso</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* PREFERÊNCIAS */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">Preferências</h3>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-800">Notificações por e-mail</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-800">Notificações por push</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}