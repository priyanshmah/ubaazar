import mongoose from "mongoose";
import Product from "../Product.models";


const gownSchema = new mongoose.Schema({

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


const Gown = Product?.discriminators?.Gown || 
                Product.discriminator('Gown', gownSchema);

export default Gown;
