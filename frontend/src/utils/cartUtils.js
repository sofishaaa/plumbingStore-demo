// Округлення до цілого (гривні без копійок)
const round = (num) => Math.round(num);

export const updateCart = (state) => {
  // Сума товарів
  state.itemsPrice = round(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Доставка = 0, розраховується менеджером після замовлення
  state.shippingPrice = 0;

  // ПДВ не застосовується
  state.taxPrice = 0;

  // Загальна сума = тільки товари
  state.totalPrice = state.itemsPrice;

  // Зберігаємо в localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
