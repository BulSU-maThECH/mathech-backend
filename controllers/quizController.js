const expressAsyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/Authentication');
const { connectToDatabase, disconnectToDatabase, getClient } = require('../config/database');
const { ObjectId } = require('mongodb');

const ViewAllQuiz = expressAsyncHandler(async (req, res) => {
    let userId = req.headers.authorization;
    userId = await auth.decodeToken(userId);
    userId = new ObjectId(userId._id);

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const quizCollection = db.collection('quiz');
    const filter = {createdBy: userId}

    const Quizzes = await quizCollection.find(filter).toArray();

    await disconnectToDatabase();
    res.status(200).send(Quizzes);
});

const ViewOneQuiz = expressAsyncHandler(async (req, res) => {
    const QuizId = new ObjectId(req.params.id);

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const quizCollection = db.collection('quiz');
    const quizSetCollection = db.collection('quiz_set');
    const filter = {_id: QuizId};

    const QuizDetails = await quizCollection.findOne(filter);
    if (!QuizDetails) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('Quiz not found!');
    }

    const quizSetDetails = await quizSetCollection.find({_id: {$in: QuizDetails.quizSet}}).toArray();

    const details = {
        _id: QuizDetails._id,
        title: QuizDetails.title,
        quizSet: quizSetDetails,
        createdBy: QuizDetails.createdBy
    }

    await disconnectToDatabase();
    res.status(200).send(details);
});

module.exports = {
    ViewAllQuiz,
    ViewOneQuiz
};