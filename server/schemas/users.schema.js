import mongoose from "mongoose";

const user = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const userModel = mongoose.model("User", user);

export default userModel;
