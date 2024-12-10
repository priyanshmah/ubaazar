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
    status: {
        type: String,
        enum: ['ready to ship', 'shipped', 'in-transit', 'delivered', 'cancelled'],
        default: 'ready to ship'
    },
    statusMessage: {
        type: String
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
    }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
