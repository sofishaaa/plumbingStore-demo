// Короткий номер замовлення (№1001); для старих замовлень без номера — ID
export const orderLabel = (order) =>
  order.orderNumber ? `№${order.orderNumber}` : `#${order._id}`;

export const trackingUrl = (trackingNumber) =>
  `https://novaposhta.ua/tracking/?cargo_number=${trackingNumber}`;
