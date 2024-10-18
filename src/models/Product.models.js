import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Product Name is required"]
    },
    category: {
        type: String,
        required: [true, "Product Category is required"]
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, "Product Price is required"]
    },
    video: [{
        type: String,
    }]
}, { discriminatorKey: 'productType', collection: 'products'})

const Product = mongoose.models.products || 
                mongoose.model("products", productSchema);



export default Product;