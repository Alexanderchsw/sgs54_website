document.addEventListener('DOMContentLoaded', () => {
  const popup = document.createElement('div');
  popup.id = 'cart-popup';
  popup.innerHTML = `
    <div class="cart-popup-content">
      <h4>Корзина</h4>
      <div id="cart-popup-items"></div>
      <div class="cart-popup-footer">
        <strong id="cart-popup-total"></strong><br/>
        <a href="cart.html" class="btn small-btn">Перейти к оформлению</a>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  updateCartPopup();

  // Обновлять мини-корзину при изменении в localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') updateCartPopup();
  });

  function updateCartPopup() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-popup-items');
    const totalBox = document.getElementById('cart-popup-total');

    if (!container || !totalBox) return;

    if (cart.length === 0) {
      container.innerHTML = '<p>Пусто</p>';
      totalBox.textContent = '';
      return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const price = item.price && item.price !== '—' ? parseFloat(item.price.replace(',', '.')) : null;
      const subtotal = price ? price * item.quantity : null;
      if (subtotal) total += subtotal;

      const el = document.createElement('div');
      el.className = 'cart-popup-item';
      el.innerHTML = `
        <span>${item.name} x ${item.quantity}</span>
        <button onclick="removeFromCart('${item.name}', '${item.article}')">×</button>
      `;
      container.appendChild(el);
    });

    totalBox.textContent = 'Сумма: ' + (total ? total.toFixed(2) + ' ₽' : 'уточняется');
  }

  window.removeFromCart = function(name, article) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.name === name && item.article === article));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartPopup();
  };
});
