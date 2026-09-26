// Захист від NoSQL-ін'єкцій: видаляємо з тіла запиту ключі, які MongoDB
// сприйме як оператори ($ne, $gt, $where...) або шляхи (a.b),
// а також ключі, що можуть призвести до prototype pollution.
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    value.forEach(sanitizeValue);
  } else if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.') || FORBIDDEN_KEYS.has(key)) {
        delete value[key];
      } else {
        sanitizeValue(value[key]);
      }
    }
  }
  return value;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) sanitizeValue(req.body);
  next();
};

export default sanitizeInput;
