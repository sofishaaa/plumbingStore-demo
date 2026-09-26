import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import CATEGORIES from '../constants/categories.js';
import { escapeRegex } from '../utils/validators.js';

// Значення з query-рядка: лише непорожній рядок обмеженої довжини
const queryString = (value, maxLength = 100) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : null;

const queryNumber = (value) => {
  const number = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(number)
    ? number
    : null;
};

// @desc    Отримати всі товари з розширеними фільтрами
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT) || 8;
  const page = Math.max(1, Math.floor(queryNumber(req.query.pageNumber) || 1));

  const keyword = queryString(req.query.keyword);
  const category = queryString(req.query.category);
  const brand = queryString(req.query.brand);
  const pipeSize = queryString(req.query.pipeSize);
  const minPrice = queryNumber(req.query.minPrice);
  const maxPrice = queryNumber(req.query.maxPrice);
  const minRating = queryNumber(req.query.minRating);
  const { inStock, sortBy } = req.query;

  const filter = {};

  if (keyword) {
    const pattern = escapeRegex(keyword);
    filter.$or = [
      { name: { $regex: pattern, $options: 'i' } },
      { category: { $regex: pattern, $options: 'i' } },
      { brand: { $regex: pattern, $options: 'i' } },
      { description: { $regex: pattern, $options: 'i' } },
    ];
  }
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice !== null || maxPrice !== null) {
    filter.price = {};
    if (minPrice !== null) filter.price.$gte = minPrice;
    if (maxPrice !== null) filter.price.$lte = maxPrice;
  }
  if (minRating !== null) filter.rating = { $gte: minRating };
  if (inStock === 'true') filter.countInStock = { $gt: 0 };
  if (pipeSize) filter.pipeSize = pipeSize;

  const sortOptions = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1 },
  };
  const sort = Object.hasOwn(sortOptions, sortBy)
    ? sortOptions[sortBy]
    : { createdAt: -1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Отримати доступні варіанти фільтрів
// @route   GET /api/products/filter-options
// @access  Public
const getFilterOptions = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand');
  const pipeSizes = await Product.distinct('pipeSize', { pipeSize: { $ne: '' } });

  res.json({
    brands: brands.sort(),
    categories: CATEGORIES,
    pipeSizes: pipeSizes.sort(),
  });
});

// @desc    Отримати один товар за ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  }
  res.status(404);
  throw new Error('Товар не знайдено');
});

// @desc    Створити товар (заготовка)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Назва товару',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Бренд',
    category: 'Інше',
    countInStock: 0,
    numReviews: 0,
    description: 'Опис товару',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Оновити товар
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Оновлюємо лише передані поля; валідацію виконує схема
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (countInStock !== undefined) product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Товар не знайдено');
  }
});

// @desc    Видалити товар
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Товар видалено' });
  } else {
    res.status(404);
    throw new Error('Товар не знайдено');
  }
});

// @desc    Додати відгук до товару
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const rating = Number(req.body.rating);
  const { comment } = req.body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Оберіть оцінку від 1 до 5');
  }
  if (typeof comment !== 'string' || !comment.trim()) {
    res.status(400);
    throw new Error('Напишіть коментар до відгуку');
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Ви вже залишили відгук на цей товар');
    }

    const review = {
      name: req.user.name,
      rating,
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Відгук додано' });
  } else {
    res.status(404);
    throw new Error('Товар не знайдено');
  }
});

// @desc    Топ-3 товари за рейтингом (для каруселі)
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProducts,
  getFilterOptions,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
