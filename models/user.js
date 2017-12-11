const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// Mongoose schema model
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

// Pre-save functon for encrypting the password
userSchema.pre('save', function (next) 
{
    if(!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);

        this.password = hash;
        next();
    });
});

// Compare encrypted password from database with entered password
userSchema.methods.comparePassword = function(password)
{
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', userSchema);