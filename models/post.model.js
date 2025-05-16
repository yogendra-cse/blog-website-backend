import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    images: { type: String, required: true }, 
    author: { type: Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
}); 

const Post = model("Post", postSchema);
export default Post;
