import { useState } from "react";
import { Category } from "@/types/Category";

export default function useCategoryForm(allCategories: Category[] = []) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mainParent, setMainParent] = useState("");
  const [internalParent, setInternalParent] = useState("");

  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setName(cat.name);

    if (!cat.parent) {
      setMainParent("");
      setInternalParent("");
      return;
    }

    const parent = allCategories.find(c => c._id === cat.parent);

    if (!parent) {
      setMainParent("");
      setInternalParent("");
      return;
    }

    if (parent.parent === null) {
      setMainParent(parent._id);
      setInternalParent("");
      return;
    }

    setMainParent(parent.parent);
    setInternalParent(parent._id);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setMainParent("");
    setInternalParent("");
  };

  return {
    editingId,
    name, setName,
    mainParent, setMainParent,
    internalParent, setInternalParent,
    startEdit,
    resetForm
  };
}