import crypto from 'crypto';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken, { clearToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/userModel.js';
import {
  MIN_PASSWORD_LENGTH,
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
} from '../utils/validators.js';

const PASSWORD_ERROR = `Пароль має містити від ${MIN_PASSWORD_LENGTH} до 128 символів`;

const normalizeEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
});

// @desc    Автентифікація + встановлення токену
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  const user = email ? await User.findOne({ email }) : null;

  if (user && password && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json(userResponse(user));
  } else {
    res.status(401);
    throw new Error('Неправильний email або пароль');
  }
});

// @desc    Реєстрація нового користувача
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!isNonEmptyString(name, 100)) {
    res.status(400);
    throw new Error("Вкажіть ім'я (до 100 символів)");
  }
  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Некоректний email');
  }
  if (!isValidPassword(password)) {
    res.status(400);
    throw new Error(PASSWORD_ERROR);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Користувач з таким email вже існує');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json(userResponse(user));
  } else {
    res.status(400);
    throw new Error('Невалідні дані користувача');
  }
});

// @desc    Вийти / очистити cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  clearToken(res);
  res.status(200).json({ message: 'Вихід виконано успішно' });
});

// @desc    Отримати профіль користувача
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(userResponse(user));
  } else {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }
});

// @desc    Оновити профіль користувача
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (name !== undefined && name !== '') {
      if (!isNonEmptyString(name, 100)) {
        res.status(400);
        throw new Error("Вкажіть ім'я (до 100 символів)");
      }
      user.name = name;
    }

    if (email && email !== user.email) {
      if (!isValidEmail(email)) {
        res.status(400);
        throw new Error('Некоректний email');
      }
      if (await User.exists({ email })) {
        res.status(400);
        throw new Error('Цей email вже використовується');
      }
      user.email = email;
    }

    if (password) {
      if (!isValidPassword(password)) {
        res.status(400);
        throw new Error(PASSWORD_ERROR);
      }
      user.password = password;
    }

    const updatedUser = await user.save();

    // Зміна пароля інвалідує старі сесії — видаємо новий токен поточній
    if (password) generateToken(res, updatedUser._id);

    res.json(userResponse(updatedUser));
  } else {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }
});

// @desc    Отримати всіх користувачів (адмін)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password -resetPasswordToken -resetPasswordExpires')
    .sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Отримати користувача за ID (адмін)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    '-password -resetPasswordToken -resetPasswordExpires'
  );
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }
});

// @desc    Видалити користувача (адмін)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Неможливо видалити адміністратора');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'Користувача видалено' });
  } else {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }
});

// @desc    Оновити користувача (адмін)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const email = normalizeEmail(req.body.email);
    const isAdmin = Boolean(req.body.isAdmin);

    // Не даємо адміну випадково зняти права з самого себе
    if (user._id.equals(req.user._id) && !isAdmin) {
      res.status(400);
      throw new Error('Неможливо зняти права адміністратора з власного акаунта');
    }

    if (req.body.name) {
      if (!isNonEmptyString(req.body.name, 100)) {
        res.status(400);
        throw new Error("Вкажіть ім'я (до 100 символів)");
      }
      user.name = req.body.name;
    }
    if (email && email !== user.email) {
      if (!isValidEmail(email)) {
        res.status(400);
        throw new Error('Некоректний email');
      }
      if (await User.exists({ email })) {
        res.status(400);
        throw new Error('Цей email вже використовується');
      }
      user.email = email;
    }
    user.isAdmin = isAdmin;

    const updatedUser = await user.save();
    res.json(userResponse(updatedUser));
  } else {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }
});

// @desc    Запит на скидання пароля — надсилає email з токеном
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = email ? await User.findOne({ email }) : null;

  if (!user) {
    // Відповідаємо 200, щоб не розкривати чи існує email
    res.json({ message: 'Якщо такий email зареєстрований, лист надіслано' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  user.resetPasswordToken = hash;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 година
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:8px">
      <h2 style="color:#8C52FE;margin-bottom:8px">Сантех Студія</h2>
      <p style="color:#373D43">Ви отримали цей лист, бо запросили скидання пароля.</p>
      <a href="${resetUrl}"
         style="display:inline-block;margin:24px 0;padding:12px 28px;background:#8C52FE;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">
        Скинути пароль
      </a>
      <p style="color:#6b7280;font-size:13px">Посилання дійсне 1 годину.<br>Якщо ви не робили цей запит — проігноруйте лист.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Скидання пароля — Сантех Студія',
      html,
    });
  } catch (error) {
    console.error('Помилка надсилання листа:', error.message);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500);
    throw new Error('Не вдалося надіслати лист. Спробуйте пізніше');
  }

  res.json({ message: 'Якщо такий email зареєстрований, лист надіслано' });
});

// @desc    Скинути пароль за токеном
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  if (!isValidPassword(req.body.password)) {
    res.status(400);
    throw new Error(PASSWORD_ERROR);
  }

  const hash = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hash,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Посилання недійсне або термін дії минув');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Пароль успішно змінено' });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
};
