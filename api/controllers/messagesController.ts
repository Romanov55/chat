import { Request, Response, NextFunction } from "express";
import Message from "../models/Message";
import ApiError from "../error/ApiError";
import User from "../models/User";
import mongoose from "mongoose";

export default new class ChatController {
    // Отправка сообщения
    async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const { sender, receiver, text } = req.body;

            if (!sender || !receiver || !text) {
                return next(ApiError.badRequest("Некорректные данные"));
            }

            // Проверяем, существуют ли пользователи
            const senderUser = await User.findById(sender);
            const receiverUser = await User.findById(receiver);

            if (!senderUser || !receiverUser) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            // Сохраняем сообщение
            const message = new Message({ sender, receiver, text });
            await message.save();

            return res.status(201).json({ message: "Сообщение отправлено", data: message });
        } catch (e: any) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение сообщений между двумя пользователями
    async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const { sender, receiver } = req.query;

            if (!sender || !receiver) {
                return next(ApiError.badRequest("Некорректные данные"));
            }

            const senderObjectId = new mongoose.Types.ObjectId(sender as string);
            const receiverObjectId = new mongoose.Types.ObjectId(receiver as string);

            // Получаем сообщения между пользователями
            const messages = await Message.find({
                $or: [
                    { sender: senderObjectId, receiver: receiverObjectId },
                    { sender: receiverObjectId, receiver: senderObjectId }
                ]
            }).sort({ timestamp: 1 });

            return res.json(messages);
        } catch (e: any) {
            next(ApiError.badRequest(e.message));
        }
    }
};
