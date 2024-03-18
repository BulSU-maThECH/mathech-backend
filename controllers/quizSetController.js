const expressAsyncHandler = require('express-async-handler');
const QuizSet = require('../models/QuizSet');
const Question = require('../models/Question');
const auth = require('../middleware/Authentication');
const { connectToDatabase, disconnectToDatabase, getClient } = require('../config/database');
const { ObjectId } = require('mongodb');

const CreateSet = expressAsyncHandler(async (req, res) => {
    const { subject, subTopics, items } = req.body;
    
    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const questionCollection = db.collection('questions');

    const questions = await questionCollection.aggregate([
        {$match: {
            subject: subject,
            subTopic: {$in: subTopics}
        }}
    ]).toArray();

    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    const selectedQuestions = questions.slice(0, items);

    await disconnectToDatabase();
    res.status(200).send(selectedQuestions);
});

module.exports = {
    CreateSet
};