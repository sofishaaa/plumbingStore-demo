const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const isNonEmptyString = (value, maxLength) =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  value.length <= maxLength;

const isValidEmail = (value) =>
  typeof value === 'string' &&
  value.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPassword = (value) =>
  typeof value === 'string' &&
  value.length >= MIN_PASSWORD_LENGTH &&
  value.length <= MAX_PASSWORD_LENGTH;

const isValidPhone = (value) =>
  typeof value === 'string' && /^\+?[\d\s()-]{10,20}$/.test(value.trim());

// Екранування спецсимволів, щоб рядок пошуку не став регулярним виразом (ReDoS)
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export {
  MIN_PASSWORD_LENGTH,
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  escapeRegex,
};
