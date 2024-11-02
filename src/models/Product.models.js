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
    images: [{
        type: String
    }],
    video: [{
        type: String,
    }]
}, { discriminatorKey: 'productType', collection: 'products'})

const Product = mongoose.models.Product || 
                mongoose.model("Product", productSchema);



export default Product;