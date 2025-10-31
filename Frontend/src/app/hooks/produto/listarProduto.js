'use client'

import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export function useListarProdutos(nome = '', categoria = '') {
    const [produtos, setProdutos] = useState([]);
    const [loadingProdutos, setLoadingProdutos] = useState(true);
    const token = Cookies.get('token');
    const URL = process.env.NEXT_PUBLIC_API_URL;

    const listarProdutos = async () => {
        try {
            setLoadingProdutos(true);
            const res = await fetch(`${URL}/produto/filtro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome: nome,
                    categoria: categoria
                })
            });

            if (!res.ok) {
                throw new Error(`Erro ao buscar produtos: ${res.status}`);
            }

            const data = await res.json();
            setProdutos(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingProdutos(false)
        }
    };

    useEffect(() => {
        listarProdutos()
    }, [nome, categoria])

    const refreshProdutos = () => {
        listarProdutos();
    };

    return { produtos, loadingProdutos, refreshProdutos };
}