const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userTmpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
}, {collection: 'usersTmp'})

const UserTmp = mongoose.model('UserTmp', userTmpSchema)
module.exports = UserTmp