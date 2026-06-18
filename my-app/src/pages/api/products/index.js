import { authOptions } from "@/pages/api/auth/[...nextauth]";
import connectToDb from "@/lib/mongodb";
import Product from "@/Models/product";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  await connectToDb();
  const session = await getServerSession(req, res, authOptions);

  if (req.method == "GET") {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: products });
  } else if (req.method == "POST") {
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { title, description, category, price, thumbnail } = req.body;
    const product = new Product({
      title,
      description,
      category,
      price,
      thumbnail,
    });
    await product.save();
    return res.status(201).json({ success: true, data: product });
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
