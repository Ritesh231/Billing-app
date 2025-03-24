import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    total: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Bill', billSchema);
