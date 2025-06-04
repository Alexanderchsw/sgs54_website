// === ФУНКЦИЯ ПОДГРУЗКИ ОПИСАНИЯ УСЛУГИ ===
function showService(serviceKey) {
  const descriptions = {
    diagnostic: {
      text: `Проводим комплексную диагностику и техническое обслуживание грузовых автомобилей.
Проверка всех систем, своевременное выявление неисправностей и профилактика — залог
надёжной работы вашей техники.`,
      button: 'Записаться на диагностику и ТО'
    },
    capital: {
      text: `Выполняем капитальный и текущий ремонт двигателей, коробок передач и других систем.
Используем проверенные запчасти и даём гарантию на выполненные работы.`,
      button: 'Записаться на капитальный ремонт'
    },
    suspension: {
      text: `Ремонт и обслуживание ходовой части: амортизаторы, рычаги, ступицы, рессоры.
Качественно устраняем люфты, стуки и другие проблемы.`,
      button: 'Записаться на ремонт ходовой'
    },
    brakes: {
      text: `Обслуживание и ремонт тормозной системы: замена колодок, дисков, диагностика АБС.
Ваша безопасность — наш приоритет.`,
      button: 'Записаться на ремонт тормозов'
    }
  };

  const desc = descriptions[serviceKey];
  const container = document.getElementById('service-description');
  if (container && desc) {
    container.innerHTML = `
      <div class="service-box">
        <p>${desc.text}</p>
        <a href="#" class="btn static-width open-modal">${desc.button}</a>
      </div>
    `;

    document.querySelectorAll('.services-list li').forEach(li => {
      li.classList.remove('active-service');
    });

    const clickedLi = document.querySelector(`.services-list li[onclick*="${serviceKey}"]`);
    if (clickedLi) clickedLi.classList.add('active-service');
  }
}

// === ВСЯ ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ ===
document.addEventListener('DOMContentLoaded', () => {
  // === Подгружаем первую услугу ===
  if (document.getElementById('service-description')) {
    showService('diagnostic');
  }

  // === Подсветка активного пункта меню ===
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navbar a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && currentPage === href) {
      link.classList.add("active");
    }
  });

  // === FAQ (если есть) ===
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // === МОДАЛКА ===
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close-modal');

  function bindModalButtons() {
    const openBtns = document.querySelectorAll('.open-modal, .btn.static-width');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) {
          modal.classList.remove('hidden');
          modal.style.display = 'flex';
        }
      });
    });
  }

  bindModalButtons();

  document.querySelector('.services-list')?.addEventListener('click', () => {
    setTimeout(() => bindModalButtons(), 50);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    });

    window.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    });
  }

  // === ПОДГРУЗКА ТОВАРОВ (если есть магазин) ===
  const productList = document.getElementById('product-list');
  if (productList) {
    fetch('data/products_converted.txt')
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        lines.forEach(line => {
          const [name, article, stock, price, image] = line.split('|');

          if (!name || name.trim() === '') return; // пропускаем без названия

          const safeArticle = article?.trim() || '—';
          const safeStock = stock?.trim() || '—';
          const safePrice = price?.trim() || '—';
          const showBadge = (safeArticle === '—' || safePrice === '—');

          const card = document.createElement('div');
          card.className = 'product-card';
          if (showBadge) card.classList.add('requires-clarification');

          card.innerHTML = `
            ${showBadge ? '<div class="badge">Требует уточнения</div>' : ''}
            <img src="${image || 'img/default.png'}" alt="${name}">
            <h3>${name}</h3>
            <p><strong>Артикул:</strong> ${safeArticle}</p>
            <p><strong>Остаток:</strong> ${safeStock} шт</p>
            <p><strong>Цена:</strong> ${safePrice !== '—' ? `${safePrice} ₽` : '—'}</p>
            <button class="buy-button">Купить</button>
          `;

          const btn = card.querySelector('.buy-button');
          btn.addEventListener('click', () => {
            if (typeof addToCart === 'function') {
              addToCart(name, safeArticle, safePrice);
            } else {
              alert('Функция добавления в корзину недоступна.');
            }
          });

          productList.appendChild(card);
        });
      })
      .catch(err => console.error('Ошибка загрузки товаров:', err));
  }
});

