'use client'

import { useEffect } from "react"

export function Loading({ carregandoListar, carregandoGeral }) {

  const carregando = carregandoListar || carregandoGeral

  useEffect(() => {
    document.body.style.overflow = carregando ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [carregando])

  if (!carregando) return null

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* spinner */}
      <div className="relative flex items-center justify-center">

        <span className="absolute w-20 h-20 rounded-full bg-orange-500/20 animate-ping"></span>

        <svg
          className="w-16 h-16 animate-spin"
          viewBox="0 0 50 50"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            stroke="orange"
            strokeLinecap="round"
            strokeDasharray="90 150"
            strokeDashoffset="0"
          />
        </svg>

      </div>

      {/* texto */}
      <p className="mt-6 text-white text-sm tracking-wide animate-pulse">
        Carregando...
      </p>

    </div>
  )
}