const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../middleware/Authentication');
const { connectToDatabase, disconnectToDatabase, getClient } = require('../config/database');
const { ObjectId } = require('mongodb');

const RegisterUser = expressAsyncHandler(async (req, res) => {
    const { firstName, middleName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        res.status(400);
        throw new Error('Missing fields!');
    }
    
    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const userCollection = db.collection('users');
    const filter = {email: email};

    const user = await userCollection.findOne(filter);
    if (user) {
        await disconnectToDatabase();
        res.status(400);
        throw new Error('User already exist! Try a different email.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        password: hashedPassword,
    });

    await userCollection.insertOne(newUser);
    await disconnectToDatabase();
    res.status(201).send({message: 'User successfully registered!'});
});

const CheckUserExist = expressAsyncHandler(async (req, res) => {
    const {email} = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Missing fields!');
    }

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const userCollection = db.collection('users');
    const filter = {email: email};

    const user = await userCollection.findOne(filter);
    if (user) {
        await disconnectToDatabase();
        res.status(400);
        throw new Error('User already exists!');
    }

    await disconnectToDatabase();
    res.status(200).send({message: 'User does not exist.'});
});

const UserDetails = expressAsyncHandler(async (req, res) => {
    const token = req.headers.authorization;
    const user = await auth.decodeToken(token);

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const userCollection = db.collection('users');
    const filter = {_id: new ObjectId(user._id)};

    const userData = await userCollection.findOne(filter);
    if (!userData) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('User does not exist!');
    }

    const {password, ...userInfo} = userData;

    res.status(200).send(userInfo);
});

const LoginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Missing fields!');
    }

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const userCollection = db.collection('users');
    const filter = {email: email};

    const user = await userCollection.findOne(filter);
    if (!user) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('User does not exist!');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        await disconnectToDatabase();
        res.status(422);
        throw new Error('Password does not match!');
    }

    const token = await auth.createAccessToken(user);
    await disconnectToDatabase();
    res.status(200).send({access: token});
});

const EditUser = expressAsyncHandler(async (req, res) => {
    const newUser = req.body;
    const userId = req.params.id;

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const userCollection = db.collection('users');
    const filter = {_id: new ObjectId(userId)};

    const user = await userCollection.findOne(filter);
    if (!user) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('User not found!');
    }

    await userCollection.updateOne(filter, {$set: newUser});
    await disconnectToDatabase();
    res.status(200).send({message: 'User information has been updated!'});
});

const DeleteUser = expressAsyncHandler(async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const { password } = req.body;

    await connectToDatabase();
    const client = getClient();
    const db = client.db(process.env.MONGODB_COLLECTION);
    const userCollection = db.collection('users');
    const filter = {_id: userId};

    const user = await userCollection.findOne(filter);
    if (!user) {
        await disconnectToDatabase();
        res.status(404);
        throw new Error('User not found!');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        await disconnectToDatabase();
        res.status(422);
        throw new Error('Incorrect password!');
    }

    await userCollection.deleteOne(filter);
    await disconnectToDatabase();
    res.status(204).end();
});

module.exports = {
    CheckUserExist,
    RegisterUser,
    UserDetails,
    LoginUser,
    EditUser,
    DeleteUser
};