const expressAsyncHandler = require('express-async-handler');
const Jwt = require('jsonwebtoken');

const createAccessToken = expressAsyncHandler(async (user) => {
    const {password, ...userData} = user;

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const JwtOptions = {
        issuer: 'maThECH'
    };

    const token = await Jwt.sign({ user: userData }, process.env.JWT_SECRET, JwtOptions);
    return token;
});

const verifyToken = expressAsyncHandler(async (req, res, next) => {
    let token = req.headers.authorization;
    
    if (!token || !token.startsWith('Bearer')) {
        res.status(404);
        throw new Error('Token does not exist!');
    };

    token = token.split(' ')[1];
    
    Jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            res.status(422);
            throw new Error(err.message);
        }
    });

    next();
});

const decodeToken = expressAsyncHandler(async (token) => {
    token = token.split(' ')[1];

    const user = Jwt.decode(token, { complete: true });
    return user.payload.user;
});

module.exports = {
    createAccessToken,
    verifyToken,
    decodeToken
};