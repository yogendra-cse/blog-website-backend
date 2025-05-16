import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const reportSchema = new Schema({
  postId: { type: Types.ObjectId, ref: "Post", required: true },
  reportMessages: [
    {
      username: String,
      message: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  count: { type: Number, default: 1 },
});

export default model("Report", reportSchema);
