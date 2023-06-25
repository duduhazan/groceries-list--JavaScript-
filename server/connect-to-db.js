import mongoose from "mongoose";

export const connectDB = async (dbUrl) => {
  try {
    await mongoose.connect(dbUrl);
    console.log("connected to mongo DB");
  } catch (e) {
    console.log("problems with mongo DB");
  }
};