'use client'

// HOOKS
import { useToken } from "@/app/hooks/auth/verificaRole";
import { useRouter } from "next/navigation";
import { useState } from "react";

// COOKIES
import Cookies from 'js-cookie';

// ICONES
import { GoBell } from "react-icons/go";
import { FiLogOut, FiShoppingBag, FiUser, FiSettings, FiHelpCircle } from "react-icons/fi";
import { IoIceCreamOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { MdKeyboardArrowRight, MdOutlineSpaceDashboard } from "react-icons/md";
import { useListarUsuarios } from "@/app/hooks/usuario/listarUsuario";

// COMPONENTES
import { Loading } from "@/app/components/loading/loading";

// ===== COMPONENTE DE ITEM DO MENU =====
function MenuItem({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  colorClass = "orange",
  badge = null,
  isLogout = false 
}) {
  const colorClasses = {
    orange: "from-orange-100 to-orange-200 text-orange-600 hover:from-orange-200 hover:to-orange-300",
    blue: "from-blue-100 to-blue-200 text-blue-600 hover:from-blue-200 hover:to-blue-300",
    yellow: "from-yellow-100 to-yellow-200 text-yellow-600 hover:from-yellow-200 hover:to-yellow-300",
    green: "from-green-100 to-green-200 text-green-600 hover:from-green-200 hover:to-green-300",
    purple: "from-purple-100 to-purple-200 text-purple-600 hover:from-purple-200 hover:to-purple-300",
    indigo: "from-indigo-100 to-indigo-200 text-indigo-600 hover:from-indigo-200 hover:to-indigo-300",
    red: "from-red-100 to-red-200 text-red-600 hover:from-red-200 hover:to-red-300"
  };

  const hoverBgClass = isLogout 
    ? "hover:bg-red-50 active:bg-red-100" 
    : "hover:bg-gray-50 active:bg-gray-100";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-5 border-b border-gray-100 transition-all duration-200 group ${hoverBgClass}`}
      aria-label={title}
    >
      {/* ÍCONE COM FUNDO GRADIENTE */}
      <div className={`bg-gradient-to-r ${colorClasses[colorClass]} p-3 rounded-xl mr-4 shadow-sm transition-all duration-200 group-hover:shadow-md flex-shrink-0`}>
        <Icon className="h-6 w-6" />
      </div>

      {/* INFORMAÇÕES DO ITEM */}
      <div className="flex-1 text-left">
        <p className={`font-semibold ${isLogout ? 'text-red-600 group-hover:text-red-700' : 'text-gray-800'}`}>
          {title}
        </p>
        <p className={`text-sm ${isLogout ? 'text-red-400 group-hover:text-red-500' : 'text-gray-500'} mt-1`}>
          {description}
        </p>
      </div>

      {/* BADGE (OPCIONAL) */}
      {badge && (
        <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ml-2 flex-shrink-0">
          {badge}
        </div>
      )}

      {/* SETA */}
      <MdKeyboardArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
    </button>
  );
}

// ===== COMPONENTE DE SEÇÃO DO MENU =====
function MenuSection({ title, children }) {
  return (
    <div className="mb-6">
      {title && (
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-6 mb-3">
          {title}
        </p>
      )}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ===== COMPONENTE DE CABEÇALHO DE PERFIL =====
function ProfileHeader({ usuario, nome, loading }) {
  return (
    <section className="w-full px-6 pt-8 pb-6">
      <div className="flex flex-col items-center gap-5">
        {/* AVATAR */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-lg opacity-20"></div>
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-50">
            <div
              className="w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: `url(${usuario?.imagem_url || '/imagens/sem-foto.jpg'})`
              }}
              role="img"
              aria-label="Avatar do usuário"
            />
          </div>
          {/* INDICADOR DE STATUS */}
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
        </div>

        {/* INFORMAÇÕES DO USUÁRIO */}
        <div className="flex flex-col items-center gap-2">
          {loading ? (
            <>
              <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                {usuario ? nome : 'Usuário'}
              </h1>
              <p className="text-gray-600 text-sm text-center">
                {usuario?.email || 'email@exemplo.com'}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ===== COMPONENTE PRINCIPAL =====
export default function Mais() {
  // TOKEN DECODIFICADO
  const token_decodificado = useToken();
  const id_usuario = token_decodificado?.id;

  // LISTAGEM
  const { usuarios, loadingUsuarios } = useListarUsuarios(id_usuario);
  const usuario = usuarios[0];
  
  // PROCESSAMENTO DE NOME
  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Usuário';
  const ultimoNome = usuario?.nome?.split(' ')[1] || '';
  const nome = ultimoNome ? `${primeiroNome} ${ultimoNome}` : primeiroNome;

  // NAVEGAÇÃO
  const router = useRouter();

  // ESTADO LOCAL
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // FUNÇÕES
  const handleLogout = () => {
    setIsLoggingOut(true);
    Cookies.remove('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pb-8">
      {/* CABEÇALHO DE PERFIL */}
      <ProfileHeader usuario={usuario} nome={nome} loading={loadingUsuarios} />

      {/* LOADING */}
      <Loading carregandoListar={loadingUsuarios} />

      {/* CONTEÚDO DO MENU */}
      <section className="px-6">
        {/* SEÇÃO: PAINEL ADMINISTRATIVO (SE FOR ADMIN) */}
        {usuario?.role === 'ADMIN' && (
          <MenuSection title="Administração">
            <MenuItem
              icon={MdOutlineSpaceDashboard}
              title="Painel Administrativo"
              description="Gerencie o sistema e dados"
              colorClass="orange"
              onClick={() => router.push('/painel/inicio')}
            />
          </MenuSection>
        )}

        {/* SEÇÃO: CONTA */}
        <MenuSection title="Sua Conta">
          <MenuItem
            icon={FiUser}
            title="Minha Conta"
            description="Gerencie suas informações pessoais"
            colorClass="blue"
            onClick={() => router.push('mais/perfil')}
          />
          <div className="border-b border-gray-100"></div>
          <MenuItem
            icon={FiSettings}
            title="Configurações"
            description="Preferências e privacidade"
            colorClass="indigo"
            onClick={() => router.push('mais/configuracoes')}
          />
        </MenuSection>

        {/* SEÇÃO: COMPRAS E NOTIFICAÇÕES */}
        <MenuSection title="Compras">
          <MenuItem
            icon={IoIceCreamOutline}
            title="Cardápio"
            description="Veja nossos produtos"
            colorClass="green"
            onClick={() => router.push('/usuario/cardapio')}
          />
          <div className="border-b border-gray-100"></div>
          <MenuItem
            icon={FiShoppingCart}
            title="Carrinho"
            description="Seus itens selecionados"
            colorClass="purple"
            badge={null}
            onClick={() => router.push('/usuario/carrinho')}
          />
          <div className="border-b border-gray-100"></div>
          <MenuItem
            icon={FiShoppingBag}
            title="Minhas Compras"
            description="Histórico de pedidos"
            colorClass="indigo"
            onClick={() => router.push('mais/compras')}
          />
        </MenuSection>

        {/* SEÇÃO: NOTIFICAÇÕES E SUPORTE */}
        <MenuSection title="Notificações">
          <MenuItem
            icon={GoBell}
            title="Notificações"
            description="Seus alertas e avisos"
            colorClass="yellow"
            badge={null}
            onClick={() => router.push('mais/notificacoes')}
          />
          <div className="border-b border-gray-100"></div>
          <MenuItem
            icon={FiHelpCircle}
            title="Ajuda e Suporte"
            description="Dúvidas e sugestões"
            colorClass="blue"
            onClick={() => router.push('mais/suporte')}
          />
        </MenuSection>

        {/* SEÇÃO: SAIR */}
        <MenuSection>
          <MenuItem
            icon={FiLogOut}
            title="Sair da Conta"
            description="Encerrar sua sessão"
            colorClass="red"
            isLogout={true}
            onClick={handleLogout}
          />
        </MenuSection>

        {/* INFORMAÇÕES ADICIONAIS */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 font-medium">App v1.0.0</p>
          <p className="text-xs text-gray-400 mt-2">© 2026 - Todos os direitos reservados</p>
        </div>
      </section>
    </div>
  );
}
