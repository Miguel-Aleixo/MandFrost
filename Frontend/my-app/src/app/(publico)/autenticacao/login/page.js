'use client'

// HOOKS
import { useState } from "react"
import { useRouter } from "next/navigation";

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { CiLock } from "react-icons/ci";
import { MdOutlineBadge } from "react-icons/md";

export default function Login() {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const data = new Date;

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    const segundos = String(data.getSeconds()).padStart(2, "0");

    const ultimoAcesso = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;

    const [Form, setForm] = useState({
        RA: '',
        senha: '',
        ultimoAcesso: ultimoAcesso
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const logar = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Form)
            });

            if (!res.ok) {
                alert("Email ou senha incorretos");
                return;
            };

            const data = await res.json();

            Cookies.set('token', data.token, { expires: 1 });

            router.push('/painel/inicio');

        } catch (err) {
            console.log(err);
        };
    };

    return (
        <main className="min-h-screen bg-white flex items-center justify-center">
            <div className="max-w-md w-full">
                {/* CARD DE LOGIN */}
                <div className="bg-white md:rounded-2xl overflow-hidden md:p-0 p-8">
                    {/* CABEÇALHO */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-orange-400 mb-2">Acesse sua conta</h1>
                        <p className="text-gray-600">Informe suas credenciais para continuar</p>
                    </div>

                    {/* FORMULÁRIO */}
                    <form onSubmit={logar} className="space-y-3 text-black">
                        {/* RA */}
                        <div className="relative">
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
                        <div className="relative">
                            <div className="flex justify-end mb-2">
                                <a href="#" className="text-sm text-orange-600 hover:text-orange-500">
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    value={Form.senha}
                                    onChange={handleChange}
                                    className="peer block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Digite sua senha"
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
                            className="relative top-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
                        >
                            Entrar
                        </button>
                    </form>

                    {/* RODAPÉ */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{" "}
                            <button
                                onClick={() => router.push('/autenticacao/cadastro')}
                                className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                            >
                                Cadastre-se
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}