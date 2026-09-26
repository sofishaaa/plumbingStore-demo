// Дані магазину: футер, юридичні сторінки, реквізити для оплати.
//
// ⚠️ ЗАПОВНІТЬ ПОРОЖНІ ПОЛЯ ПЕРЕД ЗАПУСКОМ.
// Закон України «Про електронну комерцію» (ст. 7) вимагає, щоб продавець
// вказав на сайті повне найменування, код (РНОКПП або ЄДРПОУ),
// місцезнаходження та email. Поки поля порожні, на юридичних сторінках
// показується попередження.
const SHOP = {
  name: 'Сантех Студія',

  // Напр. «ФОП Іваненко Іван Іванович» або «ТОВ "Сантех Студія"»
  legalName: '',
  // РНОКПП (ІПН) для ФОП або код ЄДРПОУ для юридичної особи
  taxId: '',
  // Адреса реєстрації (місцезнаходження) продавця
  legalAddress: '',

  address: 'м. Львів, вул. Городоцька 226а (ЖК Resident Hall)',
  mapUrl: 'https://maps.app.goo.gl/SzXuYMQzzZmH7tqz7',
  phone: '+38 (067) 802-94-39',
  phoneHref: '+380678029439',
  email: '',
  // Напр. «Пн–Пт 9:00–18:00, Сб 10:00–15:00»
  workingHours: '',

  // Реквізити для оплати банківським переказом (показуються на сторінці замовлення)
  bank: {
    recipient: '',
    iban: '',
    bankName: '',
  },

  // Дата поточної редакції оферти та політики конфіденційності
  legalRevisionDate: '26.09.2026',
};

export const isSellerInfoComplete = Boolean(
  SHOP.legalName && SHOP.taxId && SHOP.legalAddress && SHOP.email
);

export const isBankInfoComplete = Boolean(SHOP.bank.recipient && SHOP.bank.iban);

export default SHOP;
