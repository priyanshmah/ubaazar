import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
    if (cached.conn) {
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB connection is already established.');
            return cached.conn;
        }
        if (mongoose.connection.readyState === 2) {
            console.log('MongoDB connection is in progress...');
            return cached.conn;
        }
    }

    if (!cached.promise) {
        console.log('Establishing a new MongoDB connection...');
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((mongoose) => {
                console.log('MongoDB connected successfully...');
                return mongoose;
            })
            .catch((error) => {
                console.error('Error connecting to MongoDB:', error);
                cached.promise = null; // Reset promise on failure
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
