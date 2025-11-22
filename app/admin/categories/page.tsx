"use client";

import { useEffect, useState, useCallback } from "react";
import Tree from "@/components/admin/tree/Tree";
import SlideOver from "@/components/ui/SlideOver";
import CategoryForm from "./components/CategoryForm";
import useCategories from "./hooks/useCategories";
import useCategoryForm from "./hooks/useCategoryForm";
import useTreeOrdering from "@/hooks/useTreeOrdering";
import { Category } from "@/types/Category";

export default function CategoriesPage() {
  const { tree, parents, categories, refresh } = useCategories();
  const form = useCategoryForm(categories);
  const { moveUp, moveDown } = useTreeOrdering<Category>();

  const [localTree, setLocalTree] = useState<Category[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalTree(tree);
    setHasChanges(false);
  }, [tree]);

  const flatten = useCallback((nodes: Category[]): any[] =>
    nodes.flatMap((n) => [
      { _id: n._id, order: n.order },
      ...flatten(n.children ?? [])
    ])
  , []);

  const compareChanges = useCallback((updated: Category[]) => {
    const a = flatten(tree);
    const b = flatten(updated);
    setHasChanges(JSON.stringify(a) !== JSON.stringify(b));
  }, [tree, flatten]);

  const handleMoveUp = useCallback((cat: Category) => {
    const updated = moveUp(localTree, cat);
    setLocalTree(updated);
    compareChanges(updated);
  }, [localTree, moveUp, compareChanges]);

  const handleMoveDown = useCallback((cat: Category) => {
    const updated = moveDown(localTree, cat);
    setLocalTree(updated);
    compareChanges(updated);
  }, [localTree, moveDown, compareChanges]);

  const handleEdit = useCallback((cat: Category) => {
    form.startEdit(cat);
    setOpen(true);
  }, [form]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = confirm("¿Desea borrar la categoría?");
    if (!ok) return;

    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    refresh();
  }, [refresh]);

 const flattenTree = useCallback((nodes: Category[], parent: string | null = null): any[] => {
  return nodes.flatMap((node, index) => [
    { id: node._id, order: index, parent },
    ...flattenTree(node.children ?? [], node._id)
  ]);
}, []);

  const saveChanges = useCallback(async () => {
    const payload = flattenTree(localTree);

    await fetch("/api/categories/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    refresh();
    setHasChanges(false);
  }, [localTree, flattenTree, refresh]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Categorías</h1>

      <div className="flex justify-end">
        <button
          onClick={() => {
            form.resetForm();
            setOpen(true);
          }}
          className="mb-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva categoría
        </button>

        {hasChanges && (
          <button
            onClick={saveChanges}
            className="mb-6 bg-green-600 px-4 py-2 rounded hover:bg-green-700 ml-4"
          >
            Guardar cambios
          </button>
        )}
      </div>

      <Tree
        nodes={localTree}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />

      <SlideOver
        open={open}
        onClose={() => {
          form.resetForm();
          setOpen(false);
        }}
        title={form.editingId ? "Editar categoría" : "Crear nueva categoría"}
        width="w-[580px]"
      >
        <CategoryForm
          parents={parents}
          categories={categories}
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

