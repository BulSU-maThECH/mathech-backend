const mongoose = require("mongoose");

module.exports = mongoose.model('Subject', new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title required'],
    },
    subTopics: [
        {
            type: String,
            required: [true, 'Sub topic required'],
        },
    ],
}));