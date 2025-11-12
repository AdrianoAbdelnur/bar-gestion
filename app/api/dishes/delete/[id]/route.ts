import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Dish from '@/models/Dish';

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await Dish.findByIdAndUpdate(params.id, { isDeleted: true });
    return NextResponse.json({ message: 'Dish deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
