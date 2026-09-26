import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import validateEnv from './config/env.js';
import connectDB, { closeDB } from './config/db.js';
import { UPLOADS_DIR } from './config/paths.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import sanitizeInput from './middleware/sanitizeMiddleware.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';
import { robotsTxt, sitemapXml, createIndexRenderer } from './utils/seo.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
validateEnv();
connectDB();

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const port = process.env.PORT || 5000;

// За reverse proxy (Nginx, Render, Railway, Heroku) — щоб коректно
// визначались IP клієнтів (rate limit) та HTTPS. Кількість проксі перед додатком.
app.set('trust proxy', Number(process.env.TRUST_PROXY ?? (isProduction ? 1 : 0)));

// Простий парсер query: ?brand[$ne]=x не перетвориться на об'єкт
app.set('query parser', 'simple');

// Заголовки безпеки (CSP, HSTS, X-Frame-Options, nosniff тощо)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
    strictTransportSecurity: isProduction,
  })
);
app.use(compression());

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(cookieParser());
app.use(sanitizeInput);

// CORS потрібен лише якщо фронтенд розміщено на іншому домені.
// У стандартному деплої Express сам віддає фронтенд (той самий origin),
// а в розробці запити йдуть через proxy CRA — тож за замовчуванням вимкнено.
if (process.env.CORS_ORIGIN) {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    })
  );
}

// Healthcheck для хостингу / моніторингу аптайму
app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({ status: dbReady ? 'ok' : 'db-unavailable' });
});

// API Routes
app.use('/api', apiLimiter);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Зображення, завантажені через адмінку
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '30d', index: false }));

// SEO: карта сайту для пошукових систем
app.get('/robots.txt', robotsTxt);
app.get('/sitemap.xml', sitemapXml);

// Статичні файли (продакшн)
if (isProduction) {
  const buildDir = path.resolve('frontend', 'build');

  app.use(
    express.static(buildDir, {
      index: false,
      setHeaders: (res, filePath) => {
        // Файли з хешем в імені (build/static) можна кешувати назавжди
        if (filePath.includes(`${path.sep}static${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    })
  );

  // SPA fallback для всіх маршрутів, крім /api і /uploads.
  // HTML рендериться з meta-тегами сторінки (title, description, Open Graph)
  const renderIndex = createIndexRenderer(path.join(buildDir, 'index.html'));
  app.get(/^\/(?!api(\/|$)|uploads(\/|$)).*/, async (req, res, next) => {
    try {
      const html = await renderIndex(req);
      res.setHeader('Cache-Control', 'no-cache');
      res.type('html').send(html);
    } catch (error) {
      next(error);
    }
  });
} else {
  app.get('/', (req, res) => {
    res.send('🚿 Сантех Студія API запущено...');
  });
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(
    `🚿 Сервер Сантех Студія запущено на порту ${port} (${process.env.NODE_ENV})`
  );
});

// Коректна зупинка: хостинг надсилає SIGTERM під час деплою/рестарту
const shutdown = (signal) => {
  console.log(`${signal} отримано, зупиняємо сервер...`);
  server.close(async () => {
    await closeDB();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
