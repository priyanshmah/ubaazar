import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true,
        enum: ['cod', 'online']
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'shipped', 'in-transit', 'delivered'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        required: function(){
            return this.paymentMode === 'online';
        }
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    orderNumber: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
