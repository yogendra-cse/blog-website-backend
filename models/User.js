import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = model("User", userSchema);

export default User;
