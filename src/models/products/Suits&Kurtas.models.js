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
            return this.Bottom
        }
    },
    bottomPattern: {
        type: String,
        required: function () {
            return this.Bottom
        }
    },
    bottomFabric: {
        type: String,
        required: function () {
            return this.Bottom
        }
    },
    dupatta: {
        type: Boolean,
        required: true
    },
    dupattaFabric: {
        type: String,
        required: function () {
            return this.Dupatta
        }
    },
    dupattaLength: {
        type: String,
        required: function () {
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
    },
    washCare: {
        type: String,
        required: true,
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
            required: true
        }
    }],
    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Suits"
    }]
});

suitSchema.index({ "$**": "text" });

const Suits = mongoose.models.Product?.discriminators?.Suits
    || Product.discriminator('Suits', suitSchema);

export default Suits;

