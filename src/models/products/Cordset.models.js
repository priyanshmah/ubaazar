import mongoose from "mongoose";
import Product from "../Product.models";


const cordsetSchema = new mongoose.Schema({

    topFabric: {
        type: String,
        required: true
    },
    topPattern: {
        type: String,
        required: true
    },
    topLength: {
        type: Number,
        required: true
    },
    neck: {
        type: String,
        required: true
    },
    bottomType: {
        type: String,
        required: true
    },
    bottomFabric: {
        type: String,
        required: true
    },
    bottomLength: {
        type: Number,
        required: true
    },
    occasion: {
        type: String,
        required: true,
        enum: ['Daily Wear', 'Party Wear']
    },
    washCare: {
        type: String,
        required: true,
        enum: ['Hand Wash', 'Dry Clean']
    },
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

cordsetSchema.index({ 
    topPattern: 'text',
    topFabric: 'text',
    neck: 'text',
    bottomType: 'text',
    occasion: 'text'
 });

const Cordset = Product?.discriminators?.Cordset || 
                Product.discriminator('Cordset', cordsetSchema);

export default Cordset;
