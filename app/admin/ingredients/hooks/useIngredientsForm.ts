import { useState } from "react";
import { Ingredient } from "@/types/Ingredients";

export default function useIngredientForm(allIngredients: Ingredient[] = []) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState<string>("Kg");
  const [parent, setParent] = useState<string | null>(null);

  const startEdit = (ing: Ingredient) => {
    setEditingId(ing._id);
    setName(ing.name);
    setPrice(ing.price);
    setUnit(ing.unit);
    setParent(ing.parent ?? null);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice(0);
    setUnit("Kg");
    setParent(null);
  };

  return {
    editingId,
    name, setName,
    price, setPrice,
    unit, setUnit,
    parent, setParent,
    startEdit,
    resetForm
  };
}