/* ╔════════════════════════════════════╗
   ║           К О Р З И Н А           ║
   ╚════════════════════════════════════╝ */

/* helpers ---------------------------------------------------------------- */
const loadCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const saveCart = c  => localStorage.setItem('cart', JSON.stringify(c));

/* рендер корзины --------------------------------------------------------- */
function renderCart(){
  const body   = document.getElementById('cart-body');
  const totalP = document.getElementById('total');
  const cart   = loadCart();

  let grand = 0, items = 0;
  body.innerHTML = '';

  cart.forEach((it,i)=>{
    const sum = it.price * it.quantity;
    grand += sum; items += it.quantity;

    body.insertAdjacentHTML('beforeend',`
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

/* обработка +/- и удаления ---------------------------------------------- */
document.addEventListener('click', e=>{
  if(e.target.matches('.quantity-btn')){
    const idx=+e.target.dataset.i, d=+e.target.dataset.d;
    const cart=loadCart();
    cart[idx].quantity=Math.max(1, cart[idx].quantity+d);
    saveCart(cart); renderCart();
  }
  if(e.target.matches('.remove-btn')){
    const idx=+e.target.dataset.i;
    const cart=loadCart();
    cart.splice(idx,1); saveCart(cart); renderCart();
  }
});

/* ====  МОДАЛКА ОФОРМЛЕНИЯ  ============================================= */
const modal  = document.getElementById('order-modal');
const form   = document.getElementById('order-form');
document.getElementById('checkoutBtn').onclick = ()=>toggleModal(true);
modal.querySelector('.close-modal').onclick    = ()=>toggleModal(false);
modal.onclick = e=>{ if(e.target===modal) toggleModal(false); };

function toggleModal(show){
  modal.classList.toggle('hidden', !show);
  modal.style.display = show ? 'flex' : 'none';
}

/* валидация телефона ---------------------------------------------------- */
const phoneInput = document.getElementById('customer-phone');
const phoneErr   = document.getElementById('phone-error');

function validPhone(v){
  const digits = v.replace(/\D/g,'');
  return /^\+?[0-9()\s\-]+$/.test(v) && digits.length>=10 && digits.length<=15;
}

/* toast-уведомление ----------------------------------------------------- */
function toast(msg, type='success'){
  const t=document.createElement('div');
  t.className=`toast ${type==='success'?'toast-success':'toast-warn'}`;
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('show'),50);
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); },3000);
}

/* отправка формы -------------------------------------------------------- */
form.addEventListener('submit',e=>{
  e.preventDefault();
  const name  = document.getElementById('customer-name').value.trim();
  const phone = phoneInput.value.trim();

  /* базовая проверки + визуальные подсказки */
  let ok = true;
  phoneInput.classList.remove('input-error'); phoneErr.classList.remove('show');

  if(!name) ok=false;

  if(!validPhone(phone)){
    ok = false;
    phoneInput.classList.add('input-error');
    phoneErr.classList.add('show');
  }

  if(!ok){
    toast('Заполните корректно отмеченные поля', 'warn');
    return;
  }

  /* >>> здесь можно отправить данные на сервер / телеграм-бот <<< */

  toast('Спасибо! Мы свяжемся с вами для подтверждения заказа.');
  toggleModal(false);
  localStorage.removeItem('cart');
  renderCart();
});

/* первичная отрисовка --------------------------------------------------- */
renderCart();
