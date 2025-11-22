import { NextResponse } from "next/server";
import Category from "@/models/Category";
import dbConnect from "@/lib/dbConnect";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await dbConnect();
  const cat = await Category.findById(id);
  return NextResponse.json(cat);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();

  const data = await req.json();
  const parent = data.parent || null;

  const updated = await Category.findByIdAndUpdate(
    id,
    { name: data.name, parent },
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

  await Category.findByIdAndUpdate(id, { isDeleted: true });

  await Category.updateMany(
    { parent: id },
    { isDeleted: true }
  );

  return NextResponse.json({ success: true });
}