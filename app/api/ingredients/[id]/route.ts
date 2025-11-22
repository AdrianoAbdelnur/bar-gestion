import { NextResponse } from "next/server";
import Ingredient from "@/models/Ingredient";
import dbConnect from "@/lib/dbConnect";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await dbConnect();
  const ingredient = await Ingredient.findById(id);

  return NextResponse.json(ingredient);
}


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await dbConnect();
  const data = await req.json();

  const parent = data.parent || null;

  const updated = await Ingredient.findByIdAndUpdate(
    id,
    {
      name: data.name,
      price: data.price,
      unit: data.unit,
      parent,
    },
    { new: true }
  );

  return NextResponse.json(updated);
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await dbConnect();
  await Ingredient.findByIdAndUpdate(id, { isDeleted: true });

  return NextResponse.json({ success: true });
}