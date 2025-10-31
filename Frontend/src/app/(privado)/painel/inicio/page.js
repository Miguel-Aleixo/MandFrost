'use client'

import { useListarCategorias } from "@/app/hooks/categoria/listarCategoria";
import { useListarProdutos } from "@/app/hooks/produto/listarProduto";
import { useListarUsuarios } from "@/app/hooks/usuario/listarUsuario";
import { FaTags } from "react-icons/fa6";
import { IoMdCube } from "react-icons/io";
import { FaUser, FaUserShield } from "react-icons/fa";
import { Loading } from "@/app/components/loading/loading";

export default function Painel() {
  // LISTAGEM
  const { usuarios, loadingUsuarios, refreshUsuarios } = useListarUsuarios();
  const { categorias, loadingCategorias, refreshCategorias } = useListarCategorias();
  const { produtos, loadingProdutos, refreshProdutos } = useListarProdutos();

  // LOADING
  const loading = loadingUsuarios && loadingCategorias && loadingProdutos 

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* CABEÇALHO */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-orange-500">Painel Administrativo</h1>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* LOADING */}
      <Loading carregandoListar={loading}  />

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        {/* USUARIOS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-700">Usuários</h2>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUser className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-2">{usuarios.length}</p>
          <p className="text-sm text-gray-500">Total de usuários cadastrados</p>
        </div>

        {/* PRODUTOS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-700">Produtos</h2>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IoMdCube className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">{produtos.length}</p>
          <p className="text-sm text-gray-500">Total de produtos no sistema</p>
        </div>

        {/* CATEGORIAS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-700">Categorias</h2>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaTags className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-2">{categorias.length}</p>
          <p className="text-sm text-gray-500">Total de categorias criadas</p>
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
      </div>

      {/* Seção de Últimas Ações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Últimas ações</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todas
          </button>
        </div>
      </div>

      {/* Gráficos ou Estatísticas Adicionais (placeholder) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Atividade recente</h3>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de atividade</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição por categoria</h3>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de distribuição</p>
          </div>
        </div>
      </div>
    </div>
  );
}