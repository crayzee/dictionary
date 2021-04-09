const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    file_name: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('File', BookSchema);