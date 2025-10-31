'use client'

import { GoBell, GoSearch } from "react-icons/go";

export function Buscar({ value, setValue }) {

  return (
    <section className="fixed top-0 left-0 w-full flex items-center bg-white shadow-sm border-b border-gray-100 px-4 py-3 z-50">
      <div className="flex items-center w-full max-w-4xl mx-auto">
        {/* Logo/Title */}
        <div className="mr-4 flex-shrink-0">
          <h1 className="text-xl font-bold text-orange-500 hidden md:block">MandFrost</h1>
        </div>

        {/* Barra de busca */}
        <div className="flex-grow relative">
          <div className="relative flex items-center">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="peer w-full h-12 pl-11 pr-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="Busque a sua sobremesa..."
            />
            <GoSearch className="absolute left-4 text-gray-400 h-4 w-4 md:h-5 md:w-5 peer-focus:text-orange-500" />
          </div>
        </div>

        {/* Ícones de ação */}
        <div className="flex items-center space-x-3 ml-4">
          {/* Ícone de notificações */}
          <button className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
            <GoBell className="relative right-[2px] h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}