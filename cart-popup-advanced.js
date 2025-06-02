document.addEventListener('DOMContentLoaded', () => {
  const cartButton = document.createElement('button');
  cartButton.id = 'cart-icon';
  cartButton.innerHTML = '🛒<span id="cart-count" class="badge-count">0</span>';
  cartButton.onclick = () => window.location.href = 'cart.html';
  document.body.appendChild(cartButton);

  updateCartIcon();

  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') updateCartIcon();
  });

  function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline' : 'none';
    }
  }

  window.addToCart = function(name, article, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.name === name && item.article === article);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, article, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
  };

  window.removeFromCart = function(name, article) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.name === name && item.article === article));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    renderCartItems();
  };

  window.changeQuantity = function(name, article, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.name === name && i.article === article);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => !(i.name === name && i.article === article));
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartIcon();
      renderCartItems();
    }
  };

  window.renderCartItems = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    if (!container || !totalEl) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      container.innerHTML = '<p>Корзина пуста</p>';
      totalEl.textContent = '';
      return;
    }

    cart.forEach(item => {
      const price = item.price && item.price !== '—' ? parseFloat(item.price.replace(',', '.')) : null;
      const subtotal = price ? price * item.quantity : 0;
      if (subtotal) total += subtotal;

      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p><strong>Артикул:</strong> ${item.article}</p>
        <p><strong>Количество:</strong></p>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQuantity('${item.name}','${item.article}', -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity('${item.name}','${item.article}', 1)">+</button>
        </div>
        <p><strong>Цена:</strong> ${item.price}</p>
        <p><strong>Сумма:</strong> ${price ? subtotal.toFixed(2) + ' ₽' : 'Цена будет уточнена при звонке менеджера'}</p>
        <button class="btn" onclick="removeFromCart('${item.name}','${item.article}')">Удалить</button>
      `;
      container.appendChild(div);
    });

    totalEl.textContent = 'Общая сумма: ' + total.toFixed(2) + ' ₽';
  };
});
