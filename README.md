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
├── .env
└── package.json
```

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
