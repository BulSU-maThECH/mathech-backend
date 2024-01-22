const Jwt = require('jsonwebtoken');

/**
 * The `createAccessToken` function is a utility that generates an access token for a user session.
 * This token includes user data (excluding the password) and has an expiration time set until the end
 * of the current day. The generated token is signed using a JWT (JSON Web Token) and is suitable for
 * use in authentication mechanisms.
 * 
 * @param {Object} user - An object containing user information, including at least the `userId`.
 * 
 * @returns {String} A JSON Web Token (JWT) representing the user's session with the specified
 *                   expiration time.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the
 *                  token creation process.
 */
module.exports.createAccessToken = (user) => {
    try {
        const {password, ...userData} = user;

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const expiresIn = Math.floor((endOfDay.getTime() - Date.now()) / 1000);

        return Jwt.sign(userData, process.env.JWT_SECRET, { expiresIn });
    }
    catch (error) {
        return {
            success: false,
            message: 'Error creating access token',
            error
        };
    }
};

/**
 * The `verifyUser` middleware function is used to verify the authenticity of an incoming user request
 * by checking the presence and validity of the JWT (JSON Web Token) included in the request headers.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function in the request-response cycle.
 * 
 * @returns {undefined} This function does not return a value; it either calls the next middleware or
 *                      sends a response.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the
 *                  token verification process.
 */
module.exports.verifyUser = (req, res, next) => {
    const token = req.headers.authorization;

    try {
        if (typeof token === 'undefined') {
            return res.status(401).json({success: false, message: 'Missing token'});
        }

        token = token.slice(' ')[1];

        Jwt.verify(token, process.env.JWT_SECRET);
        next()
    }
    catch (error) {
        return {
            success: false,
            message: 'Error verifying user',
            error
        };
    }
};

/**
 * The `decodeToken` function is a utility used to decode and extract the payload from a JSON Web Token
 * (JWT).
 * 
 * @param {String} token - The JWT to be decoded.
 * 
 * @returns {Object} An object representing the payload of the decoded JWT.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during the
 *                  token decoding process.
 */
module.exports.decodeToken = (token) => {
    try {
        if (typeof token === 'undefined') {
            return res.status(401).json({succes: false, message: 'Missing token'});
        }

        token = token.slice(7, token.length);

        try {
            Jwt.verify(token, process.env.JWT_SECRET);
            return Jwt.decode(token, { complete: true }).payload;
        }
        catch (error) {
            return {
                success: false,
                message: 'Error verifying token',
                error
            };
        }
    }
    catch (error) {
        return {
            success: false,
            message: 'Error decoding token',
            error
        };
    }
};