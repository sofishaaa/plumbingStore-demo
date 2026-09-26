import rateLimit from 'express-rate-limit';

const message = (text) => ({ message: text });

// Загальний ліміт на API — захист від скрейпінгу та простого DoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Забагато запитів, спробуйте пізніше'),
});

// Вхід: рахуємо лише невдалі спроби — захист від підбору пароля
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Забагато невдалих спроб входу. Спробуйте через 15 хвилин'),
});

// Реєстрація — захист від масового створення акаунтів
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Забагато реєстрацій з вашої адреси. Спробуйте пізніше'),
});

// Скидання пароля — захист від спаму листами та перебору токенів
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Забагато запитів на скидання пароля. Спробуйте через годину'),
});

export { apiLimiter, loginLimiter, registerLimiter, passwordResetLimiter };
