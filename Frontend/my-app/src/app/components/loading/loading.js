'use client'

import { useEffect } from "react";

export function Loading({ carregandoListar, carregandoGeral }) {
  const carregando = carregandoListar || carregandoGeral;

  useEffect(() => {
    document.body.style.overflow = carregando ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [carregando]);

  if (!carregando) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <svg
        className="w-15 h-15 animate-rotate"
        viewBox="25 25 50 50"
      >
        <circle
          className="animate-dash"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="3"
          stroke="orange"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
