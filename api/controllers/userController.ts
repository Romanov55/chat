import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
import ApiError from '../error/ApiError';
import isValidPhoneNumber from '../services/validationPhone';
import isValidPassword from '../services/validationPassword';

dotenv.config();

const generateJwt = (id: string, email: string) => {
  return jwt.sign({ id, email }, process.env.SECRET_KEY || '', { expiresIn: '30d' });
};

export default new class UserController {
  // Регистрация пользователя
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, phone, username } = req.body;

        if (!email || !password || !phone || !username) {
          return next(ApiError.badRequest('Не верные данные'));
        }

        if (!isValidPassword(password)) {
            return next(ApiError.badRequest('Пароль не прошёл валидацию'));
        }

        if (!isValidPhoneNumber(phone)) {
          return next(ApiError.badRequest('Некорректный формат номера телефона'));
        }

        // Проверка на null или undefined перед выполнением запроса
        const existingUser = await User.findOne({ $or: [{ email: email || "" }, { phone: phone || "" }] });
        if (existingUser) {
            return next(ApiError.badRequest('Пользователь с таким email или номером уже существует'));
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = new User({ email, password: hashPassword, phone, username });
        await newUser.save();

        const token = generateJwt(newUser.id, newUser.email || "");
        return res.json({ token });
    } catch (e: any) {
        // Если ошибка имеет свойство message, верни его
        const errorMessage = e.message || 'Что-то пошло не так';
        next(ApiError.badRequest(errorMessage));
    }
  }

  // Логин пользователя
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return next(ApiError.internal('Неверный логин'));
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return next(ApiError.internal('Неверный пароль'));
      }

      const token = generateJwt(user.id, user.email || '');
      return res.json({ token });
    } catch (e: any) {
      next(ApiError.badRequest(e.message));
    }
  }

  // Обновление данных пользователя
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, password, phone, email } = req.body;

      if (!id) {
        return next(ApiError.badRequest('Не указан ID пользователя'));
      }

      const user = await User.findById(id);
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      if (password && !isValidPassword(password)) {
        return next(ApiError.badRequest('Пароль не прошёл валидацию'));
      }

      if (!isValidPhoneNumber(phone)) {
        return next(ApiError.badRequest('Некорректный формат номера телефона'));
      }

      const updateData: Partial<{ password: string; phone: string; email: string }> = {};

      if (password) updateData.password = await bcrypt.hash(password, 12);
      if (phone) updateData.phone = phone;
      if (email) updateData.email = email;

      await User.findByIdAndUpdate(id, updateData, { new: true });

      return res.json({ message: 'Данные успешно обновлены' });
    } catch (error: any) {
      next(ApiError.badRequest(error.message));
    }
  }

  // Восстановление пароля
  async recovery(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return next(ApiError.internal('Неверный email'));
      }

      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      user.codeUser = randomCode;
      await user.save();

      // Здесь можно отправить код на email через nodemailer

      return res.json({ message: 'Код отправлен на email' });
    } catch (e: any) {
      next(ApiError.badRequest(e.message));
    }
  }

  // Подтверждение кода и смена пароля
  async recoveryPass(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, codeUser, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || user.codeUser !== codeUser) {
        return next(ApiError.internal('Неверный код или email'));
      }

      user.password = await bcrypt.hash(password, 12);
      user.codeUser = ''; // Очищаем код
      await user.save();

      return res.json({ message: 'Пароль успешно изменён' });
    } catch (e: any) {
      next(ApiError.badRequest(e.message));
    }
  }

  // Получение всех пользователей
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      return res.json(users);
    } catch (e: any) {
      next(ApiError.badRequest(e.message));
    }
  }

  // Получение пользователя по ID
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      return res.json(user);
    } catch (error: any) {
      next(ApiError.badRequest(error.message));
    }
  }

  // Удаление пользователя
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      return res.json({ message: 'Пользователь удалён' });
    } catch (e: any) {
      next(ApiError.badRequest(e.message));
    }
  }
};
