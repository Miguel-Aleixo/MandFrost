'use client'

import { Menu } from "@/app/components/cardapio/menu";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function Layout({ children }) {
    const router = useRouter();
    return (
        <div>
            <main className="font-sans min-h-screen w-full flex flex-col bg-gray-100">

                <header className="fixed top-0 w-full bg-white z-50 border border-zinc-200 text-white flex items-center px-5 py-4">
                    <FaArrowLeft onClick={() => {
                        router.push('/usuario/mais')
                    }} className="h-6 w-6 ml-4 text-orange-400" />
                </header>

                <section className="mt-14 mb-20">
                    {children}
                </section>

                <Menu />
            </main>
        </div>
    );
}
