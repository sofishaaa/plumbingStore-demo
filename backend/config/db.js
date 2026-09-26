import mongoose from 'mongoose';

// Фільтри за полями, яких немає в схемі, ігноруються
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB підключено: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Помилка підключення до MongoDB: ${error.message}`);
    process.exit(1);
  }
};

let isClosing = false;

// Навмисне закриття (зупинка сервера, сідер) — без попередження в логах
const closeDB = async () => {
  isClosing = true;
  await mongoose.connection.close();
};

mongoose.connection.on('disconnected', () => {
  if (!isClosing) console.warn('MongoDB: з\'єднання втрачено');
});
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB: з\'єднання відновлено');
});

export { closeDB };
export default connectDB;
