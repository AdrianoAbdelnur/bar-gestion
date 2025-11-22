"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface SlideOverProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export default function SlideOver({
  open,
  title,
  onClose,
  children,
  width = "w-[380px]",
}: SlideOverProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Fondo semi visible con blur suave */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-500"
        onClick={onClose}
      />

      {/* Panel deslizable */}
      <div
        className={`
          absolute right-0 top-0 h-full ${width}
          bg-neutral-900 border-l border-neutral-700
          shadow-xl p-6 flex flex-col
          transition-transform duration-500 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>

        
          <button
            onClick={onClose}
            className="
                absolute right-4 top-4
                text-neutral-500 hover:text-neutral-200
                transition-colors
                p-1 rounded-md
                bg-neutral-800/40 hover:bg-neutral-700/40
                outline-none focus:outline-none focus-visible:outline-none
            "
            >
            <X size={18}/>
        </button>
        </div>

        {/* CONTENIDO */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}