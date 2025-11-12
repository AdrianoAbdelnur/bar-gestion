import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Drink from '@/models/Drink';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const updatedDrink = await Drink.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ message: 'Drink edited successfully', updatedDrink });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
