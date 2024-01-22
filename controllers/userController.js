const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../middleware/Authentication');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

let client, database, dataCollection;

/**
 * Asynchronous function to establish a connection to the MongoDB database.
 * Uses the MongoClient from the MongoDB driver to connect to the specified MongoDB URL.
 * The connection configuration includes the MongoDB API version, server options, and connection parameters.
 * Once connected, the function sets the database and dataCollection variables for use in subsequent operations.
 * 
 * @throws {Error} If there is an issue connecting to the database.
 */
async function connectToDatabase() {
    try {
        // Create a new MongoClient instance with specified connection options
        client = new MongoClient(process.env.MONGODB_URL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        // Connect to the MongoDB database
        await client.connect();

        // Set the 'database' variable to the connected database
        database = client.db(process.env.MONGODB_COLLECTION);

        // Set the 'dataCollection' variable to the 'users' collection in the database
        dataCollection = database.collection('users');
    } catch (error) {
        // Throw an error if there is an issue connecting to the database
        throw new Error('Error connecting to the database');
    }
}

/**
 * Asynchronous function to close the MongoDB database connection.
 * Resets the 'database' and 'dataCollection' variables to null and closes the MongoClient connection.
 */
async function closeDatabaseConnection() {
    // Reset the 'database' and 'dataCollection' variables to null
    database = null;
    dataCollection = null;

    // Close the MongoClient connection
    await client.close();
};

/**
 * The `checkAccountExist` function is an asynchronous utility that verifies the existence of a user account 
 * based on either the provided email or mobile number. This function is typically used during the account
 * registration process to ensure that a new user's credentials are unique.
 * 
 * @param {Object} reqBody - An object containing the following fields:
 *   - `email` (String): The email address to check for existence.
 *   - `mobileNumber` (String): The mobile number to check for existence.
 * 
 * @returns {Object} An object with two properties:
 *   - `success` (Boolean): Indicates whether the account existence check was successful.
 *   - `message` (String): Provides a descriptive message regarding the result of the account existence check.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the process.
 */
module.exports.checkAccountExist = async (reqBody) => {
    try {
        const { email, mobileNumber } = reqBody;
        await connectToDatabase();
        const filter = {$or: [{email: email}, {mobileNumber: mobileNumber}]};

        const user = await dataCollection.findOne(filter);
        let message='';
        if ((user.email === email) && (user.mobileNumber === mobileNumber)) {
            message = 'Account with that email and mobile numbile number already exist!'
        }
        else if (user.email === email) {
            message = 'Account with that email already exists!';
        }
        else {
            message = 'Account with that mobile number already exists!';
        }

        return {
            success: true,
            message: message
        }
    }
    catch (error) {
        return {
            success: false,
            message: 'Error account does not exist!'
        };
    }
    finally {
        await closeDatabaseConnection();
    }
};

/**
 * The `signup` function is an asynchronous utility responsible for handling the user registration process.
 * This function checks for the existence of a user account, and if the account does not exist, it securely
 * registers a new user by storing their information in the database after hashing the provided password.
 * 
 * @param {Object} reqBody - An object containing the following fields:
 *   - `firstName` (String): The first name of the user.
 *   - `middleName` (String): The middle name of the user.
 *   - `lastName` (String): The last name of the user.
 *   - `email` (String): The email address of the user.
 *   - `mobileNumber` (String): The mobile number of the user.
 *   - `password` (String): The plain-text password of the user.
 * 
 * @returns {Object} An object with two properties:
 *   - `success` (Boolean): Indicates whether the account registration was successful.
 *   - `message` (String): Provides a descriptive message regarding the result of the registration process.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the process.
 */
module.exports.signup = async (reqBody) => {
    try {
        const { firstName, middleName, lastName, email, mobileNumber, password } = reqBody;
        await connectToDatabase();

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName: {
                firstName,
                middleName,
                lastName
            },
            email,
            mobileNumber,
            password: hashedPassword
        });

        await dataCollection.insertOne(newUser);
        return {
            success: true,
            message: 'Account successfully registered!'
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Error registering account',
            error
        };
    }
    finally {
        await closeDatabaseConnection();
    }
};

/**
 * The `login` function is an asynchronous utility responsible for authenticating a user's login attempt.
 * This function verifies the provided credentials (email or mobile number and password) against the stored
 * user data in the database, and if successful, generates an access token for the user's session.
 * 
 * @param {Object} reqBody - An object containing the following fields:
 *   - `email` (String): The email address associated with the user account.
 *   - `mobileNumber` (String): The mobile number associated with the user account.
 *   - `password` (String): The plain-text password provided by the user for authentication.
 * 
 * @returns {Object} An object with three properties:
 *   - `success` (Boolean): Indicates whether the login attempt was successful.
 *   - `message` (String): Provides a descriptive message regarding the result of the login attempt.
 *   - `token` (String): An access token generated upon successful login, used for session authentication.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the process.
 */
module.exports.login = async (reqBody) => {
    try {
        const { username, password } = reqBody;
        await connectToDatabase();
        const filter = {$or: [{email: username}, {mobileNumber: username}]};

        const user = await dataCollection.findOne(filter);
        if (!user) {
            return {
                success: false,
                message: 'Account does not exist!',
                errorType: 'Account'
            };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return {
                success: false,
                message: 'Password does not match!',
                errorType: 'Password'
            };
        }

        const token = auth.createAccessToken(user);
        
        return {
            success: true,
            message: 'Login successfull!',
            token: token
        }
    }
    catch (error) {
        return {
            success: false,
            message: 'Error loging in account',
            errorType: 'login',
            error
        };
    }
    finally {
        await closeDatabaseConnection();
    }
};

