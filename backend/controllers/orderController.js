import { isObjectIdOrHexString } from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { getNextSequence } from '../models/counterModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import {
  notifyOrderCreated,
  notifyShippingPriceSet,
  notifyOrderShipped,
  notifyOrderCancelled,
} from '../utils/orderEmails.js';
import { PAYMENT_METHODS } from '../constants/orders.js';
import { isNonEmptyString, isValidPhone } from '../utils/validators.js';

const MAX_ORDER_LINES = 50;
const MAX_QTY_PER_LINE = 100;
const ORDER_NUMBER_OFFSET = 1000; // перше замовлення — №1001

const trackingUrl = (trackingNumber) =>
  `https://novaposhta.ua/tracking/?cargo_number=${trackingNumber}`;

const restoreStock = (items) =>
  Promise.all(
    items.map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { countInStock: item.qty } }
      )
    )
  );

// Атомарно списує товари зі складу. Якщо якогось не вистачає —
// повертає вже списане і віддає позицію, на якій зупинились.
const reserveStock = async (items) => {
  const reserved = [];
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.product, countInStock: { $gte: item.qty } },
      { $inc: { countInStock: -item.qty } }
    );
    if (result.modifiedCount === 0) {
      await restoreStock(reserved);
      return item;
    }
    reserved.push(item);
  }
  return null;
};

// Дії менеджера над скасованим замовленням не мають сенсу
const assertNotCancelled = (order, res) => {
  if (order.isCancelled) {
    res.status(400);
    throw new Error('Замовлення скасовано');
  }
};

const optionalString = (value, maxLength) =>
  value === undefined ||
  value === '' ||
  (typeof value === 'string' && value.length <= maxLength);

// Повертає текст помилки або null, якщо адреса коректна
const validateShippingAddress = (address) => {
  if (!address || typeof address !== 'object') return 'Вкажіть дані доставки';
  if (!isValidPhone(address.phone)) return 'Вкажіть коректний номер телефону';
  if (!isNonEmptyString(address.city, 100)) return 'Вкажіть місто';
  if (
    !optionalString(address.novaPoshtaBranch, 200) ||
    !optionalString(address.address, 300) ||
    !optionalString(address.postalCode, 20)
  ) {
    return 'Некоректні дані доставки';
  }
  if (!address.novaPoshtaBranch?.trim() && !address.address?.trim()) {
    return "Вкажіть відділення Нової Пошти або адресу для кур'єра";
  }
  return null;
};

// @desc    Створити замовлення
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error('Відсутні товари в замовленні');
  }
  if (orderItems.length > MAX_ORDER_LINES) {
    res.status(400);
    throw new Error('Забагато позицій у замовленні');
  }

  const shippingError = validateShippingAddress(shippingAddress);
  if (shippingError) {
    res.status(400);
    throw new Error(shippingError);
  }

  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    res.status(400);
    throw new Error('Невідомий спосіб оплати');
  }

  // Об'єднуємо дублікати і перевіряємо кількість
  const qtyById = new Map();
  for (const item of orderItems) {
    const id = item?._id;
    const qty = item?.qty;
    if (!isObjectIdOrHexString(id) || !Number.isInteger(qty) || qty < 1) {
      res.status(400);
      throw new Error('Некоректні товари в замовленні');
    }
    qtyById.set(String(id), (qtyById.get(String(id)) || 0) + qty);
  }

  // Назву, фото і ціну беремо тільки з БД — клієнту не довіряємо
  const itemsFromDB = await Product.find({ _id: { $in: [...qtyById.keys()] } });

  const dbOrderItems = [...qtyById].map(([id, qty]) => {
    const product = itemsFromDB.find((p) => p._id.toString() === id);
    if (!product) {
      res.status(404);
      throw new Error(`Товар не знайдено: ${id}`);
    }
    if (qty > MAX_QTY_PER_LINE || qty > product.countInStock) {
      res.status(400);
      throw new Error(
        `Недостатньо товару «${product.name}» на складі (доступно: ${product.countInStock})`
      );
    }
    return {
      name: product.name,
      qty,
      image: product.image,
      price: product.price,
      product: product._id,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress: {
      phone: shippingAddress.phone.trim(),
      city: shippingAddress.city.trim(),
      novaPoshtaBranch: shippingAddress.novaPoshtaBranch?.trim() || '',
      address: shippingAddress.address?.trim() || '',
      postalCode: shippingAddress.postalCode?.trim() || '',
      country: 'Україна',
    },
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const unavailableItem = await reserveStock(dbOrderItems);
  if (unavailableItem) {
    res.status(400);
    throw new Error(
      `Товар «${unavailableItem.name}» щойно закінчився. Оновіть кошик`
    );
  }

  let createdOrder;
  try {
    order.orderNumber = ORDER_NUMBER_OFFSET + (await getNextSequence('order'));
    createdOrder = await order.save();
  } catch (error) {
    await restoreStock(dbOrderItems);
    throw error;
  }

  notifyOrderCreated(createdOrder, req.user);
  res.status(201).json(createdOrder);
});

// @desc    Отримати замовлення за ID
// @route   GET /api/orders/:id
// @access  Private (власник замовлення або адмін)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  // Чуже замовлення — відповідаємо 404, щоб не розкривати його існування
  const isOwner = order?.user && order.user._id.equals(req.user._id);
  if (order && (isOwner || req.user.isAdmin)) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Замовлення не знайдено');
  }
});

