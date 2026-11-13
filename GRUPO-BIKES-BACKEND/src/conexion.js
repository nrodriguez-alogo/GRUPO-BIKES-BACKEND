import mongoose from "mongoose";
export async function connectDatabase() {
  if (!process.env.MONGODB) throw new Error("Configura MONGODB en .env.");
  await mongoose.connect(process.env.MONGODB, {
    serverSelectionTimeoutMS: 10000,
  });
}
