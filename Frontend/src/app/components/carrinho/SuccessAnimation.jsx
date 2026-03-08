'use client'

import { useEffect } from "react"

export default function SuccessAnimation({ open, onFinish }) {

    useEffect(() => {
        if (!open) return

        const timer = setTimeout(() => {
            onFinish?.()
        }, 2800)

        return () => clearTimeout(timer)

    }, [open, onFinish])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">

            {/* backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"/>

            <div className="relative flex flex-col items-center gap-6">

                {/* círculo */}
                <div className="success-circle">

                    <svg viewBox="0 0 52 52" className="success-check">
                        <circle
                            cx="26"
                            cy="26"
                            r="24"
                            fill="none"
                            className="circle"
                        />

                        <path
                            fill="none"
                            d="M14 27 L22 35 L38 18"
                            className="check"
                        />
                    </svg>

                </div>

                <div className="text-center animate-text">
                    <h2 className="text-3xl font-bold text-white">
                        Pedido concluído
                    </h2>

                    <p className="text-zinc-300">
                        Seu pedido foi enviado com sucesso
                    </p>
                </div>

            </div>

        </div>
    )
}