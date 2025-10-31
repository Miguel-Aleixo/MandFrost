'use client'

import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export function useListarCategorias(nome = '') {
    const [categorias, setCategorias] = useState([]);
    const [loadingCategorias, setLoadingCategorias] = useState(true);
    const token = Cookies.get('token');
    const URL = process.env.NEXT_PUBLIC_API_URL;

    const listarCategorias = async () => {
        try {
            setLoadingCategorias(true);
            const res = await fetch(`${URL}/tipo-produto/filtro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome: nome,
                })
            });

            if (!res.ok) {
                throw new Error(`Erro ao buscar categorias: ${res.status}`);
            }

            const data = await res.json();
            setCategorias(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCategorias(false)
        }
    };

    useEffect(() => {
        listarCategorias()
    }, [nome])

    const refreshCategorias = () => {
        listarCategorias();
    };

    return { categorias, loadingCategorias, refreshCategorias };
}