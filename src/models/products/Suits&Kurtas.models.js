import mongoose from "mongoose";
import Product from "../Product.models";

const suitSchema = new mongoose.Schema({
    topFabric: {
        type: String,
        required: true
    },
    topShape: {
        type: String,
        required: true,
    },
    topPattern: {
        type: String,
        required: true,
    },
    topLength: {
        type: String,
        required: true
    },
    neck: {
        type: String,
        required: true,
    },
    bottom: {
        type: Boolean,
        required: true
    },
    bottomType: {
        type: String,
        required: function () {
            return this.bottom
        }
    },
    bottomPattern: {
        type: String,
        required: function () {
            return this.bottom
        }
    },
    bottomFabric: {
        type: String,
        required: function () {
            return this.bottom
        }
    },
    dupatta: {
        type: Boolean,
        required: true
    },
    dupattaFabric: {
        type: String,
        required: function () {
            return this.dupatta
        }
    },
    dupattaLength: {
        type: String,
        required: function () {
            return this.dupatta
        }
    },
    ornamentation: {
        type: String,
        required: true
    },
    occasion: {
        type: String,
        required: true,
    },
    washCare: {
        type: String,
        required: true,
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
}, { discriminatorKey: 'type'});

suitSchema.index({ 
    topShape: 'text',
    topPattern: 'text',
    topFabric: 'text',
    neck: 'text',
    bottomType: 'text',
    bottomPattern: 'text',
    occasion: 'text'
 });

const Suits = Product?.discriminators?.Suits
    || Product.discriminator('Suits', suitSchema);

export default Suits;

