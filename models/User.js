const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    passwordResetToken: String,
    passwordResetExpires: Date

}, {collection: 'users'})

const User = mongoose.model('User', userSchema)
module.exports = User