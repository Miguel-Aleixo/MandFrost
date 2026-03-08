'use client'

// HOOKS
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IMaskInput } from 'react-imask';

// ICONES
import { CiUser, CiMail, CiPhone, CiLock } from "react-icons/ci";
import { MdOutlineBadge } from "react-icons/md";

// COOKIES
import Cookies from 'js-cookie';

// COMPONENTES
import { ToastProvider } from "@/app/components/loading/toaster";
import { Loading } from "@/app/components/loading/loading";

// TOAST
import toast from "react-hot-toast";

export default function Cadastro() {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // FEEDBACK
    const [loading, setLoading] = useState(false);

    const [Form, setForm] = useState({
        nome: '',
        email: '',
        telefone: '',
        RA: '',
        senha: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const cadastrar = async (e) => {
        e.preventDefault();

        setLoading(true);

        const formData = new FormData();

        formData.append("nome", Form.nome);
        formData.append("email", Form.email);
        formData.append("telefone", Form.telefone);
        formData.append("RA", Form.RA);
        formData.append("senha", Form.senha);

        try {

            const res = await fetch(`${URL}/users`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                toast.error("Erro ao criar a conta");
                return;
            };

            setForm({
                nome: '',
                email: '',
                telefone: '',
                RA: '',
                senha: ''
            });

            logar();

        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        };

    };

    const logar = async (e) => {

        setLoading(true);

        const credenciais = {
            RA: Form.RA,
            senha: Form.senha
        }

        try {
            const res = await fetch(`${URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credenciais)
            });

            if (!res.ok) {
                toast.error("Email ou senha incorretos");
                return;
            };

            const data = await res.json();

            Cookies.set('token', data.token, { expires: 1 });

            router.push('/painel/inicio');

        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false)
        };
    };

    return (
        <main className="min-h-screen bg-white flex items-center justify-center md:p-4">

            {/* LOADING */}
            <Loading carregandoGeral={loading} />

            {/* TOASTER */}
            <ToastProvider />

            <div className="max-w-md w-full">
                {/* CARD DE CADASTRO */}
                <div className="bg-white md:rounded-2xl overflow-hidden md:p-0 p-8">
                    {/* CABEÇALHO */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-orange-400 mb-2">Crie sua conta</h1>
                        <p className="text-gray-600">Preencha os dados abaixo para se cadastrar</p>
                    </div>

                    {/* FORMULÁRIO */}
                    <form onSubmit={cadastrar} className="space-y-10 text-black">
                        {/* NOME */}
                        <div>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={Form.nome}
                                    onChange={handleChange}
                                    className="peer block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                    placeholder="Seu nome completo"
                                    required
                                />
                                <label htmlFor="nome" className="absolute bottom-[41px] left-4 z-10 bg-white px-2 text-sm text-gray-700 peer-focus:text-orange-500 transition-all duration-300">
                                    Nome Completo
                                </label>
                                <CiUser className="absolute left-3 h-5 w-5 text-gray-400 peer-focus:text-orange-500 transition-colors" />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <div className="relative flex items-center">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={Form.email}
                                    onChange={handleChange}
                                    className="peer block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="seu.email@exemplo.com"
                                    required
                                />
                                <label htmlFor="email" className="absolute bottom-[41px] left-4 z-10 bg-white px-2 text-sm text-gray-700 peer-focus:text-orange-500 transition-all duration-300">
                                    E-mail
                                </label>
                                <CiMail className="absolute left-3 h-5 w-5 text-gray-400 peer-focus:text-orange-500 transition-colors" />
                            </div>
                        </div>

                        {/* TELEFONE */}
                        <div>
                            <div className="relative flex items-center">
                                <IMaskInput
                                    type="tel"
                                    id="telefone"
                                    mask='(00) 00000-0000'
                                    name="telefone"
                                    value={Form.telefone}
                                    onAccept={(value) => setForm(prev => ({ ...prev, telefone: value }))}
                                    className="peer block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="(00) 00000-0000"
                                    required
                                />
                                <label htmlFor="telefone" className="absolute bottom-[41px] left-4 z-10 bg-white px-2 text-sm text-gray-700 peer-focus:text-orange-500 transition-all duration-300">
                                    Telefone
                                </label>
                                <CiPhone className="absolute left-3 h-5 w-5 text-gray-400 peer-focus:text-orange-500 transition-colors" />
                            </div>
                        </div>

                        {/* RA */}
                        <div>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    id="RA"
                                    name="RA"
                                    value={Form.RA}
                                    onChange={handleChange}
                                    className="peer block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Digite seu RA"
                                    required
                                />
                                <label htmlFor="RA" className="absolute bottom-[41px] left-4 z-10 bg-white px-2 text-sm text-gray-700 peer-focus:text-orange-500 transition-all duration-300">
                                    RA (Registro Acadêmico)
                                </label>
                                <MdOutlineBadge className="absolute left-3 h-5 w-5 text-gray-400 peer-focus:text-orange-500 transition-colors" />
                            </div>
                        </div>

                        {/* SENHA */}
                        <div>
                            <div className="relative flex items-center">
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    value={Form.senha}
                                    onChange={handleChange}
                                    className="peer block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Crie uma senha segura"
                                    required
                                />
                                <label htmlFor="senha" className="absolute bottom-[41px] left-4 z-10 bg-white px-2 text-sm text-gray-700 peer-focus:text-orange-500 transition-all duration-300">
                                    Senha
                                </label>
                                <CiLock className="absolute left-3 h-5 w-5 text-gray-400 peer-focus:text-orange-500 transition-colors" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="relative bottom-3 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
                        >
                            Cadastrar
                        </button>
                    </form>

                    {/* RODAPÉ */}
                    <div className="mt-3 text-center">
                        <p className="text-sm text-gray-600">
                            Já tem uma conta?{" "}
                            <button
                                onClick={() => router.push('/autenticacao/login')}
                                className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                            >
                                Faça login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}