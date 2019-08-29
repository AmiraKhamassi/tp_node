const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
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
    }
}, {collection: 'users'})

const User = mongoose.model('User', userSchema)
module.exports = User