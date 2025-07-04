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
    mrp: { type: Number},
    costPrice: { type: Number},
    sellerName: { type: String },
    rating: {
        type: Number,
        default: 4.5
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    embeddings:{
        type: [Number],
        default: [],
    },
    video: [{
        type: String,
    }],
}, { discriminatorKey: 'type', collection: 'products'})


productSchema.index(
    { productName: "text", description: "text", category: "text" },
    { weights: { productName: 5, description: 2, category: 10 } }
); 

const Product = mongoose.models?.Product || 
                mongoose.model("Product", productSchema);

export default Product;