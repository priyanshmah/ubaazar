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
    colour: {
        type: String,
        required: true,
    },
    sizes: [{
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cordset"
    }]
})

cordsetSchema.index({ "$**": "text" });

const Cordset = mongoose.models?.Product?.discriminators?.Cordset || 
                Product.discriminator('Cordset', cordsetSchema);

export default Cordset;
