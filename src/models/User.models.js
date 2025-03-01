import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "Please provide your name"]
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    mobileNumber: {
        type: String,
        unique: true,
        required: [true, "please give your mobile number"]
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    bag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bag"
    },
    coupons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    }],
    usedCoupons: [{
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        },
        usedCount: {
            type: Number,
            default: 1
        }
    }],
    previousOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    savedAddresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    refreshToken: {
        type: String
    },
})

userSchema.set("autoIndex", true);

const User = mongoose.models.Users || mongoose.model("Users", userSchema);

export default User;