/**
 * The `details` function is an asynchronous utility that retrieves user account details based on the
 * provided user ID. This function is typically used for fetching user information for display or profile
 * purposes, excluding sensitive information such as the password.
 * 
 * @param {Object} reqParams - An object containing the following field:
 *   - `id` (String): The user ID used to uniquely identify the user in the database.
 * 
 * @returns {Object} An object with the following properties:
 *   - `success` (Boolean): Indicates whether the retrieval of account details was successful.
 *   - `message` (String): Provides a descriptive message regarding the result of the retrieval process.
 *   - (If successful) Additional properties representing user data excluding the password.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the process.
 */
module.exports.details = async (reqHeaders) => {
    try {
        const token = reqHeaders.authorization;
        const user = auth.decodeToken(token);
        
        const {iat, exp, ...userData} = user;

        return userData;
    }
    catch (error) {
        return {
            success: false,
            message: 'Error retrieving account details',
            error
        };
    }
};

/**
 * The `edit` function is an asynchronous utility that allows users to modify their account details based on
 * the provided user ID and updated information. This function updates the user data in the database with the
 * new details, providing feedback on the success or failure of the operation.
 * 
 * @param {Object} reqParams - An object containing the following field:
 *   - `id` (String): The user ID used to uniquely identify the user in the database.
 * 
 * @param {Object} reqBody - An object containing the updated user details to be applied.
 * 
 * @returns {Object} An object with the following properties:
 *   - `success` (Boolean): Indicates whether the update of account details was successful.
 *   - `message` (String): Provides a descriptive message regarding the result of the update process.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the process.
 */
module.exports.edit = async (reqParams, reqBody) => {
    try {
        const userId = new ObjectId(reqParams.id);
        await connectToDatabase();
        const filter = {_id: userId};

        const user = await dataCollection.findOne(filter);
        if (!user) {
            return {
                success: false,
                message: 'Account not found!'
            };
        }

        const updateDetails = await dataCollection.updateOne(filter, {$set: reqBody});
        if (updateDetails.modifiedCount === 0) {
            return {
                success: false,
                message: 'No changes were made in the account.'
            };
        }

        return {
            success: true,
            message: 'Account details successfully updated!'
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Error updating account',
            error
        };
    }
    finally {
        await closeDatabaseConnection();
    }
};

/**
 * The `deactivate` function is an asynchronous utility that allows users to deactivate their account by
 * providing the user ID and confirming their identity through the correct account password.
 * This function updates the user data in the database to set the account as inactive.
 * 
 * @param {Object} reqParams - An object containing the following field:
 *   - `id` (String): The user ID used to uniquely identify the user in the database.
 * 
 * @param {Object} reqBody - An object containing the following field:
 *   - `password` (String): The plain-text password provided by the user for identity verification.
 * 
 * @returns {Object} An object with the following properties:
 *   - `success` (Boolean): Indicates whether the deactivation of the account was successful.
 *   - `message` (String): Provides a descriptive message regarding the result of the deactivation process.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the process.
 */
module.exports.deactivate = async (reqParams, reqBody) => {
    try {
        const userId = new ObjectId(reqParams.id);
        const { password } = reqBody;
        await connectToDatabase();
        const filter = {_id: userId};

        const user = await dataCollection.findOne(filter);
        if (!user) {
            return {
                success: false,
                message: 'Account not found!'
            };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return {
                success: false,
                message: 'Password does not match account!'
            };
        }

        await dataCollection.updateOne(filter, {$set: {isActive: false}});
        return {
            success: true,
            message: 'Account deactivated!'
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Error deactivating account',
            error
        };
    }
    finally {
        await closeDatabaseConnection();
    }
};

/**
 * The `activate` function is an asynchronous function that activates a user account by updating the `isActive` field in the database.
 * It checks if the provided username (email or mobile number) exists and if the provided password matches the stored password.
 * If the checks pass, it updates the user's account to set `isActive` to true, indicating activation.
 *
 * @param {Object} reqBody - The request body containing the username (email or mobile number) and password.
 * @returns {Object} An object with properties indicating the success of the account activation and a corresponding message.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the activation process.
 */
module.exports.activate = async (reqBody) => {
    try {
        // Extract the username and password from the request body
        const { username, password } = reqBody;
        
        // Connect to the MongoDB database
        await connectToDatabase();

        // Define the filter based on the provided username (email or mobile number)
        const filter = { $or: [{ email: username }, { mobileNumber: username }] };

        // Find the user in the database based on the filter
        const user = await dataCollection.findOne(filter);

        // Check if the user exists
        if (user === null) {
            return {
                success: false,
                message: 'Account does not exist!'
            };
        }

        // Check if the provided password matches the stored password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return {
                success: false,
                message: 'Password does not match!'
            };
        }

        // Define the update option to set isActive to true
        const updateOption = {
            $set: {
                isActive: true
            }
        };

        // Update the user's account to activate it
        const activateAccount = await dataCollection.updateOne(filter, updateOption);

        // Check if any changes were made to the account
        if (activateAccount.modifiedCount === 0) {
            return {
                success: false,
                message: 'No changes made to account.'
            };
        }

        // Return success information if the account activation is successful
        return {
            success: true,
            message: 'Your account has been activated!'
        };
     }
    catch (error) {
        // Return error information if an exception occurs during the activation process
        return {
            success: false,
            message: 'Error activating account'
        };
    }
    finally {
        // Close the MongoDB database connection
        await closeDatabaseConnection();
    }
};