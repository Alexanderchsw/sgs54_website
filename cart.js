
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const confirmation = document.getElementById('confirmation');
  const checkoutBtn = document.getElementById('checkout-btn');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Ваша корзина пуста.</p>';
      cartTotal.textContent = '';
      checkoutBtn.style.display = 'none';
      return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
      const price = item.price && item.price !== '—' ? parseFloat(item.price.replace(',', '.')) : null;
      const subtotal = price ? price * item.quantity : null;
      if (subtotal) total += subtotal;

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p><strong>Артикул:</strong> ${item.article}</p>
        <p><strong>Количество:</strong> ${item.quantity}</p>
        <p><strong>Цена:</strong> ${item.price || 'Уточните по телефону'}</p>
        <p><strong>Сумма:</strong> ${subtotal ? subtotal.toFixed(2) + ' ₽' : '—'}</p>
      `;
      cartItemsContainer.appendChild(card);
    });

    cartTotal.textContent = 'Общая сумма: ' + (total ? total.toFixed(2) + ' ₽' : 'Уточняется по телефону');
  }

  checkoutBtn.addEventListener('click', () => {
    // Отправка на почту через скрытую форму
    fetch('send-form.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({cart})
    }).then(() => {
      confirmation.style.display = 'block';
      cartItemsContainer.innerHTML = '';
      cartTotal.textContent = '';
      checkoutBtn.style.display = 'none';
      localStorage.removeItem('cart');
    });
  });

  renderCart();
});
