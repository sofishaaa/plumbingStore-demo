import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { demoUsers, products } from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB, { closeDB } from './config/db.js';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const args = process.argv.slice(2);
const isDestroy = args.includes('-d');
const isForced = args.includes('--force');

// Сідер ВИДАЛЯЄ всі замовлення, товари і користувачів.
// У продакшні — тільки з явним прапорцем --force.
if (isProduction && !isForced) {
  console.error(
    '❌ NODE_ENV=production: сідер видалить УСІ замовлення, товари та користувачів.\n' +
      '   Якщо це справді потрібно (перший запуск магазину), додайте --force:\n' +
      '   npm run data:import -- --force'
  );
  process.exit(1);
}

const getAdminUser = () => {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@santexstudio.ua';
  let password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || password.length < 12) {
    if (isProduction) {
      console.error(
        '❌ Задайте SEED_ADMIN_PASSWORD (мінімум 12 символів) для акаунта адміністратора'
      );
      process.exit(1);
    }
    password = 'admin123';
    console.warn(`⚠️  Використано демо-пароль адміна: ${email} / ${password}`);
  }

  return {
    name: 'Адміністратор',
    email,
    password: bcrypt.hashSync(password, 10),
    isAdmin: true,
  };
};

const importData = async () => {
  try {
    const adminUser = getAdminUser();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Демо-покупців створюємо лише для розробки
    const users = isProduction
      ? [adminUser]
      : [
          adminUser,
          ...demoUsers.map((u) => ({
            ...u,
            password: bcrypt.hashSync(u.password, 10),
          })),
        ];

    const createdUsers = await User.insertMany(users);
    const adminId = createdUsers[0]._id;

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminId,
      // У продакшні не показуємо вигадані рейтинги — лише реальні відгуки
      ...(isProduction ? { rating: 0, numReviews: 0 } : {}),
    }));

    await Product.insertMany(sampleProducts);
    console.log('✅ Дані успішно завантажено!');
  } catch (error) {
    console.error(`❌ Помилка: ${error}`);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('✅ Дані успішно видалено!');
  } catch (error) {
    console.error(`❌ Помилка: ${error}`);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
};

await connectDB();

if (isDestroy) {
  await destroyData();
} else {
  await importData();
}
