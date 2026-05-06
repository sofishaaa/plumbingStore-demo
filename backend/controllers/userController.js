import crypto from 'crypto';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/userModel.js';

// @desc    Автентифікація + встановлення токену
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Неправильний email або пароль');
  }
});

// @desc    Реєстрація нового користувача
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Користувач з таким email вже існує');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Невалідні дані користувача');
  }
});

// @desc    Вийти / очистити cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Вихід виконано успішно' });
});

// @desc    Отримати профіль користувача
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
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
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }
});

// @desc    Отримати всіх користувачів (адмін)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Отримати користувача за ID (адмін)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
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
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }
});

// @desc    Запит на скидання пароля — надсилає email з токеном
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

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

  await sendEmail({
    to: user.email,
    subject: 'Скидання пароля — Сантех Студія',
    html,
  });

  res.json({ message: 'Якщо такий email зареєстрований, лист надіслано' });
});

// @desc    Скинути пароль за токеном
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
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
