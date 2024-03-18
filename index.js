const express =  require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const app = express();
require('dotenv').config();
const ErrorHandler = require('./middleware/ErrorHandler');

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://mathech.vercel.app', 'https://mathech-mathech.vercel.app', 'https://mathech-git-master-mathech.vercel.app'],
    methods: 'DELETE,GET,PATCH,POST,PUT',
    allowedHeaders: 'Accept,Authorization,Content-Type,x-requested-with',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());
app.set('trust proxy', true);

app.use('/user',  require('./routes/userRoutes'));
app.use('/otp', require('./routes/otpRoutes'));
app.use('/quiz', require('./routes/quizRoutes'));
app.use('/quizSet', require('./routes/quizSetRoutes'));
app.use('/question', require('./routes/questionRoutes'));
app.use(ErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode at port ${port}`));