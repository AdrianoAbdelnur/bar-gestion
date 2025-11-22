import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

interface CategoryDoc {
  _id: string;
  name: string;
  parent: string | null;
  order: number;
  isDeleted?: boolean;
}

interface CategoryNode extends CategoryDoc {
  children: CategoryNode[];
}

export async function GET() {
  await dbConnect();

  const raw = await Category.find({ isDeleted: false }).sort({ order: 1 }).lean();

  const categories: CategoryDoc[] = raw.map((c: any) => ({
    _id: String(c._id),
    name: c.name,
    parent: c.parent ? String(c.parent) : null,
    order: c.order ?? 0,
    isDeleted: c.isDeleted ?? false,
  }));

  const buildTree = (parentId: string | null): CategoryNode[] => {
    return categories
      .filter((c) => c.parent === parentId)
      .map((cat) => ({
        ...cat,
        children: buildTree(cat._id), 
      }));
  };

  const tree = buildTree(null);

  return NextResponse.json(tree);
}