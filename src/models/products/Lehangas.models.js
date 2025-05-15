import mongoose from "mongoose";
import Product from "../Product.models";

const lehangaSchema = new mongoose.Schema({

    flair: String ,
    lehangaFabric: String ,
    lehangaWork: String ,
    lehangaInner: String ,

    blouseFabric: String ,
    blouseWork: String ,
    blouseInner: String ,

    dupattaFabric: String,
    dupattaLength: String ,
    dupattaWork: String ,

    lehangaStitchingType: String ,
    blouseStitchingType: String ,

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

lehangaSchema.index({
    lehangaFabric: 'text',
    lehangaWork: 'text',
    lehangaInner: 'text',
    flair: 'text',
    blouseFabric: 'text',
    blouseWork: 'text',
    blouseInner: 'text',
    dupattaFabric: 'text',
    dupattaLength: 'text',
    dupattaWork: 'text',
    
});

const Lehangas = Product?.discriminators?.Lehangas ||
    Product.discriminator('Lehangas', lehangaSchema);

export default Lehangas;