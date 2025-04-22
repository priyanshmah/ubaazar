import mongoose from "mongoose";
import Product from "../Product.models";

const lehangaSchema = new mongoose.Schema({
    pattern: {
        type: String,
        required: true
    },
    lehangaFabric: {
        type: String,
        required: true
    },
    lehangaLength: {
        type: String,
        required: true
    },
    flair: {
        type: String,
        required: true
    },
    blouseType: {
        type: String,
        required: true
    },
    blouseFabric: {
        type: String,
        required: true
    },
    blouseLength: {
        type: String,
        required: true
    },
    dupattaFabric: {
        type: String,
        required: true
    },
    dupattaLength: {
        type: String,
        required: true
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
        quantity: {
            type: Number,
            default: 0,
            required: true
        },
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

lehangaSchema.index({
    lehangaFabric: 'text',
    pattern: 'text',
    blouseType: 'text',
    occasion: 'text',
});

const Lehangas = Product?.discriminators?.Lehangas ||
    Product.discriminator('Lehangas', lehangaSchema);

export default Lehangas;