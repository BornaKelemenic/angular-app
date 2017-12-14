const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Mongoose schema model
const contactSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    city: { type: String, default: 'No city' },
    description: { type: String },
    addedBy: { type: String, required: true }
});

module.exports = mongoose.model('Contact', contactSchema);