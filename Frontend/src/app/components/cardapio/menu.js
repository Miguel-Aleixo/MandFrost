'use client'

// HOOKS
import { usePathname, useRouter } from "next/navigation";

// ICONES
import { IoIceCreamOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { CiHome, CiUser } from "react-icons/ci";
import { IoCubeOutline } from "react-icons/io5";
import { BsTags } from "react-icons/bs";

export function Menu() {
    const router = useRouter();
    const pathname = usePathname();

    const menuIndex = pathname === '/usuario/cardapio' ? 0 : pathname === '/usuario/carrinho' ? 1 : 2;
    const menuIndexPainel = pathname === '/painel/inicio' ? 0 : pathname === '/painel/usuarios' ? 1 : pathname === '/painel/produtos' ? 2 : 3;

    return (
        <>
            {
                pathname.startsWith('/painel') ? (
                    <section className="fixed bottom-0 left-0 w-full bg-white flex justify-between text-zinc-400 items-center border border-zinc-200 p-1">
                        <div className="h-[1px] bg-orange-500 w-1/3 absolute top-0 transition justify-end transition-all duration-200" style={{ left: `${(menuIndexPainel) * 25}%`, width: "25%" }}></div>
                        <div onClick={() => router.push('inicio')} className={`flex flex-col gap-1 items-center p-2 w-full transition ${pathname === '/painel/inicio' ? 'text-orange-500' : ''}`}>
                            <CiHome className="h-6 w-6" />
                            <p>Inicio</p>
                        </div>
                        <div onClick={() => router.push('usuarios')} className={`flex flex-col gap-1 items-center p-2 w-full transition ${pathname === '/painel/usuarios' ? 'text-orange-500' : ''}`}>
                            <CiUser className="h-6 w-6" />
                            <p>Usuarios</p>
                        </div>
                        <div onClick={() => router.push('produtos')} className={`flex flex-col gap-1 items-center p-2 w-full transition ${pathname === '/painel/produtos' ? 'text-orange-500' : ''}`}>
                            <IoCubeOutline className="h-6 w-6" />
                            <p>Produtos</p>
                        </div>
                        <div onClick={() => router.push('categorias')} className={`flex flex-col gap-1 items-center p-2 w-full transition ${pathname === '/painel/categorias' ? 'text-orange-500' : ''}`}>
                            <BsTags className="h-6 w-6" />
                            <p>Categorias</p>
                        </div>
                    </section>
                ) : (
                    <section className="fixed bottom-0 left-0 w-full bg-white flex justify-between text-zinc-400 items-center border border-zinc-200 p-1">
                        <div className="h-[1px] bg-orange-500 w-1/3 absolute top-0 transition justify-end transition-all duration-200" style={{ left: `${(menuIndex) * 33.33}%`, width: "33.33%" }}></div>
                        <div onClick={() => router.push('cardapio')} className={`flex flex-col gap-1 items-center p-2 w-full transition ${pathname === '/usuario/cardapio' ? 'text-orange-500' : ''}`}>
                            <IoIceCreamOutline className="h-5 w-5 md:h-6 md:w-6" />
                            <p>Cardápio</p>
                        </div>
                        <div onClick={() => router.push('carrinho')} className={`relative flex flex-col gap-1 items-center p-2 w-full transition ${pathname === '/usuario/carrinho' ? 'text-orange-500' : ''}`}>
                            <FiShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                            <p>Carrinho</p>
                        </div>
                        <div onClick={() => router.push('mais')} className={`flex flex-col gap-1 items-center p-2 w-full transition ${pathname === '/usuario/mais' ? 'text-orange-500' : ''}`}>
                            <FiMenu className="h-5 w-5 md:h-6 md:w-6" />
                            <p>Mais</p>
                        </div>
                    </section>
                )
            }
        </>
    )
}