import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
    videoUrl: {
        type: String,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
    shares: {
        type: Number,
        default: 0
    },
    isTrending: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Reel = mongoose.models.Reel || mongoose.model("Reel", reelSchema);

export default Reel;


