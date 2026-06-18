import connectToDb from "@/lib/mongodb";
import Product from "@/Models/product";
import { NextResponse } from "next/server";

export async function GET(req, { params: { id } }) {
  await connectToDb();
  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
