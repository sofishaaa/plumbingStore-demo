import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ім\'я обов\'язкове'],
      trim: true,
      maxlength: [100, 'Ім\'я задовге (максимум 100 символів)'],
    },
    email: {
      type: String,
      required: [true, 'Email обов\'язковий'],
      unique: true,
      lowercase: true,
      trim: true,
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
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    // Хеш пароля та токени ніколи не потрапляють у JSON-відповіді
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.passwordChangedAt;
        return ret;
      },
    },
  }
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
  // Мітка для інвалідації старих JWT (з запасом 1с на округлення iat)
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
