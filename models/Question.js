const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

/**
 * TODO: Write up the Question Schema as indicated in our ERD. Write the documentation here.
 * TODO: Write up `@param {DataType} ParamName - Description`
 * 
 * @model Question
 */
module.exports = mongoose.model('Question', new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question required'],
    },
    chapter: {
        type: Number,
        required: [true, 'Chapter required'],
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty required'],
    },
    questionType: {
        type: String,
        required: [true, 'Question type required'],
    },
    options: [
        {
            order: {
                type: Number,
                required: [true, 'Order required'],
            },
            text: {
                type: String,
                required: [true, 'Option required'],
            },
        },
    ],
    answer: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Creator ID required'],
        ref: "User",
    },
}));