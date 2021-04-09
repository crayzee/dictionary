const mongoose = require('mongoose');

const UserSocialSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true
    },
    profileId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: '',
        required: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('UserSocial', UserSocialSchema);