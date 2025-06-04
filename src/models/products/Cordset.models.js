import mongoose from "mongoose";
import Product from "../Product.models";


const cordsetSchema = new mongoose.Schema({

    variants: [{
        sizes: [{ 
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                default: 0,
                required: true
            }
        }],
        color: {
            type: String,
            required: true
        },
        images: [{
            type: String,
            required: true
        }]
    }]
})


const Cordset = Product?.discriminators?.Cordset || 
                Product.discriminator('Cordset', cordsetSchema);

export default Cordset;
