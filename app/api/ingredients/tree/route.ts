import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Ingredient from "@/models/Ingredient";

interface IngredientDoc {
  _id: string;
  name: string;
  parent: string | null;
  order: number;
  price: number;
  unit: string;
  isDeleted?: boolean;
}

interface IngredientNode extends IngredientDoc {
  children: IngredientNode[];
}

export async function GET() {
  await dbConnect();

  // Traer todos los ingredientes no borrados
  const raw = await Ingredient.find({ isDeleted: false })
    .sort({ order: 1 })
    .lean();

  // Normalizar datos
  const ingredients: IngredientDoc[] = raw.map((i: any) => ({
    _id: String(i._id),
    name: i.name,
    parent: i.parent ? String(i.parent) : null,
    order: i.order ?? 0,
    price: i.price,
    unit: i.unit,
    isDeleted: i.isDeleted ?? false,
  }));

  // Construir árbol exactamente como categorías
  const buildTree = (parentId: string | null): IngredientNode[] => {
    return ingredients
      .filter((ing) => ing.parent === parentId)
      .map((ing) => ({
        ...ing,
        children: buildTree(ing._id),
      }));
  };

  const tree = buildTree(null);

  return NextResponse.json(tree);
}