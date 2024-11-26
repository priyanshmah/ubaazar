import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "Please provide your name"]
    },
    email: {
        type: String,
        unique: true
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
    Bag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bag"
    },
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

const User = mongoose.models.Users || mongoose.model("Users", userSchema);

export default User;