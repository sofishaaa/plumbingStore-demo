const notFound = (req, res, next) => {
  const error = new Error(`Не знайдено — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Статус, явно встановлений контролером через res.status(...)
  const explicitStatus = res.statusCode !== 200;
  let statusCode = explicitStatus
    ? res.statusCode
    : err.statusCode || err.status || 500;
  let message = err.message;

  // Помилка MongoDB — невалідний ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Ресурс не знайдено';
  }

  // Помилки валідації схеми Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
  }

  // Порушення унікального індексу (наприклад, email вже зайнятий)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Запис з такими даними вже існує';
  }

  if (err.type === 'entity.parse.failed') {
    message = 'Некоректний JSON у запиті';
  }

  const isProduction = process.env.NODE_ENV === 'production';

  // Непередбачені помилки логуємо, але не показуємо деталі клієнту в продакшні
  if (statusCode >= 500) {
    console.error(err);
    if (isProduction && !explicitStatus) message = 'Внутрішня помилка сервера';
  }

  res.status(statusCode).json({
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export { notFound, errorHandler };
