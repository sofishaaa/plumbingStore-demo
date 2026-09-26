import mongoose from 'mongoose';
import CATEGORIES from '../constants/categories.js';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Оцінка має бути від 1 до 5'],
      max: [5, 'Оцінка має бути від 1 до 5'],
    },
    comment: {
      type: String,
      required: [true, 'Коментар обов\'язковий'],
      trim: true,
      maxlength: [2000, 'Коментар задовгий (максимум 2000 символів)'],
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Назва товару обов\'язкова'],
      trim: true,
      maxlength: [300, 'Назва задовга (максимум 300 символів)'],
    },
    image: {
      type: String,
      required: [true, 'Зображення товару обов\'язкове'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Бренд обов\'язковий'],
      trim: true,
      maxlength: [100, 'Назва бренду задовга'],
    },
    // Категорії сантехніки
    category: {
      type: String,
      required: [true, 'Категорія обов\'язкова'],
      enum: {
        values: CATEGORIES,
        message: 'Невідома категорія: {VALUE}',
      },
    },
    description: {
      type: String,
      required: [true, 'Опис товару обов\'язковий'],
      maxlength: [10000, 'Опис задовгий (максимум 10000 символів)'],
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Ціна обов\'язкова'],
      default: 0,
      min: [0, 'Ціна не може бути від\'ємною'],
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Кількість не може бути від\'ємною'],
      validate: {
        validator: Number.isInteger,
        message: 'Кількість має бути цілим числом',
      },
    },
    pipeSize: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Індекси під фільтри та сортування каталогу
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
