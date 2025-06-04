import mongoose from "mongoose";
import Product from "../Product.models";

const lehangaSchema = new mongoose.Schema({

    variants: [{
        sizes: [{ 
            size: {
                type: String,
            },
            quantity: {
                type: Number,
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


const Lehangas = Product?.discriminators?.Lehangas ||
    Product.discriminator('Lehangas', lehangaSchema);

export default Lehangas;