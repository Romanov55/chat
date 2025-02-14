import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import router from './routes/index';
import connectDB from './db';
import errorHandler from './middleware/errorHandingMiddleware';
import http from "http";
import { initSocket } from './socket';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use('/api', router);
app.use('/img', express.static('static'));

// Обработка ошибок, последний Middleware
app.use(errorHandler);

// Инициализируем WebSocket
initSocket(httpServer);

httpServer.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
