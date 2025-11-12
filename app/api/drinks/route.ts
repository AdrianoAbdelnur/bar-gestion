import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Drink from '@/models/Drink';

export async function GET() {
  try {
    await dbConnect();
    const drinks = await Drink.find({ isDeleted: false });
    return NextResponse.json({ message: 'Drinks obtained correctly', drinks });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newDrink = new Drink(body);
    await newDrink.save();
    return NextResponse.json(
        { message: 'Drink created successfully', newDrink },
        { status: 201 }
);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
