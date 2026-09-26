// Перевірка змінних оточення під час старту сервера.
// Краще впасти одразу з зрозумілою помилкою, ніж працювати з дірявою конфігурацією.

const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];
const REQUIRED_IN_PRODUCTION = ['CLIENT_URL'];
const RECOMMENDED_IN_PRODUCTION = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'FROM_EMAIL',
  'ORDER_NOTIFY_EMAIL',
];

const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const required = isProduction
    ? [...REQUIRED, ...REQUIRED_IN_PRODUCTION]
    : REQUIRED;

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `Відсутні обов'язкові змінні оточення: ${missing.join(', ')}. Див. .env.example`
    );
    process.exit(1);
  }

  if (isProduction && process.env.JWT_SECRET.length < 32) {
    console.error(
      'JWT_SECRET занадто короткий (мінімум 32 символи). Згенеруйте: ' +
        "node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );
    process.exit(1);
  }

  if (isProduction) {
    const missingRecommended = RECOMMENDED_IN_PRODUCTION.filter(
      (key) => !process.env[key]
    );
    if (missingRecommended.length > 0) {
      console.warn(
        `Увага: не задано ${missingRecommended.join(', ')} — листи (скидання пароля, сповіщення про замовлення) можуть не надсилатися`
      );
    }
  }
};

export default validateEnv;
