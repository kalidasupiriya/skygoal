const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    mobile: {
        type: String,
        match: /^[0-9]{10}$/, // 10 digit validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    status: {
        type: String,
        enum: ['1', '2', '3'], // 1 active, 2 inactive, 3 banned
        default: '1'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lastAttemptTime: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
