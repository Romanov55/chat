import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import router from './routes/index';
import connectDB from './db';
import errorHandler from './middleware/errorHandingMiddleware';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use('/api', router);
app.use('/img', express.static('static'));

// Обработка ошибок, послендий Middleware
app.use(errorHandler)

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.error('Server error:', e);
    }
};

start();
