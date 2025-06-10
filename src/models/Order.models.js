import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        variantId: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true
        },
        size: String
    }],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ['COD', 'ONLINE'],
            required: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
            default: 'PENDING'
        },
        transactionId: String,
        paidAt: Date
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED','SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'],
        default: 'PENDING'
    },
    priceDetails: {
        subTotal: {
            type: Number,
            required: true
        },
        shippingCharge: {
            type: Number,
            default: 0
        },
        codCharge: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    },
    appliedCoupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    shippingInfo: {
        provider: String,
        trackingNumber: String,
        trackingUrl: String,
        estimatedDelivery: Date,
        shippedAt: Date,
        deliveredAt: Date
    },
    cancellationReason: String,
    returnReason: String,
    notes: String,
    feedBack: String,
}, { timestamps: true });

// Indexes for faster lookups
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.methods.canExchange = function() {
    const deliveredDate = this.shippingInfo.deliveredAt;
    if (!deliveredDate || this.status !== 'DELIVERED') return false;
  
    const returnWindow = 36;
    const hoursSinceDelivery = (Date.now() - deliveredDate) / (1000 * 60 * 60);
    
    return hoursSinceDelivery <= returnWindow;
  };
  

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
