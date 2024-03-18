const asyncHandler = require('express-async-handler');
const { MongoClient, ServerApiVersion } = require('mongodb');

let client;

const connectToDatabase = asyncHandler(async () => {
    const mongoOptions = {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            depracationErrors: true,
        },
    };

    client = await MongoClient.connect(process.env.MONGODB_URL, mongoOptions);
});

const disconnectToDatabase = asyncHandler(async () => {
    await client.close();
});

module.exports = {
    connectToDatabase,
    disconnectToDatabase,
    getClient: () => client
};