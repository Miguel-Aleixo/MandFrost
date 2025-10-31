import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ],
};

function pegarToken(token: string) {
    if (!token) return null;

    try {
        const base64Payload = token.split('.')[1];
        const jsonPayload = Buffer.from(base64Payload, 'base64').toString();
        const payload = JSON.parse(jsonPayload);

        return { role: payload.role, status: payload.status };
    } catch {
        return null;
    }

}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get('token')?.value;

    const dados = pegarToken(token);
    const role = dados?.role;
    const status = dados?.status;

    if (!dados && (pathname.startsWith('/usuario') || pathname.startsWith('/painel') || pathname.startsWith('/bloqueado'))) {
        return NextResponse.redirect(new URL('/autenticacao/login', req.url));
    }

    if (status === false && !pathname.startsWith('/bloqueado')) {
        return NextResponse.redirect(new URL('/bloqueado', req.url));
    }

    if (status === true && pathname.startsWith('/bloqueado')) {
        return NextResponse.redirect(new URL('/usuario/cardapio', req.url));
    }

    if (role && (pathname === '/' || pathname.startsWith('/autenticacao'))) {
        return NextResponse.redirect(new URL('/usuario/cardapio', req.url));
    }

    if (role !== 'ADMIN' && pathname.startsWith('/painel')) {
        return NextResponse.redirect(new URL('/usuario/cardapio', req.url));
    }

    return NextResponse.next();
}