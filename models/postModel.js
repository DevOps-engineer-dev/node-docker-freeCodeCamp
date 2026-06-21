const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post must have a title']
    },
    body: {
        type: String,
        required: [true, 'Post must have a body']
    }
});

// Compile the schema into a model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;