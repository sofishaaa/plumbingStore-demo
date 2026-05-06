import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ім\'я обов\'язкове'],
    },
    email: {
      type: String,
      required: [true, 'Email обов\'язковий'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Некоректний формат email'],
    },
    password: {
      type: String,
      required: [true, 'Пароль обов\'язковий'],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Порівняння введеного пароля з хешем
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Хешування пароля перед збереженням
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
