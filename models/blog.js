const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Mongoose schema model
const blogSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: String, required: true },
    dateCreated: { type: Date, default: new Date() },
    dateEdited: { type: Date },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikedBy: { type: Array },
    comments: [{
        comment: { type: String },
        commentator: { type: String }
    }]
});

module.exports = mongoose.model('Blog', blogSchema);