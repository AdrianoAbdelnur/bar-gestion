import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Dish from '@/models/Dish';

export async function GET() {
  try {
    await dbConnect();
    const dishes = await Dish.find({ isDeleted: false }).populate('ingredients');
    return NextResponse.json({ message: 'Dishes obtained correctly', dishes });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newDish = new Dish(body);
    await newDish.save();
    return NextResponse.json(
        { message: 'Dish created successfully', newDish }, 
        {status: 201}
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
