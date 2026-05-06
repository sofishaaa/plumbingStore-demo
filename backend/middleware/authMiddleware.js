import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// Захист маршрутів — перевірка JWT
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Не авторизовано, токен відсутній');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Не авторизовано, токен недійсний');
  }
});

// Тільки для адміністраторів
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Не авторизовано як адміністратор');
  }
};

export { protect, admin };
