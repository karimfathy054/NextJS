import mongoose from "mongoose";

const mongo_url = process.env.MONGODB_URI;

let isConnected = false;

export default async function connectToDb() {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(mongo_url);
    isConnected = db.connections[0].readyState;
    console.log("connected", isConnected);
  } catch (err) {
    console.log(err);
  }
}
