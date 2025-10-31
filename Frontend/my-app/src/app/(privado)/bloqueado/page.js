'use client'

// HOOKS
import { useToken } from "@/app/hooks/auth/verificaRole"
import { useRouter } from "next/navigation";

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { CiLock } from "react-icons/ci";

export default function Bloqueado() {
    const token = useToken();
    const router = useRouter();

    return (
        <main className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md w-full  overflow-hidden">
                <div className="p-8">

                    {/* ÍCONE DE BLOQUEIO */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <CiLock
                                className="w-12 h-12 text-red-600" />
                        </div>
                    </div>

                    {/* TÍTULO */}
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                        Acesso Bloqueado
                    </h1>

                    {/* MENSAGEM DE DESCRIÇÃO */}
                    <p className="text-gray-600 text-center mb-8">
                        Você não tem permissão para acessar esta página.
                    </p>

                    {/* CARD COM MOTIVO DE BLOQUEIO */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Motivo do bloqueio:</h2>
                        <p className="text-red-700">{token.mensagemBloqueio || "Acesso não autorizado."}</p>
                    </div>

                    {/* AÇÕES */}
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => {
                                Cookies.remove('token');
                                router.push('/');
                            }}
                            className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Voltar à Página Inicial
                        </button>

                        <button
                            onClick={() => {
                                Cookies.remove('token');
                                router.refresh();
                            }}
                            className="w-full border cursor-pointer border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Tentar Novamente
                        </button>
                    </div>

                    {/* INFORMAÇÃO ADICIONAL */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>Se você acredita que isto é um erro, entre em contato com o administrador do sistema.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}