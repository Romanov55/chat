import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/User';
import ApiError from '../error/ApiError';

dotenv.config();

export default new class UserController {
  // Регистрация пользователя
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, name } = req.body;

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
          return res.json({ message: 'Пользователь с таким email уже зарегистрирован', data: existingUser.id });
        }

        const newUser = new User({ email, name });
        await newUser.save();

        return res.json({ message: 'Пользователь зарегистрирован', data: newUser });
    } catch (e: any) {
        // Если ошибка имеет свойство message, верни его
        const errorMessage = e.message || 'Что-то пошло не так';
        next(ApiError.badRequest(errorMessage));
    }
  }
};
