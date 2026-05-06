# 🚿 Сантех Студія — Інтернет-магазин сантехніки

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
├── .env.example
└── package.json
```

---

## ⚡ Встановлення

### Крок 1 — Копіюй файли в своє репо

Скопіюй вміст архіву в корінь свого репо `plumbingStore-demo/`.

> ⚠️ Файли які **замінять** твої існуючі:
> - `frontend/src/App.js`
> - `frontend/src/index.js`
> - `frontend/src/components/Header.jsx`
> - `frontend/src/components/Footer.jsx`
> - `frontend/src/components/Product.jsx`
> - `frontend/src/components/Rating.jsx`
> - `frontend/src/screens/HomeScreen.jsx`
> - `frontend/src/screens/ProductScreen.jsx`
> - `frontend/package.json`
>
> Файли які **додадуться** нові (не торкнуться твоїх):
> - Вся папка `backend/`
> - `frontend/src/slices/`
> - `frontend/src/screens/CartScreen.jsx` та інші
> - `frontend/src/screens/admin/`
> - `frontend/src/utils/cartUtils.js`
> - `frontend/src/store.js`, `constants.js`
> - `package.json` (кореневий)

---

### Крок 2 — Створи .env файл

В корені проекту (поряд з `package.json`) створи файл `.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<твій_юзер>:<твій_пароль>@cluster.mongodb.net/plumbingstore
JWT_SECRET=будь_який_довгий_рядок_символів_мінімум_32
PAGINATION_LIMIT=8
```

**Де взяти MONGO_URI:**
1. Зайди на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Створи безкоштовний кластер (M0 Free)
3. Database Access → створи юзера з паролем
4. Network Access → додай `0.0.0.0/0`
5. Connect → Drivers → скопіюй рядок підключення

---

### Крок 3 — Встанови залежності

```bash
# В корені проекту (встановить backend залежності)
npm install

# Встанови frontend залежності
cd frontend
npm install
cd ..
```

---

### Крок 4 — Завантаж тестові дані (опційно)

```bash
# Завантажити 8 товарів + 3 тестових юзери
npm run data:import

# Якщо хочеш очистити БД
npm run data:destroy
```

**Тестові акаунти після імпорту:**
| Email | Пароль | Роль |
|-------|--------|------|
| admin@santexstudio.ua | admin123 | Адмін |
| ivan@example.com | password123 | Клієнт |
| olena@example.com | password123 | Клієнт |

---

### Крок 5 — Запуск

```bash
# Запустити backend + frontend одночасно
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

```bash
# Тільки backend
npm run server

# Тільки frontend
npm run client
```

---

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

1. Клієнт оформляє замовлення → доставка = 0 грн
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
```

### Замовлення
```
POST   /api/orders                — створити замовлення
GET    /api/orders                — всі замовлення (адмін)
GET    /api/orders/myorders       — мої замовлення
GET    /api/orders/:id            — замовлення за id
PUT    /api/orders/:id/pay        — позначити як оплачено
PUT    /api/orders/:id/deliver    — позначити як доставлено (адмін)
PUT    /api/orders/:id/shipping   — встановити доставку НП (адмін)
```

### Завантаження
```
POST   /api/upload                — завантажити зображення
```

---

## 🐛 Часті помилки

**`Cannot find module 'colors'`**
```bash
npm install colors
```

**`CORS error` на localhost**
Перевір що в `frontend/package.json` є:
```json
"proxy": "http://localhost:5000"
```

**MongoDB connection failed**
- Перевір MONGO_URI в `.env`
- Перевір Network Access в Atlas (має бути `0.0.0.0/0`)
- Перевір правильність пароля юзера БД

**`jwt malformed`**
Очисти localStorage в браузері (DevTools → Application → Local Storage → Clear)
