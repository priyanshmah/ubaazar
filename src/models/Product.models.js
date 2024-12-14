import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"]
    },
    category: {
        type: String,
        required: [true, "Product category is required"]
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    rating: {
        type: Number,
        default: 4.5
    },
    images: [{
        type: String
    }],
    video: [{
        type: String,
    }]
}, { discriminatorKey: 'type', collection: 'products'})


productSchema.index(
    { productName: "text", description: "text", category: "text" },
    { weights: { productName: 5, description: 2 } }
); 
const Product = mongoose.models?.Product || 
                mongoose.model("Product", productSchema);



export default Product;