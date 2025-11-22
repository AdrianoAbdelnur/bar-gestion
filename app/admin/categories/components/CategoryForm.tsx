"use client";

import Modal from "@/components/ui/modals/MultiuseModal";
import useModal from "@/hooks/useModal";
import { Category } from "@/types/Category";

interface Props {
  parents: Category[];
  categories: Category[];
  form: {
    editingId: string | null;
    name: string;
    setName: (v: string) => void;
    mainParent: string;
    setMainParent: (v: string) => void;
    internalParent: string;
    setInternalParent: (v: string) => void;
    startEdit: (cat: Category) => void;
    resetForm: () => void;
  };
  close: () => void;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function CategoryForm({
  parents,
  categories,
  form,
  close,
  onCreated,
  onUpdated,
}: Props) {
  const modal = useModal();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let parent: string | null = null;

    if(form.mainParent === "" || form.mainParent=== null) {
      modal.show({
        title: "Información incompleta",
        message: "Debes seleccionar una categoría principal.",
        content: (
          <>
            
          </>
        ),
        actions: (
          <>
            <button
              onClick={modal.hide}
              className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition"
            >
              Entendido
            </button>
          </>
        )
      });
      return
    }

    if (form.internalParent) parent = form.internalParent;
    else if (form.mainParent) parent = form.mainParent;

    const body = {
      name: form.name,
      parent,
    };

    const url = form.editingId
      ? `/api/categories/${form.editingId}`
      : `/api/categories/list`;

    const method = form.editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (form.editingId) onUpdated();
    else onCreated();

    close();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-neutral-800"
          value={form.name}
          onChange={(e) => form.setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">Categoría principal</label>
        <select
          className="w-full p-2 rounded bg-neutral-800"
          value={form.mainParent}
          onChange={(e) => form.setMainParent(e.target.value)}
        >
          <option value="">Selecione categoría principal</option>

          {parents.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {form.mainParent && (
        <div>
          <label className="block mb-1">Subcategoría de</label>

          <select
            className="w-full p-2 rounded bg-neutral-800"
            value={form.internalParent}
            onChange={(e) => form.setInternalParent(e.target.value)}
          >
            <option value="">Ninguna</option>

            {categories
              .filter((c) => c.parent === form.mainParent)
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        {form.editingId ? "Guardar cambios" : "Crear categoría"}
      </button>
      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
        onClose={modal.hide}
      >
        {modal.content}
      </Modal>
    </form>
  );
}