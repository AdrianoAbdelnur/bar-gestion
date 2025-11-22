import { NextResponse } from "next/server";
import Category from "@/models/Category";
import dbConnect from "@/lib/dbConnect";

export async function PUT(req: Request) {
  await dbConnect();
  const list = await req.json();

  const updates = list.map((cat: { id: string; order: number; parent: string | null }) =>
    Category.findByIdAndUpdate(cat.id, {
      order: cat.order,
      parent: cat.parent,
    })
  );

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}