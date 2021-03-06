const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'
    },
    token: {
        type: String, required: true
    },
    createdAt: {
        type: Date, required: true, default: Date.now, expireAfterSeconds : 3600
    }
}, {collection: 'tokens'})

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token