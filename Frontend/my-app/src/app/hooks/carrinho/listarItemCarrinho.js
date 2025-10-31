'use client'

import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useToken } from "../auth/verificaRole";

export function useListarItensCarrinho() {
    const [itensCarrinho, setItensCarrinho] = useState([]);
    const [loadingitensCarrinho, setLoadingitensCarrinho] = useState(true);
    const token = Cookies.get('token');
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const token_usuario = useToken();
    const id_usuario = token_usuario?.id;

    const listarItensCarrinho = async () => {
        try {
            setLoadingitensCarrinho(true);
            const res = await fetch(`${URL}/item-carrinho/${id_usuario}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!res.ok) {
                throw new Error(`Erro ao buscar itens do carrinho: ${res.status}`);
            }

            const data = await res.json();
            setItensCarrinho(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingitensCarrinho(false)
        }
    };

    useEffect(() => {
        listarItensCarrinho();
    }, []);
    
    const refreshitensCarrinho = () => {
        return listarItensCarrinho();
    };

    return { itensCarrinho, loadingitensCarrinho, refreshitensCarrinho };
}