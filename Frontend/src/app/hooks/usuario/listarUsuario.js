'use client'

import { useCallback, useEffect, useState } from "react";
import Cookies from 'js-cookie';

export function useListarUsuarios(id = 0, nome = '', status = '', tipo = '') {
    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);
    const token = Cookies.get('token');
    const URL = process.env.NEXT_PUBLIC_API_URL;

    const listarUsuarios = async () => {
        try {
            setLoadingUsuarios(true);
            const res = await fetch(`${URL}/users/filtro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: id,
                    nome: nome,
                    status: status,
                    tipo: tipo,
                })
            });

            if (!res.ok) {
                throw new Error(`Erro ao buscar usuários: ${res.status}`);
            }

            const data = await res.json();
            setUsuarios(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingUsuarios(false)
        }
    };

    useEffect(() => {
        listarUsuarios()
    }, [nome, status, tipo])

    const refreshUsuarios = () => {
        return listarUsuarios();
    };

    return { usuarios, loadingUsuarios, refreshUsuarios };
}