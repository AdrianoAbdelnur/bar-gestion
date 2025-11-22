import { NextResponse } from "next/server";
import Ingredient from "@/models/Ingredient";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();

  const ingredients = await Ingredient.find({ isDeleted: false })
    .sort({ parent: 1, order: 1, createdAt: 1 })
    .lean();

  return NextResponse.json(
    ingredients.map((i) => ({
      ...i,
      _id: String(i._id),
      parent: i.parent ? String(i.parent) : null,
    }))
  );
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    console.log(data)

    const name = data.name.trim();
    const parent = data.parent || null;

    const exists = await Ingredient.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      parent,
      isDeleted: false,
    });

    if (exists) {
      return NextResponse.json(
        { error: "Ya existe un ingrediente con ese nombre en esta categoría" },
        { status: 400 }
      );
    }

    const last = await Ingredient.find({ parent })
      .sort({ order: -1 })
      .limit(1);

    const nextOrder = last.length > 0 ? last[0].order + 1 : 0;

    const created = await Ingredient.create({
      name,
      price: data.price ?? 0,
      unit: data.unit || null,
      parent,
      order: nextOrder,
    });

    return NextResponse.json(created, { status: 201 });

  } catch (err: any) {
    console.error("❌ ERROR INGREDIENT POST:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}