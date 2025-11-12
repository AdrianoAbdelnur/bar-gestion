import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await Ingredient.findByIdAndUpdate(params.id, { isDeleted: true });
    return NextResponse.json({ message: 'Ingredient deleted correctly' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
