import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['PERCENTAGE', 'FIXED'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    maxDiscount: {
        type: Number,
        default: null 
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    startDate: Date,
    endDate: Date,
    usageLimit: {
        type: Number, 
        default: null 
    },
    userUsageLimit: {
        type: Number,
        default: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    excludedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

couponSchema.index({ code: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
