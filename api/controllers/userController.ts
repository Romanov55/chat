import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/User';
import ApiError from '../error/ApiError';

dotenv.config();

export default new class UserController {
  // Регистрация пользователя
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        
        // Проверка на null или undefined перед выполнением запроса
        const existingUser = await User.findOne({ $or: [{ email: email || "" }] });
        if (existingUser) {
          return res.json({ message: 'Пользователь с таким email уже зарегистрирован' });
        }

        const newUser = new User({ email });
        await newUser.save();

        return res.json({ message: 'Пользователь зарегистрирован', data: newUser });
    } catch (e: any) {
        // Если ошибка имеет свойство message, верни его
        const errorMessage = e.message || 'Что-то пошло не так';
        next(ApiError.badRequest(errorMessage));
    }
  }
};
