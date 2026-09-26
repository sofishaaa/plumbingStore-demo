# 🚿 Інтернет-магазин сантехніки

MERN stack: MongoDB · Express · React · Node.js  
Redux Toolkit + RTK Query · Bootstrap 5 · JWT Auth

---

## 📁 Структура проекту

```
plumbingStore/
├── backend/                  ← Node.js + Express API
│   ├── config/db.js
│   ├── controllers/
│   ├── data/                 ← seed дані
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seeder.js
│   └── server.js
├── frontend/                 ← React додаток
│   ├── public/
│   │   └── images/           ← зображення товарів
│   └── src/
│       ├── assets/styles/
│       ├── components/
│       ├── screens/
│       │   └── admin/
│       ├── slices/           ← Redux + RTK Query
│       ├── utils/
│       ├── App.js
│       ├── constants.js
│       ├── index.js
│       └── store.js
├── uploads/                  ← зображення з адмінки (не в git)
├── .env.example              ← шаблон змінних оточення
└── package.json
```

## 🛠️ Локальний запуск

```bash
cp .env.example .env          # заповніть MONGO_URI і JWT_SECRET
npm install && npm install --prefix frontend
npm run data:import           # демо-дані (адмін: admin@santexstudio.ua / admin123)
npm run dev                   # API :5001 + React :3000
```

---

## 🚀 Деплой (production)

Потрібно: Node.js ≥ 20, MongoDB (рекомендовано MongoDB Atlas), HTTPS на хостингу.

1. **Змінні оточення** на хостингу (див. `.env.example`):
   `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET` (≥ 32 символи), `CLIENT_URL` (адреса сайту),
   `SMTP_*`, `FROM_EMAIL`. Без обов'язкових змінних сервер не стартує.
2. **Build:** `npm run build` · **Start:** `npm start` · **Healthcheck:** `GET /api/health`
3. **Перше наповнення БД** (одноразово, ВИДАЛЯЄ всі дані):
   `SEED_ADMIN_PASSWORD=<надійний пароль> npm run data:import -- --force`
4. **Зображення з адмінки** зберігаються в `UPLOADS_DIR` (за замовчуванням `./uploads`).
   На Render / Railway / Heroku диск ефемерний — підключіть постійний диск і вкажіть шлях до нього
   (або перенесіть зберігання в Cloudinary / S3).
5. **MongoDB Atlas:** окремий користувач БД лише з правами на цю базу, увімкнені бекапи,
   Network Access — лише IP сервера, якщо хостинг дає статичний IP.

### Безпека (що вже налаштовано)

- Заголовки безпеки через `helmet` (CSP, HSTS, X-Frame-Options, nosniff)
- Rate limiting: вхід (10 невдалих спроб / 15 хв), реєстрація, скидання пароля, загальний ліміт API
- Захист від NoSQL-ін'єкцій і ReDoS у пошуку, валідація всіх вхідних даних
- JWT в HttpOnly + Secure + SameSite=Strict cookie; після зміни пароля старі сесії недійсні
- Замовлення бачить лише власник або адмін; оплату/доставку позначає лише адмін
- Завантаження файлів — лише адмін, до 5 МБ, тільки jpg/png/webp з перевіркою сигнатури
- Сідер не запуститься в production без `--force`

## 🗺️ Маршрути

### Публічні
| URL | Опис |
|-----|------|
| `/` | Головна — список товарів + карусель |
| `/product/:id` | Сторінка товару |
| `/cart` | Кошик |
| `/login` | Вхід |
| `/register` | Реєстрація |
| `/search/:keyword` | Пошук |
| `/page/:pageNumber` | Пагінація |

### Авторизовані користувачі
| URL | Опис |
|-----|------|
| `/profile` | Профіль + історія замовлень |
| `/shipping` | Адреса доставки |
| `/payment` | Спосіб оплати |
| `/placeorder` | Підтвердження замовлення |
| `/order/:id` | Деталі замовлення |

### Адмін панель
| URL | Опис |
|-----|------|
| `/admin/orderlist` | Всі замовлення (+ встановлення доставки НП) |
| `/admin/productlist` | Управління товарами |
| `/admin/product/:id/edit` | Редагування товару |
| `/admin/userlist` | Управління користувачами |
| `/admin/user/:id/edit` | Редагування користувача |

---

## 🚚 Логіка доставки Новою Поштою

1. Клієнт оформлює замовлення → доставка = 0 грн
2. Клієнт бачить суму **тільки за товари**
3. Менеджер в `/admin/orderlist` натискає **"Вказати"** навпроти замовлення
4. Вводить суму доставки + нотатку (наприклад: "НП відділення №5, Львів")
5. Клієнт бачить оновлену суму на сторінці замовлення

---

## 💳 Способи оплати

- **Накладений платіж НП** — клієнт платить при отриманні
- **Банківський переказ** — менеджер надсилає реквізити

---

## 📦 API ендпоінти

### Товари
```
GET    /api/products              — список (з пошуком і пагінацією)
GET    /api/products/top          — топ-3 для каруселі
GET    /api/products/:id          — один товар
POST   /api/products              — створити (адмін)
PUT    /api/products/:id          — оновити (адмін)
DELETE /api/products/:id          — видалити (адмін)
POST   /api/products/:id/reviews  — додати відгук
```

### Користувачі
```
POST   /api/users                 — реєстрація
POST   /api/users/login           — вхід
POST   /api/users/logout          — вихід
GET    /api/users/profile         — мій профіль
PUT    /api/users/profile         — оновити профіль
GET    /api/users                 — всі юзери (адмін)
GET    /api/users/:id             — юзер за id (адмін)
PUT    /api/users/:id             — оновити юзера (адмін)
DELETE /api/users/:id             — видалити юзера (адмін)
POST   /api/users/forgot-password — запит на скидання пароля
POST   /api/users/reset-password/:token — новий пароль
```

### Інше
```
POST   /api/upload                — завантажити зображення (адмін)
GET    /api/health                — стан сервера і БД
```

### Замовлення
```
POST   /api/orders                — створити замовлення
GET    /api/orders                — всі замовлення (адмін)
GET    /api/orders/myorders       — мої замовлення
GET    /api/orders/:id            — замовлення за id
PUT    /api/orders/:id/pay        — позначити як оплачено (адмін)
PUT    /api/orders/:id/deliver    — позначити як доставлено (адмін)
PUT    /api/orders/:id/shipping   — встановити доставку НП (адмін)
```
