const expressAsyncHandler = require('express-async-handler');
const QuizSet = require('../models/QuizSet');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/Authentication');
const { connectToDatabase, disconnectToDatabase, getClient } = require('../config/database');
const { ObjectId } = require('mongodb');

const CreateSet = expressAsyncHandler(async (req, res) => {
    const { quizType, instructions, subject, subTopics, chapters, items, points,  } = req.body;
    const testId = req.params.id;
    let userId = req.headers.authorization;
    userId = await auth.decodeToken(userId);
    userId = new ObjectId(userId._id);
    
    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const questionCollection = db.collection('questions');
    const quizSetCollection = db.collection('quiz_set');
    const quizCollection = db.collection('quiz');

    const questions = await questionCollection.aggregate([
        {$match: {
            subject: {$regex: new RegExp(subject, 'i')},
            chapter: {$in: chapters},
            subTopic: {$in: subTopics.map(topic => new RegExp(topic, 'i'))},
            questionType: quizType
        }}
    ]).toArray();

    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    const selectedQuestions = questions.slice(0, items);

    let output;

    if (!testId) {
        const newQuizSet = new QuizSet({
            setType: quizType,
            instruction: instructions,
            subject: subject,
            subTopic: subTopics,
            chapters: chapters,
            points: points,
            questions: selectedQuestions,
            createdBy: userId
        });

        generatedQuizSet = await quizSetCollection.insertOne(newQuizSet);

        generatedQuizSetId = generatedQuizSet.insertedId.toString();

        const newQuiz = new Quiz({
            title: subject,
            quizSet: [generatedQuizSetId],
            createdBy: userId
        });

        const quizId = await quizCollection.insertOne(newQuiz);

        output = {
            generatedId: quizId.insertedId.toString(),
            questions: selectedQuestions
        };
    }
    else {
        const newQuizSet = new QuizSet({
            setType: quizType,
            instruction: instructions,
            subject: subject,
            subTopic: subTopics,
            chapters: chapters,
            points: points,
            questions: selectedQuestions,
            createdBy: userId
        });

        generatedQuizSet = await quizSetCollection.insertOne(newQuizSet);

        await quizCollection.updateOne(
            {_id: new ObjectId(testId)},
            {$push: { quizSet: new ObjectId(generatedQuizSet.insertedId.toString())}}
        );
        
        output = {questions: selectedQuestions};
    }

    await disconnectToDatabase();
    res.status(200).send(output);
});

const GetQuizSet = expressAsyncHandler(async (req, res) => {
    const setId = new ObjectId(req.params.id);

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const quizSetCollection = db.collection('quiz_set');
    const filter = {_id: setId};

    const quizSetData = await quizSetCollection.findOne(filter);

    await disconnectToDatabase();
    res.status(200).send(quizSetData);
});

const x = expressAsyncHandler(async (req, res) => {});

module.exports = {
    CreateSet,
    GetQuizSet
};