const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Mongoose schema model
const kontaktSchema = new Schema({
    ime: { type: String, required: true },
    prezime: { type: String, required: true },
    grad: { type: String, default: 'Nema Grada' },
    opis: { type: String }
});

module.exports = mongoose.model('Kontakt', kontaktSchema);