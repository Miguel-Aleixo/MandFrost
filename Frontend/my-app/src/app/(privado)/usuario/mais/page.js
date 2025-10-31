'use client'

// HOOKS
import { useToken } from "@/app/hooks/auth/verificaRole";
import { useRouter } from "next/navigation";

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { GoBell } from "react-icons/go";
import { FiLogOut, FiShoppingBag, FiUser } from "react-icons/fi";
import { IoIceCreamOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { MdKeyboardArrowRight, MdOutlineSpaceDashboard } from "react-icons/md";
import { useListarUsuarios } from "@/app/hooks/usuario/listarUsuario";

// COMPONENTES
import { Loading } from "@/app/components/loading/loading";

export default function Mais() {
    // TOKEN DECODIFICADO
    const token_decodificado = useToken();

    const id_usuario = token_decodificado?.id

    // LISTAGEM
    const { usuarios, loadingUsuarios, refreshUsuarios } = useListarUsuarios(id_usuario);
    const usuario = usuarios[0]
    const primeiroNome = usuario?.nome.split(' ')[0];
    const ultimoNome = usuario?.nome.split(' ')[1];
    const nome = `${primeiroNome} ${ultimoNome}`

    // NAVEGAÇÃO
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-8">
            {/* CABEÇALHO PERFIL */}
            <section className="w-full p-6 pt-8">
                <div className="flex flex-col w-full justify-center items-center gap-4">
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
                    <div className="flex flex-col w-full justify-center items-center min-w-0">
                        <p className="text-2xl font-bold text-black ">{usuario ? nome : 'Carregando...'}</p>
                        <p className="text-gray-500 text-sm">{usuario?.email ? usuario?.email : 'Carregando...'}</p>
                    </div>
                </div>
            </section>

            {/* LOADING */}
            <Loading carregandoListar={loadingUsuarios} />

            {/* MENU DE OPÇÕES */}
            <section className="px-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {usuario?.role === 'ADMIN' && (
                        <div
                            onClick={() => router.push('/painel/inicio')}
                            className="flex items-center p-5 border-b border-gray-100 hover:bg-orange-50 active:bg-orange-100 transition-colors duration-150 cursor-pointer"
                        >
                            <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-3 rounded-xl mr-4 shadow-sm">
                                <MdOutlineSpaceDashboard className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">Painel Administrativo</p>
                                <p className="text-sm text-gray-500 mt-1">Gerencie o sistema</p>
                            </div>
                            <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        </div>
                    )}

                    <div
                        onClick={() => router.push('mais/perfil')}
                        className="flex items-center p-5 border-b border-gray-100 hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150 cursor-pointer">
                        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-xl mr-4 shadow-sm">
                            <FiUser className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">Minha conta</p>
                            <p className="text-sm text-gray-500 mt-1">Gerencie suas informações</p>
                        </div>
                        <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    </div>

                    <div className="flex items-center p-5 border-b border-gray-100 hover:bg-yellow-50 active:bg-yellow-100 transition-colors duration-150 cursor-pointer">
                        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-xl mr-4 shadow-sm">
                            <GoBell className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">Notificações</p>
                            <p className="text-sm text-gray-500 mt-1">Suas alertas e avisos</p>
                        </div>
                        <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    </div>

                    <div
                        onClick={() => router.push('/usuario/cardapio')}
                        className="flex items-center p-5 border-b border-gray-100 hover:bg-green-50 active:bg-green-100 transition-colors duration-150 cursor-pointer"
                    >
                        <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-xl mr-4 shadow-sm">
                            <IoIceCreamOutline className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">Cardápio</p>
                            <p className="text-sm text-gray-500 mt-1">Veja nossos produtos</p>
                        </div>
                        <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    </div>

                    <div
                        onClick={() => router.push('/usuario/carrinho')}
                        className="flex items-center p-5 border-b border-gray-100 hover:bg-purple-50 active:bg-purple-100 transition-colors duration-150 cursor-pointer"
                    >
                        <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl mr-4 shadow-sm">
                            <FiShoppingCart className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">Carrinho</p>
                            <p className="text-sm text-gray-500 mt-1">Seus itens selecionados</p>
                        </div>
                        <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    </div>

                    <div className="flex items-center p-5 border-b border-gray-100 hover:bg-indigo-50 active:bg-indigo-100 transition-colors duration-150 cursor-pointer">
                        <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 p-3 rounded-xl mr-4 shadow-sm">
                            <FiShoppingBag className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">Minhas compras</p>
                            <p className="text-sm text-gray-500 mt-1">Histórico de pedidos</p>
                        </div>
                        <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    </div>

                    {/* BOTÃO DE SAIR */}
                    <div
                        onClick={() => {
                            Cookies.remove('token');
                            router.push('/');
                        }}
                        className="flex items-center p-5">
                        <div className="bg-gradient-to-r from-red-100 to-red-200 p-3 rounded-xl mr-4 group-hover:from-red-200 group-hover:to-red-300 transition-colors duration-200 shadow-sm">
                            <FiLogOut className="h-6 w-6 text-red-600 group-hover:text-red-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-red-600 group-hover:text-red-700">Sair da conta</p>
                            <p className="text-sm text-red-400 group-hover:text-red-500">Encerrar sua sessão</p>
                        </div>
                        <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    </div>
                </div>


                {/* INFORMAÇÕES ADICIONAIS */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 mb-2">App v1.0.0</p>
                </div>
            </section>
        </div>
    )
}