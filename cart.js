/* ╔════════════════════════════════════╗
   ║           К О Р З И Н А           ║
   ╚════════════════════════════════════╝ */

/* helpers ------------------------------------------------------------- */
const loadCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const saveCart = c  => localStorage.setItem('cart', JSON.stringify(c));

/* рендер таблицы ------------------------------------------------------- */
function renderCart() {
  const body   = document.getElementById('cart-body');
  const totalP = document.getElementById('total');
  const cart   = loadCart();

  let grand = 0, items = 0;
  body.innerHTML = '';

  cart.forEach((it, i) => {
    const sum = it.price * it.quantity;
    grand += sum; items += it.quantity;

    body.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${it.name}</td>
        <td>${it.article || '—'}</td>
        <td>${it.price ? it.price.toLocaleString('ru-RU') : '—'}</td>
        <td>
          <div class="quantity-group">
            <button class="quantity-btn" data-i="${i}" data-d="-1">−</button>
            <span>${it.quantity}</span>
            <button class="quantity-btn" data-i="${i}" data-d="+1">+</button>
          </div>
        </td>
        <td>${sum.toLocaleString('ru-RU')}</td>
        <td><button class="remove-btn" data-i="${i}">Удалить</button></td>
      </tr>`);
  });

  totalP.textContent = `Итого (${items} шт): ${grand.toLocaleString('ru-RU')} ₽`;
}

/* изменение количества / удаление ------------------------------------ */
document.addEventListener('click', e => {
  if (e.target.matches('.quantity-btn')) {
    const idx = +e.target.dataset.i, d = +e.target.dataset.d;
    const cart = loadCart();
    cart[idx].quantity = Math.max(1, cart[idx].quantity + d);
    saveCart(cart); renderCart();
  }
  if (e.target.matches('.remove-btn')) {
    const idx = +e.target.dataset.i;
    const cart = loadCart();
    cart.splice(idx, 1); saveCart(cart); renderCart();
  }
});

/* =====  МОДАЛКА ОФОРМЛЕНИЯ  ========================================= */
const modal  = document.getElementById('order-modal');
const form   = document.getElementById('order-form');
document.getElementById('checkoutBtn').onclick = () => toggleModal(true);
modal.querySelector('.close-modal').onclick    = () => toggleModal(false);
modal.onclick = e => { if (e.target === modal) toggleModal(false); };

function toggleModal(s){ modal.classList.toggle('hidden',!s); modal.style.display=s?'flex':'none'; }

/* валидация телефона -------------------------------------------------- */
const phoneInput = document.getElementById('customer-phone');
const phoneErr   = document.getElementById('phone-error');
function validPhone(v){
  const d=v.replace(/\D/g,'');
  return /^\+?[0-9()\s\-]+$/.test(v) && d.length>=10 && d.length<=15;
}

/* toast --------------------------------------------------------------- */
function toast(msg, type='success'){
  const t=document.createElement('div');
  t.className=`toast ${type==='success'?'toast-success':'toast-warn'}`;
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('show'),50);
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),300);},3000);
}

/* отправка формы ------------------------------------------------------ */
form.addEventListener('submit', e => {
  e.preventDefault();
  const nameVal  = document.getElementById('customer-name').value.trim();
  const phoneVal = phoneInput.value.trim();
  const cart     = loadCart();

  let ok = true;
  phoneInput.classList.remove('input-error'); phoneErr.classList.remove('show');

  if (!nameVal) ok = false;
  if (!validPhone(phoneVal)) {
    ok = false;
    phoneInput.classList.add('input-error');
    phoneErr.classList.add('show');
  }
  if (cart.length === 0){
    toast('Корзина пуста', 'warn'); return;
  }
  if (!ok){
    toast('Заполните корректно отмеченные поля', 'warn'); return;
  }

  /* === Отправка JSON заказа на почту ================================ */
  fetch('send-order.php', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ cart })
  })
  .then(r => {
    if (r.ok){
      toast('Спасибо! Мы свяжемся с вами для подтверждения заказа.');
      localStorage.removeItem('cart');
      renderCart(); toggleModal(false);
    } else {
      toast('Ошибка отправки письма', 'warn');
    }
  })
  .catch(_ => toast('Сетевая ошибка', 'warn'));
});

/* первичная отрисовка ------------------------------------------------- */
renderCart();
