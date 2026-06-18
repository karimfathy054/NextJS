import { authOptions } from "@/pages/api/auth/[...nextauth]";
import connectToDb from "@/lib/mongodb";
import Product from "@/Models/product";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const { id } = req.query;

  await connectToDb();
  const session = await getServerSession(req, res, authOptions);
  if (req.method == "GET") {
    const { id } = req.query;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } else if (req.method == "PUT") {
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { title, description, category, price, thumbnail } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, category, price, thumbnail },
      { new: true },
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: updatedProduct });
  } else if (req.method == "DELETE") {
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: deletedProduct });
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
