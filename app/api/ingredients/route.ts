import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ingredient from '@/models/Ingredient';

export async function GET() {
  try {
    await dbConnect();
    const ingredients = await Ingredient.find({ isDeleted: false });
    return NextResponse.json({ message: 'Ingredients obtained correctly', ingredients });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newIngredient = new Ingredient(body);
    await newIngredient.save();
    return NextResponse.json({ message: 'Ingredient created successfully', newIngredient }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
