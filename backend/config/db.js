import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB підключено: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Помилка: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
