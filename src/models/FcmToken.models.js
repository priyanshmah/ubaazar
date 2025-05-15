import mongoose from 'mongoose';

const fcmTokenSchema = new mongoose.Schema({
    fcmToken: {
        type: String,
        required: true,
        unique: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },
    deviceId: { 
        type: String, 
        default: null
     },
    lastActive: { type: Date, default: Date.now },
    deviceInfo: {
        platform: String,
        model: String,
        osVersion: String
    }
});

export default mongoose.models.FcmToken || mongoose.model('FcmToken', fcmTokenSchema);
