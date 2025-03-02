import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/User';
import ApiError from '../error/ApiError';
import Message from '../models/Message';

dotenv.config();

export default new class UserController {
  // Регистрация пользователя
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, name, avatar } = req.body;

        if (!email) {
          return res.json({ message: 'Email обязателен' });
        }

        // Проверка на null или undefined перед выполнением запроса
        const existingUser = email ? await User.findOne({ email }) : null;
        if (existingUser && existingUser.name !== name) {
          existingUser.name = name;
          await existingUser.save();
        }
        
        if (existingUser) {
          const userInfo = await User.findById(existingUser.id).populate('friends');

          // const lastMessage = await Message.findOne({
          //   $or: [
          //     { sender: existingUser.id },
          //     { receiver: existingUser.id }
          //   ]
          // }).sort({ timestamp: -1 });
          return res.json( userInfo );
        }

        const newUser = new User({ email, name, avatar });
        await newUser.save();

        const userInfo = await User.findById(newUser.id).populate('friends');
        // const lastMessage = await Message.findOne({
        //   $or: [
        //     { sender: newUser.id },
        //     { receiver: newUser.id }
        //   ]
        // }).sort({ timestamp: -1 });

        return res.json( userInfo );
    } catch (e: any) {
        // Если ошибка имеет свойство message, верни его
        const errorMessage = e.message || 'Что-то пошло не так';
        next(ApiError.badRequest(errorMessage));
    }
  }
};
