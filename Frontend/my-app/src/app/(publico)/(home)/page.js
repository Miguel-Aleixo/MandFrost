'use client'

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-white flex items-center justify-center md:p-4">
      <div className="max-w-md w-full">

        {/* Card de ações */}
        <div className="bg-white md:rounded-2xl overflow-hidden md:p-0 p-8">

          {/* Cabeçalho com logo e título */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-orange-500 mb-2">Bem-vindo</h1>
            <p className="text-gray-600">Entre ou cadastre-se para continuar</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/autenticacao/login')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Iniciar atendimento
            </button>

            <button
              onClick={() => router.push('/autenticacao/cadastro')}
              className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Não tenho um cadastro
            </button>
          </div>

          {/* Rodapé com informações adicionais */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Precisa de ajuda?{" "}
              <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                Contate nosso suporte
              </a>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}