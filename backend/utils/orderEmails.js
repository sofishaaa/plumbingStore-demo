import sendEmail from './sendEmail.js';
import escapeHtml from './escapeHtml.js';

// Сповіщення про замовлення. Надсилаються у фоні: якщо пошта недоступна,
// замовлення все одно оформлюється, а помилка лише пишеться в лог.

const isEmailConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.FROM_EMAIL);

const shopName = () => process.env.FROM_NAME || 'Сантех Студія';
const siteUrl = () => (process.env.CLIENT_URL || '').replace(/\/$/, '');
const orderUrl = (order) => `${siteUrl()}/order/${order._id}`;
const money = (value) => `${Number(value).toLocaleString('uk-UA')} грн`;

const orderLabel = (order) =>
  order.orderNumber ? `№${order.orderNumber}` : `#${order._id}`;

const layout = (title, body) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:8px;color:#373D43">
    <h2 style="color:#8C52FE;margin:0 0 16px">${escapeHtml(shopName())}</h2>
    <h3 style="margin:0 0 16px">${title}</h3>
    ${body}
  </div>
`;

const button = (url, text) => `
  <a href="${escapeHtml(url)}"
     style="display:inline-block;margin:16px 0;padding:12px 24px;background:#8C52FE;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">
    ${text}
  </a>
`;

const itemsTable = (order) => `
  <table style="width:100%;border-collapse:collapse;margin:12px 0">
    ${order.orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding:6px 0;border-bottom:1px solid #f0f0f0">${escapeHtml(item.name)}</td>
        <td style="padding:6px 0;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap">
          ${item.qty} × ${money(item.price)}
        </td>
      </tr>`
      )
      .join('')}
  </table>
`;

const totals = (order) => `
  <p style="margin:4px 0">Товари: <strong>${money(order.itemsPrice)}</strong></p>
  <p style="margin:4px 0">Доставка: <strong>${
    order.shippingConfirmed ? money(order.shippingPrice) : 'уточнюється менеджером'
  }</strong></p>
  <p style="margin:4px 0">Разом: <strong>${money(order.totalPrice)}</strong></p>
`;

const deliveryBlock = (order) => {
  const a = order.shippingAddress;
  return `
    <p style="margin:4px 0">Телефон: ${escapeHtml(a.phone)}</p>
    <p style="margin:4px 0">Місто: ${escapeHtml(a.city)}</p>
    ${a.novaPoshtaBranch ? `<p style="margin:4px 0">Відділення НП: ${escapeHtml(a.novaPoshtaBranch)}</p>` : ''}
    ${a.address ? `<p style="margin:4px 0">Адреса: ${escapeHtml(a.address)}</p>` : ''}
    <p style="margin:4px 0">Оплата: ${escapeHtml(order.paymentMethod)}</p>
  `;
};

const send = (message) => {
  if (!isEmailConfigured() || !message.to) return;
  sendEmail(message).catch((error) =>
    console.error(`Не вдалося надіслати лист «${message.subject}»:`, error.message)
  );
};

// Нове замовлення: підтвердження клієнту + сповіщення менеджеру
const notifyOrderCreated = (order, customer) => {
  const label = orderLabel(order);

  send({
    to: customer.email,
    subject: `Замовлення ${label} прийнято — ${shopName()}`,
    html: layout(
      `Дякуємо за замовлення ${label}!`,
      `
      <p>Менеджер зв'яжеться з вами, щоб підтвердити замовлення та розрахувати вартість доставки.</p>
      ${itemsTable(order)}
      ${totals(order)}
      ${button(orderUrl(order), 'Переглянути замовлення')}
      `
    ),
  });

  send({
    to: process.env.ORDER_NOTIFY_EMAIL,
    subject: `Нове замовлення ${label} на ${money(order.itemsPrice)}`,
    html: layout(
      `Нове замовлення ${label}`,
      `
      <p style="margin:4px 0">Клієнт: ${escapeHtml(customer.name)} (${escapeHtml(customer.email)})</p>
      ${deliveryBlock(order)}
      ${itemsTable(order)}
      ${totals(order)}
      ${button(orderUrl(order), 'Відкрити в адмінці')}
      `
    ),
  });
};

// Менеджер розрахував доставку — клієнт дізнається остаточну суму
const notifyShippingPriceSet = (order) => {
  send({
    to: order.user?.email,
    subject: `Замовлення ${orderLabel(order)}: вартість доставки розраховано`,
    html: layout(
      `Замовлення ${orderLabel(order)} підтверджено`,
      `
      ${totals(order)}
      ${order.managerNote ? `<p>Коментар менеджера: ${escapeHtml(order.managerNote)}</p>` : ''}
      ${button(orderUrl(order), 'Переглянути замовлення')}
      `
    ),
  });
};

const notifyOrderShipped = (order, trackingUrl) => {
  send({
    to: order.user?.email,
    subject: `Замовлення ${orderLabel(order)} відправлено`,
    html: layout(
      `Замовлення ${orderLabel(order)} відправлено Новою Поштою`,
      `
      <p>Номер ТТН: <strong>${escapeHtml(order.trackingNumber)}</strong></p>
      ${button(trackingUrl, 'Відстежити посилку')}
      <p><a href="${escapeHtml(orderUrl(order))}">Деталі замовлення</a></p>
      `
    ),
  });
};

const notifyOrderCancelled = (order) => {
  send({
    to: order.user?.email,
    subject: `Замовлення ${orderLabel(order)} скасовано`,
    html: layout(
      `Замовлення ${orderLabel(order)} скасовано`,
      `
      ${order.cancelReason ? `<p>Причина: ${escapeHtml(order.cancelReason)}</p>` : ''}
      <p>Якщо у вас є питання — зв'яжіться з нами у відповідь на цей лист.</p>
      `
    ),
  });
};

export {
  notifyOrderCreated,
  notifyShippingPriceSet,
  notifyOrderShipped,
  notifyOrderCancelled,
};
