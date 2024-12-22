import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    pincode: { type: String },
    address: { type: String },
    area: { type: String },
    city: { type: String },
    state: { type: String },
    formatted_address: { type: String },
    addressType: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
    },
    isDefault: {
        type: Boolean,
        default: false
    },
})

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
