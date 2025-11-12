import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Dish from '@/models/Dish';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const updatedDish = await Dish.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ message: 'Dish updated successfully', updatedDish });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
