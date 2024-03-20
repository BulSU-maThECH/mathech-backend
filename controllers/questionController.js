const expressAsyncHandler = require('express-async-handler');
const Question = require('../models/Question');
const auth = require('../middleware/Authentication');
const { connectToDatabase, disconnectToDatabase, getClient } = require('../config/database');
const { ObjectId } = require('mongodb');

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

const ViewQuestion = expressAsyncHandler(async (req, res) => {});

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
    const { subject } = req.body;

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const questionCollection = db.collection('questions');
    
    const isSubjectExist = await questionCollection.findOne({subject: subject});
    if (!isSubjectExist) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('Subject does not exist!');
    }

    const subTopicList = await questionCollection.aggregate([
        {$match: {subject: subject}},
        {$group: {_id: "$subTopic"}},
        {$project: {_id: 0, subTopic: "$_id"}},
        {$sort: {subTopic: 1}}
    ]).toArray();

    await disconnectToDatabase();
    res.status(200).send(subTopicList.map(topic => topic.subTopic));
});

const EditQuestion = expressAsyncHandler(async (req, res) => {});

const DeleteQuestion = expressAsyncHandler(async (req, res) => {});

module.exports = {
    CreateQuestion,
    ViewQuestion,
    GetSubjects,
    GetSubtopics,
    EditQuestion,
    DeleteQuestion
};