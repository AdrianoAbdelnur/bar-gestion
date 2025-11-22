import { NextResponse } from "next/server";
import Ingredient from "@/models/Ingredient";
import dbConnect from "@/lib/dbConnect";

export async function PUT(req: Request) {
  await dbConnect();
  const list = await req.json();

  const updates = list.map((item: { id: string; order: number; parent: string | null }) =>
    Ingredient.findByIdAndUpdate(item.id, {
      order: item.order,
      parent: item.parent,
    })
  );

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}