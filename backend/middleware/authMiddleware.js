import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// Захист маршрутів — перевірка JWT
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Не авторизовано, токен відсутній');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    res.status(401);
    throw new Error('Не авторизовано, токен недійсний');
  }

  const user = await User.findById(decoded.userId).select('-password');

  if (!user) {
    res.status(401);
    throw new Error('Не авторизовано, користувача не знайдено');
  }

  // Після зміни/скидання пароля всі старі сесії стають недійсними
  if (
    user.passwordChangedAt &&
    decoded.iat * 1000 < user.passwordChangedAt.getTime()
  ) {
    res.status(401);
    throw new Error('Сесія застаріла, увійдіть знову');
  }

  req.user = user;
  next();
});

// Тільки для адміністраторів
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Не авторизовано як адміністратор');
  }
};

export { protect, admin };
