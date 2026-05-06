import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Адміністратор',
    email: 'admin@santexstudio.ua',
    password: bcrypt.hashSync('admin123', 10),
    isAdmin: true,
  },
  {
    name: 'Іван Коваленко',
    email: 'ivan@example.com',
    password: bcrypt.hashSync('password123', 10),
    isAdmin: false,
  },
  {
    name: 'Олена Мороз',
    email: 'olena@example.com',
    password: bcrypt.hashSync('password123', 10),
    isAdmin: false,
  },
];

const products = [
  {
    name: 'Рушникосушка 1185x530 Marlin Terma',
    image: '/images/Terma-Marlin.png',
    description:
      'Комбінована рушникосушка Terma Marlin польського виробництва є практичним рішенням для облаштування ванної кімнати. Вона поєднує водяне та електричне підключення, що забезпечує гнучкість у використанні. Монтаж пристрою не є складним, проте його доцільно доручити фахівцю. Прилад швидко нагрівається та може виконувати функцію додаткового обігріву.',
    brand: 'TERMA',
    category: 'Рушникосушки',
    price: 12948,
    countInStock: 10,
    rating: 4.9,
    numReviews: 12,
  },
  {
    name: 'Рушникосушка Fiona One 900х430 Terma',
    image: '/images/Terma-Fiona.png',
    description:
      'Електрична рушникосушка Terma Fiona One 900×430 є практичним і функціональним рішенням для ванної кімнати. Вона поєднує сучасний вигляд із продуманою конструкцією. Перемички згруповані таким чином, щоб між ними залишалося достатньо простору для зручного сушіння рушників. Прилад підтримує два режими роботи.',
    brand: 'TERMA',
    category: 'Рушникосушки',
    price: 13416,
    countInStock: 7,
    rating: 5.0,
    numReviews: 8,
  },
  {
    name: 'Унітаз Grohe Bau Ceramic настінного монтажу з кришкою',
    image: '/images/Groe-Bau-Ceramic.png',
    description:
      'Унітаз Grohe Bau Ceramic для настінного монтажу з кришкою є сучасним рішенням для ванної кімнати та призначений для встановлення з інсталяційною системою. Безободкова конструкція спрощує догляд і підвищує гігієнічність. Передбачено економне використання води з об\'ємом змиву 3/5 л.',
    brand: 'Grohe',
    category: 'Унітази',
    price: 15066,
    countInStock: 5,
    rating: 5.0,
    numReviews: 12,
  },
  {
    name: 'Інсталяція для унітаза Grohe Rapid SL',
    image: '/images/Grohe-Rapid-SL.png',
    description:
      'Інсталяція для унітаза Grohe Rapid SL є надійним і сучасним рішенням для облаштування стильного санвузла. Ключовою особливістю є система швидкого монтажу GROHE QuickFix, яка значно скорочує час встановлення. Конструкція відзначається продуманістю та міцністю.',
    brand: 'Grohe',
    category: 'Інсталяції та кнопки зливу',
    price: 6599,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  },
  {
    name: 'Змішувач для умивальника MOZA BLACK KFA ARMATURA',
    image: '/images/KFAARMATURA-MOZA-BLACK.png',
    description:
      'Змішувач для умивальника KFA Armatura Moza Black виконаний у мінімалістичному дизайні з матовим чорним покриттям. Оснащений одноважільним керуванням та надійним керамічним картриджем. Вбудований аератор зменшує витрату води до 5 л/хв, забезпечуючи економне використання без втрати комфорту.',
    brand: 'KFA Armatura',
    category: 'Змішувачі',
    price: 7020,
    countInStock: 7,
    rating: 4.9,
    numReviews: 10,
  },
  {
    name: 'Тумба Aqua Rodos Вінтаж консольна з умивальником Frame 100 см',
    image: '/images/AquaRodos-Frame100.png',
    description:
      'Aqua Rodos — провідний виробник меблів для ванної кімнати. Консольна тумба Вінтаж з умивальником Frame у кольорі севілья має натуральний вигляд, два місткі ящики та гармонійно доповнює інтер\'єр. Виготовлена з екологічних матеріалів.',
    brand: 'Aqua Rodos',
    category: 'Тумби',
    price: 18712,
    countInStock: 0,
    rating: 4.8,
    numReviews: 12,
  },
  {
    name: 'Змішувач для душу Hansgrohe Vernis Blend хром',
    image: '/images/sample.jpg',
    description:
      'Hansgrohe Vernis Blend — однорукоятковий термостатичний змішувач для душу з хромованим покриттям. Забезпечує точний контроль температури та витрати води. Сучасний дизайн органічно вписується в будь-який інтер\'єр ванної кімнати.',
    brand: 'Hansgrohe',
    category: 'Змішувачі',
    price: 8950,
    countInStock: 4,
    rating: 4.7,
    numReviews: 6,
  },
  {
    name: 'Ванна акрилова Cersanit Zen 170x75 біла',
    image: '/images/sample.jpg',
    description:
      'Акрилова ванна Cersanit Zen прямокутної форми з розмірами 170x75 см. Виготовлена з міцного санітарного акрилу, стійкого до механічних пошкоджень та засобів для чищення. Ергономічна форма забезпечує максимальний комфорт.',
    brand: 'Cersanit',
    category: 'Ванни',
    price: 9800,
    countInStock: 3,
    rating: 4.6,
    numReviews: 9,
  },
];

export { users, products };
