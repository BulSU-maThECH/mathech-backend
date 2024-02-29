const express =  require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

/**
 * CORS Middleware Configuration:
 * - Sets allowed origins to 'http://localhost:3000' and 'http://127.0.0.1:3000'
 * - Specifies allowed HTTP methods as 'GET,POST,DELETE,PUT,PATCH'
 * - Defines allowed headers as 'Content-Type,Accept,Authorization,x-requested-with'
 * - Enables credentials for cross-origin requests
 * 
 * `app.use(json());` is a middleware function that is being used to parse incoming requests with JSON
 * payloads.
 * 
 * The code `app.use(urlencoded({ extended: true }));` is a middleware function that is being used to
 * parse incoming requests with URL-encoded payloads.
 */
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://mathech.vercel.app', 'https://mathech-mathech.vercel.app', 'https://mathech-git-master-mathech.vercel.app'],
    methods: 'GET,POST,DELETE,PUT,PATCH',
    allowedHeaders: 'Content-Type,Accept,Authorization,x-requested-with',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user',  require('./routes/userRoutes'));
app.use('/otp', require('./routes/otpRoutes'));
app.use('/quiz', require('./routes/quizRoutes'));
app.use('/quizSet', require('./routes/quizSetRoutes'));
app.use('/question', require('./routes/questionRoutes'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode at port ${port}`));