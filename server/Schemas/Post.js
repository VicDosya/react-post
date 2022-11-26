import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date, default: Date.now,
        required: true,
    }
});

export default mongoose.model('posts', PostSchema);