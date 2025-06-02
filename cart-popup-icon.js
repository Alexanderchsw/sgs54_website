
document.addEventListener('DOMContentLoaded', () => {
  const cartButton = document.createElement('button');
  cartButton.id = 'cart-icon';
  cartButton.innerHTML = '🛒';
  cartButton.onclick = () => window.location.href = 'cart.html';
  document.body.appendChild(cartButton);

  updateCartIcon();

  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') updateCartIcon();
  });

  function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartButton.title = cart.length ? 'Товаров в корзине: ' + cart.length : 'Корзина пуста';
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
  };
});
