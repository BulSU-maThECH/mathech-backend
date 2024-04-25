const mongoose = require('mongoose');

module.exports = mongoose.model('QuizSet', new mongoose.Schema({
    setType: {
        type: String,
        required: [true, 'Test type required'],
    },
    instruction: {
        type: String,
        required: [true, 'Instruction required'],
    },
    subject: {
        type: String,
        required: [true, 'Subject required'],
    },
    subTopic: [
        {
            type: String,
            required: [true, 'Subtopic required'],
        },
    ],
    chapters: [
        {
            type: Number,
            required: [true, 'Chapter required'],
        }
    ],
    points: {
        type: Number,
        required: [true, 'Points per item required'],
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