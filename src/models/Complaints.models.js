import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    complaint: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    complaintNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Complaint =  mongoose.models.complaints || mongoose.model("Complaint", complaintSchema);

export default Complaint;


