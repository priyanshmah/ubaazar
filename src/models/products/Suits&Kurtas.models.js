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
        enum: ['Anarkali', 'Straight']
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
        enum: ['Round-Neck', 'V-Neck', 'Collar']
    },
    bottom: {
        type: Boolean,
        required: true
    },
    bottomType: {
        type: String,
        required: function (){
            return this.Bottom
        }
    },
    bottomPattern: {
        type: String,
        required: function (){
            return this.Bottom
        }
    },
    bottomFabric: {
        type: String,
        required: function (){
            return this.Bottom
        }
    },
    dupatta: {
        type: Boolean,
        required: true
    },
    dupattaFabric: {
        type: String,
        required: function(){
            return this.Dupatta
        }
    },
    dupattaLength: {
        type: String,
        required: function(){
            return this.Dupatta
        }
    },
    ornamentation: {
        type: String,
        required: true
    },
    occasion: {
        type: String,
        required: true,
        enum: ['Traditional', 'Daily Wear', 'Party Wear']
    },
    washCare: {
        type: String,
        required: true,
        enum: ['Hand Wash', 'Dry Clean']
    },
    variants: [{
        colour: { type: String, required: true },
        images: [{ type: String, required: true }],
        inventory: [{
            size: { type: String, required: true },
            quantity: { type: Number, required: true }
        }]
    }]
});

const Suits = Product.discriminator('Suits', suitSchema);

export default Suits;

