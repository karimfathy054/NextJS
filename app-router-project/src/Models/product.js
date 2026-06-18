import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
      index: true, // Added an index for faster querying by category
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
