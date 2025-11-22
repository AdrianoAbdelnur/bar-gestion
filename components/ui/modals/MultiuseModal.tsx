"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  message?: string;
  children?: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
  width?: string;
}

export default function Modal({
  open,
  title,
  message,
  children,
  actions,
  onClose,
  width = "max-w-sm",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative bg-neutral-800 text-white rounded-xl shadow-2xl border border-neutral-700 p-6 w-full ${width}`}
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {message && <p className="text-neutral-300 mb-4">{message}</p>}
        {children}
        {actions && <div className="mt-6 flex justify-end gap-3">{actions}</div>}
      </div>
    </div>
  );
}