function calcPrices(orderItems) {
  // Вартість товарів (ціле число, гривні)
  const itemsPrice = Math.round(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Доставка Новою Поштою — розраховується менеджером після замовлення.
  // У системі зберігається 0 до моменту підтвердження менеджером.
  const shippingPrice = 0;

  // ПДВ не застосовується
  const taxPrice = 0;

  // Загальна сума = тільки товари (доставка додається менеджером)
  const totalPrice = itemsPrice;

  return {
    itemsPrice: itemsPrice.toString(),
    shippingPrice: shippingPrice.toString(),
    taxPrice: taxPrice.toString(),
    totalPrice: totalPrice.toString(),
  };
}

export { calcPrices };
