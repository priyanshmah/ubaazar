import mongoose from "mongoose";
import Product from "../Product.models";

const suitSchema = new mongoose.Schema({
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
}, { discriminatorKey: 'type'});


const Suits = Product?.discriminators?.Suits
    || Product.discriminator('Suits', suitSchema);

export default Suits;

