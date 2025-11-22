"use client";

import Modal from "@/components/ui/modals/MultiuseModal";
import useModal from "@/hooks/useModal";
import { Category } from "@/types/Category";
import { Ingredient } from "@/types/Ingredients";
import { useState } from "react";

interface Props {
  parents: Category[];
  form: {
    editingId: string | null;
    name: string;
    setName: (v: string) => void;
    price: number;
    setPrice: (v: number) => void;
    unit: string;
    setUnit: (v: string) => void;
    parent: string | null;
    setParent: (v: string) => void;
    startEdit: (ing: Ingredient) => void;
    resetForm: () => void;
  };
  close: () => void;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function IngredientForm({
  parents,
  form,
  close,
  onCreated,
  onUpdated,
}: Props) {
  const modal = useModal();
  const isSuperAdmin = process.env.NEXT_PUBLIC_SUPER_ADMIN === "true";
  const [isGroup, setIsGroup] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name.trim()) {
      modal.show({
        title: "Nombre requerido",
        message: "El nombre del ingrediente es obligatorio.",
        actions: (
          <button
            onClick={modal.hide}
            className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700"
          >
            Entendido
          </button>
        ),
      });
      return;
    }

    if (!isGroup && !form.parent) {
      modal.show({
        title: "Categoría requerida",
        message: "Debes seleccionar un padre.",
        actions: (
          <button
            onClick={modal.hide}
            className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700"
          >
            Entendido
          </button>
        ),
      });
      return;
    }

    const body = {
      name: form.name,
      parent: isGroup ? null : form.parent,
      price: isGroup ? null : form.price,
      unit: isGroup ? null : form.unit,
    };

    const url = form.editingId
      ? `/api/ingredients/${form.editingId}`
      : `/api/ingredients/list`;

    const method = form.editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      modal.show({
        title: "Error",
        message: err.error || "No se pudo guardar el ingrediente.",
        actions: (
          <button
            onClick={modal.hide}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Cerrar
          </button>
        ),
      });
      return;
    }

    form.editingId ? onUpdated() : onCreated();
    close();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-sm sm:text-base px-1 sm:px-0"
    >
      <div>
        <label className="block mb-1 text-xs sm:text-sm opacity-80">
          Nombre
        </label>
        <input
          type="text"
          className="w-full p-2 rounded bg-neutral-800 text-sm sm:text-base"
          value={form.name}
          onChange={(e) => form.setName(e.target.value)}
        />
      </div>

      {isSuperAdmin && (
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <input
            type="checkbox"
            checked={isGroup}
            onChange={(e) => setIsGroup(e.target.checked)}
          />
          <label>Este ingrediente es solo un grupo</label>
        </div>
      )}

      {!isGroup && (
        <>
          <div>
            <label className="block mb-1 text-xs sm:text-sm opacity-80">
              Precio
            </label>
            <input
              type="number"
              className="w-full p-2 rounded bg-neutral-800 text-sm sm:text-base"
              value={form.price}
              onChange={(e) => form.setPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-1 text-xs sm:text-sm opacity-80">
              Unidad
            </label>
            <select
              className="w-full p-2 rounded bg-neutral-800 text-sm sm:text-base"
              value={form.unit}
              onChange={(e) => form.setUnit(e.target.value)}
            >
              <option value="Kg">Kg</option>
              <option value="g">g</option>
              <option value="l">l</option>
              <option value="ml">ml</option>
              <option value="u">u</option>
              <option value="pack">pack</option>
            </select>
          </div>
        </>
      )}

      <div>
        <label className="block mb-1 text-xs sm:text-sm opacity-80">
          Padre
        </label>
        <select
          className="w-full p-2 rounded bg-neutral-800 text-sm sm:text-base"
          value={form.parent ?? ""}
          onChange={(e) => form.setParent(e.target.value)}
          disabled={isGroup}
        >
          <option value="">Seleccione...</option>

          {parents.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 w-full sm:w-auto px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
      >
        {form.editingId ? "Guardar cambios" : "Crear ingrediente"}
      </button>
    </form>
  );
}