// @desc    Позначити як оплачено (менеджер підтверджує оплату вручну)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    assertNotCancelled(order, res);
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Замовлення не знайдено');
  }
});

// @desc    Позначити як доставлено (адмін)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    assertNotCancelled(order, res);
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Замовлення не знайдено');
  }
});

// @desc    Мої замовлення
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Всі замовлення (адмін)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Менеджер встановлює вартість доставки
// @route   PUT /api/orders/:id/shipping
// @access  Private/Admin
const setShippingPrice = asyncHandler(async (req, res) => {
  const { managerNote } = req.body;
  const shippingPrice = Number(req.body.shippingPrice);

  if (
    req.body.shippingPrice === undefined ||
    req.body.shippingPrice === '' ||
    !Number.isFinite(shippingPrice) ||
    shippingPrice < 0
  ) {
    res.status(400);
    throw new Error('Вкажіть коректну вартість доставки');
  }
  if (!optionalString(managerNote, 500)) {
    res.status(400);
    throw new Error('Нотатка задовга (максимум 500 символів)');
  }

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    assertNotCancelled(order, res);
    order.shippingPrice = shippingPrice;
    order.totalPrice = Number(order.itemsPrice) + shippingPrice;
    order.shippingConfirmed = true;
    if (managerNote) order.managerNote = managerNote;

    const updatedOrder = await order.save();
    notifyShippingPriceSet(updatedOrder);
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Замовлення не знайдено');
  }
});

// @desc    Вказати ТТН Нової Пошти (замовлення відправлено)
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
const setTrackingNumber = asyncHandler(async (req, res) => {
  const trackingNumber =
    typeof req.body.trackingNumber === 'string'
      ? req.body.trackingNumber.replace(/\s/g, '')
      : '';

  if (!/^\d{11,14}$/.test(trackingNumber)) {
    res.status(400);
    throw new Error('ТТН має містити від 11 до 14 цифр');
  }

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Замовлення не знайдено');
  }
  assertNotCancelled(order, res);

  order.trackingNumber = trackingNumber;
  order.shippedAt = Date.now();
  const updatedOrder = await order.save();

  notifyOrderShipped(updatedOrder, trackingUrl(trackingNumber));
  res.json(updatedOrder);
});

// @desc    Скасувати замовлення і повернути товари на склад
// @route   PUT /api/orders/:id/cancel
// @access  Private/Admin
const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!optionalString(reason, 500)) {
    res.status(400);
    throw new Error('Причина задовга (максимум 500 символів)');
  }

  // Атомарна умова — повторне скасування не поверне товар на склад двічі
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, isCancelled: false, isDelivered: false },
    {
      $set: {
        isCancelled: true,
        cancelledAt: new Date(),
        cancelReason: reason?.trim() || '',
      },
    },
    { new: true }
  ).populate('user', 'name email');

  if (!order) {
    const exists = await Order.exists({ _id: req.params.id });
    res.status(exists ? 400 : 404);
    throw new Error(
      exists
        ? 'Замовлення вже скасоване або доставлене'
        : 'Замовлення не знайдено'
    );
  }

  await restoreStock(order.orderItems);
  notifyOrderCancelled(order);
  res.json(order);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  setShippingPrice,
  setTrackingNumber,
  cancelOrder,
};
