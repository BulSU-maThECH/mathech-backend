const expressAsyncHandler = require('express-async-handler');
const Question = require('../models/Question');
const QuizSet = require('../models/QuizSet');
const auth = require('../middleware/Authentication');
const { connectToDatabase, disconnectToDatabase, getClient } = require('../config/database');
const { ObjectId } = require('mongodb');
const { disconnect } = require('mongoose');

const CreateQuestion = expressAsyncHandler(async (req, res) => {
    const newQuestionData = req.body;

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const questionCollection = db.collection('questions');
    const filter = {question: newQuestionData.question};

    const isQuestionExist = await questionCollection.findOne(filter);
    if (isQuestionExist) {
        await disconnectToDatabase();
        res.status(400);
        throw new Error('Question already exists!');
    }

    let userId = await auth.decodeToken(req.headers.authorization);
    userId = new ObjectId(userId._id);

    const newQuestion = new Question({
        ...newQuestionData,
        createdBy: userId
    });

    await questionCollection.insertOne(newQuestion);
    await disconnectToDatabase();
    res.status(201).send({message: 'Questions successfully created!'});
});

const GetSubjects = expressAsyncHandler(async (req, res) => {
    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const questionCollection = db.collection('questions');
    
    const subjects = await questionCollection.aggregate([
        {$group: {_id: "$subject"}},
        {$project: {subject: "$_id"}},
        {$sort: {subject: 1}}
    ]).toArray();
    if (subjects.length === 0) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('No subject found!');
    }

    await disconnectToDatabase();
    res.status(200).send(subjects.map(subject => subject.subject));
});

const GetSubtopics= expressAsyncHandler(async (req, res) => {
    const { subject, chapters } = req.body;

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const questionCollection = db.collection('questions');
    
    const isSubjectExist = await questionCollection.findOne({subject: {$regex: new RegExp(subject, 'i')}});
    if (!isSubjectExist) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('Subject does not exist!');
    }

    const subTopicList = await questionCollection.aggregate([
        {$match: {subject: {$regex: new RegExp(subject, 'i')}, chapter: {$in: chapters}}},
        {$group: {_id: "$subTopic"}},
        {$project: {subTopic: "$_id"}},
        {$sort: {subTopic: 1}}
    ]).toArray();

    await disconnectToDatabase();
    res.status(200).send(subTopicList.map(topic => topic.subTopic));
});

const GetQuestions = expressAsyncHandler(async (req, res) => {
    const { questions } = req.body;
    const questionIds = questions.map(id => new ObjectId(id));

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const questionCollection = db.collection('questions');
    
    const questionList = await questionCollection.find({_id: {$in: questionIds}}).toArray();

    await disconnectToDatabase();
    res.status(200).send(questionList);
});

const EditQuestion = expressAsyncHandler(async (req, res) => {
    const quizSetId = new ObjectId(req.params.id);
    const questionId = req.body.questionId;
    const newQuestion = req.body.newQuestion;

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const quizSetCollection = db.collection('quiz_set');
    const filter = {_id: quizSetId};

    const quizSet = await quizSetCollection.findOne(filter);
    if (!quizSet) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('Quiz set does not exist!');
    }

    const questionIndex = await quizSet.questions.findIndex(question => question._id.toString() === questionId);
    if (questionIndex === -1) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('Question does not exist!');
    }

    quizSet.questions[questionIndex].question = newQuestion

    await quizSetCollection.updateOne(filter, {$set: {questions: quizSet.questions}});

    await disconnectToDatabase();
    res.status(200).end();
});

const DeleteQuestion = expressAsyncHandler(async (req, res) => {
    const quizSetId = new ObjectId(req.params.id);
    const questionId = req.body.questionId;

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const quizSetCollection = db.collection('quiz_set');
    const filter = {_id: quizSetId};

    const quizSet = await quizSetCollection.findOne(filter);
    if (!quizSet) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('Quiz set does not exists!');
    }

    const question = quizSet.questions.findIndex(question => question._id.toString() === questionId);
    if (question === -1) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('Question does not exist in the quiz set!');
    }

    quizSet.questions.splice(question, 1);

    await quizSetCollection.updateOne(filter, {$set: {questions: quizSet.questions}});

    await disconnectToDatabase();
    res.status(204).end();
});

module.exports = {
    CreateQuestion,
    GetSubjects,
    GetSubtopics,
    GetQuestions,
    EditQuestion,
    DeleteQuestion
};