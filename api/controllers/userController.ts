import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/User';
import ApiError from '../error/ApiError';

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
          return res.json({ message: 'Пользователь с таким email уже зарегистрирован', data: existingUser.id });
        }

        const newUser = new User({ email, name, avatar });
        await newUser.save();

        return res.json({ message: 'Пользователь зарегистрирован', data: newUser });
    } catch (e: any) {
        // Если ошибка имеет свойство message, верни его
        const errorMessage = e.message || 'Что-то пошло не так';
        next(ApiError.badRequest(errorMessage));
    }
  }

  async addFriend (req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, friendId } = req.body;
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
          return next(ApiError.badRequest('Пользователь не найден' ));
        }

        // Проверка, не является ли друг уже другом
        if (user.friends.includes(friendId)) {
          return next(ApiError.badRequest('Уже в друзьях' ));
        }

        // Добавляем друга в список друзей пользователя
        user.friends.push(friendId);
        await user.save();

        // Также добавляем пользователя в список друзей друга (двусторонняя связь)
        friend.friends.push(userId);
        await friend.save();

        return { message: 'Пользователь добавлен в друзья' };
    } catch (e: any) {
        next(ApiError.badRequest(e.message));
    }
  }
  
  // Пример метода удаления друга:
  async removeFriend (req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, friendId } = req.body;

      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return next(ApiError.badRequest('Пользователь не найден' ));
      }

      // Удаляем друга из списка друзей пользователя
      user.friends = user.friends.filter(friend => friend.toString() !== friendId);
      await user.save();

      // Также удаляем пользователя из списка друзей друга
      friend.friends = friend.friends.filter(friend => friend.toString() !== userId);
      await friend.save();

      return { message: 'Друг удалён' };
    } catch (e: any) {
      next(ApiError.badRequest(e.message));
    }
  }
};
