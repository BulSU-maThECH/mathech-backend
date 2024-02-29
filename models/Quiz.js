const mongoose = require('mongoose');

/**
 * TODO: Write up the Quiz Schema as indicated in our ERD. Write the documentation here.
 * TODO: Write up `@param {DataType} ParamName - Description`
 * 
 * @model Quiz
 */
module.exports = mongoose.model('Quiz', new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title required'],
    },
    quizSet: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Quiz ID required'],
            ref: "QuizSet",
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Creator ID required'],
        ref: "User",
    },
}));