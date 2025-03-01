import mongoose from "mongoose";

const bagItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    variantId: {
        type: 'String',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    size: {
        type: 'String',
        default: 'Free size'
    }
})

const bagSchema = new mongoose.Schema({
    items: [bagItemSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

export default mongoose.models.Bag || mongoose.model("Bag", bagSchema)

