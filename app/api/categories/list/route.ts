import { NextResponse } from "next/server";
import Category from "@/models/Category";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();

  const categories = await Category.find({ isDeleted: false })
    .sort({ parent: 1, order: 1, createdAt: 1 })
    .lean();

  return NextResponse.json(
    categories.map((c) => ({
      ...c,
      _id: String(c._id),
      parent: c.parent ? String(c.parent) : null,
    }))
  );
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();

  const name = data.name.trim();
  const parent = data.parent || null;

  const exists = await Category.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
    isDeleted: false,
  });

  if (exists) {
    return NextResponse.json(
      { error: "Ya existe una categoría con ese nombre" },
      { status: 400 }
    );
  }

  const last = await Category.find({ parent })
    .sort({ order: -1 })
    .limit(1);

  const nextOrder = last.length > 0 ? last[0].order + 1 : 0;

  const created = await Category.create({
    name,
    parent,
    order: nextOrder,
  });

  return NextResponse.json(created, { status: 201 });
}