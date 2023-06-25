import mongoose from "mongoose";

const product = mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    imageName: String
});

const productModel = mongoose.model("Product", product);

export default productModel;
