'use client'

// HOOKS
import { usePathname } from "next/navigation";

// COMPONENTES
import { Menu } from "@/app/components/cardapio/menu";

export default function Layout({ children }) {
  // URL ATUAL
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-white">

      {pathname === '/usuario/mais/perfil' ? (
        <div>
          {children}
        </div>
      ) : (
        <div>
          <div className="pb-16">
            {children}
          </div>

          <Menu />
        </div>
      )}

    </main>
  );
}
