import connectToDb from "@/lib/mongodb";
import Product from "@/Models/product";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDb();
  try {
    const products = await Product.find();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
