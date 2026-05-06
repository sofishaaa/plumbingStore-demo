import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
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
    },
    image: {
      type: String,
      required: [true, 'Зображення товару обов\'язкове'],
    },
    brand: {
      type: String,
      required: [true, 'Бренд обов\'язковий'],
    },
    // Категорії сантехніки
    category: {
      type: String,
      required: [true, 'Категорія обов\'язкова'],
      enum: [
        'Рушникосушки',
        'Унітази',
        'Інсталяції та кнопки зливу',
        'Змішувачі',
        'Тумби',
        'Душові кабіни',
        'Ванни',
        'Радіатори',
        'Аксесуари',
        'Інше',
      ],
    },
    description: {
      type: String,
      required: [true, 'Опис товару обов\'язковий'],
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
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    pipeSize: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
