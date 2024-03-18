const mongoose = require('mongoose');

module.exports = mongoose.model('QuizSet', new mongoose.Schema({
    instruction: {
        type: String,
        required: [true, 'Instruction required'],
    },
    setType: {
        type: String,
        required: [true, 'Test type required'],
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Question ID required'],
            ref: "Question",
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Creator ID required'],
        ref: "User",
    },
}));