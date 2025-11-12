import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Drink from '@/models/Drink';

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await Drink.findByIdAndUpdate(params.id, { isDeleted: true });
    return NextResponse.json({ message: 'Drink deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
