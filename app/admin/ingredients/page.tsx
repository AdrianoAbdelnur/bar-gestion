"use client";

import { useEffect, useState, useCallback } from "react";
import Tree from "@/components/admin/tree/Tree";
import SlideOver from "@/components/ui/SlideOver";
import IngredientForm from "./components/ingredientsForm";
import useIngredients from "./hooks/useIngredients";
import useIngredientForm from "./hooks/useIngredientsForm";
import useTreeOrdering from "@/hooks/useTreeOrdering";
import { Ingredient } from "@/types/Ingredients";
import { PackageOpen } from "lucide-react";

export default function IngredientsPage() {
  const { tree, parents, ingredients, refresh } = useIngredients();
  const form = useIngredientForm(ingredients);
  const { moveUp, moveDown } = useTreeOrdering<Ingredient>();

  const [localTree, setLocalTree] = useState<Ingredient[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalTree(tree);
    setHasChanges(false);
  }, [tree]);

  const flatten = useCallback(
    (nodes: Ingredient[]): any[] =>
      nodes.flatMap((n) => [
        { _id: n._id, order: n.order },
        ...flatten(n.children ?? []),
      ]),
    []
  );

  const compareChanges = useCallback(
    (updated: Ingredient[]) => {
      const a = flatten(tree);
      const b = flatten(updated);
      setHasChanges(JSON.stringify(a) !== JSON.stringify(b));
    },
    [tree, flatten]
  );

  const handleMoveUp = useCallback(
    (ing: Ingredient) => {
      const updated = moveUp(localTree, ing);
      setLocalTree(updated);
      compareChanges(updated);
    },
    [localTree, moveUp, compareChanges]
  );

  const handleMoveDown = useCallback(
    (ing: Ingredient) => {
      const updated = moveDown(localTree, ing);
      setLocalTree(updated);
      compareChanges(updated);
    },
    [localTree, moveDown, compareChanges]
  );

  const handleEdit = useCallback(
    (ing: Ingredient) => {
      form.startEdit(ing);
      setOpen(true);
    },
    [form]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = confirm("¿Desea borrar el ingrediente?");
      if (!ok) return;

      await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
      });

      refresh();
    },
    [refresh]
  );

  const flattenTree = useCallback(
    (nodes: Ingredient[], parent: string | null = null): any[] => {
      return nodes.flatMap((node, index) => [
        { id: node._id, order: index, parent },
        ...flattenTree(node.children ?? [], node._id),
      ]);
    },
    []
  );

  const saveChanges = useCallback(
    async () => {
      const payload = flattenTree(localTree);

      await fetch("/api/ingredients/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      refresh();
      setHasChanges(false);
    },
    [localTree, flattenTree, refresh]
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
        Insumos y Materias Primas
      </h1>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
        <button
          onClick={() => {
            form.resetForm();
            setOpen(true);
          }}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
        >
          + Nuevo ingrediente
        </button>

        {hasChanges && (
          <button
            onClick={saveChanges}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto text-sm sm:text-base"
          >
            Guardar cambios
          </button>
        )}
      </div>

      {localTree.length === 0 ? (
        <div className="mt-10 max-w-md mx-auto p-6 rounded-xl bg-neutral-800 border border-neutral-700 text-center text-neutral-300">
          <div className="flex flex-col items-center mb-6">
            <PackageOpen className="w-14 h-14 opacity-70" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">
            No hay ingredientes cargados
          </h2>
          <p className="text-sm mb-6 opacity-70">
            Haz clic en “Nuevo ingrediente” para comenzar a armar tu inventario.
          </p>
          <button
            onClick={() => {
              form.resetForm();
              setOpen(true);
            }}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            Crear ingrediente
          </button>
        </div>
      ) : (
        <Tree
          nodes={localTree}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      )}

      <SlideOver
        open={open}
        onClose={() => {
          form.resetForm();
          setOpen(false);
        }}
        title={form.editingId ? "Editar ingrediente" : "Crear nuevo ingrediente"}
        width="w-full sm:w-[580px]"
      >
        <IngredientForm
          parents={parents}
          form={form}
          close={() => {
            form.resetForm();
            setOpen(false);
          }}
          onCreated={() => {
            refresh();
            setOpen(false);
          }}
          onUpdated={() => {
            refresh();
            setOpen(false);
          }}
        />
      </SlideOver>
    </div>
  );
}