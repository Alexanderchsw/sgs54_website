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
  // Подгружаем описание первой услуги
  showService('diagnostic');

  // Подсветка активного пункта меню
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navbar a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && currentPage === href) {
      link.classList.add("active");
    }
  });

  // Раскрытие FAQ
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // ====== МОДАЛКА ======
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close-modal');

  function bindModalButtons() {
    const openBtns = document.querySelectorAll('.open-modal, .btn.static-width');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) modal.style.display = 'flex';
      });
    });
  }

  // Привязываем обработчики при загрузке
  bindModalButtons();

  // Привязываем заново после клика по услугам (через делегирование)
  document.querySelector('.services-list')?.addEventListener('click', () => {
    setTimeout(() => bindModalButtons(), 50); // ждём, пока контент вставится
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
});

// Загрузка данных и отрисовка карточек
fetch('data/products_converted.txt')
    .then(response => response.text())
    .then(data => {
        const products = data.split('\n').map(line => {
            const [name, article, stock, price, image] = line.split('|');
            return { name, article, stock, price, image };
        });

        const productList = document.getElementById('product-list');
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            // Определяем необходимость ярлыка "Требует уточнения"
            if (!product.article || !product.price) {
                card.classList.add('requires-clarification');
            }

            card.innerHTML = `
                <img src="${product.image || 'img/default.png'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p><strong>Артикул:</strong> ${product.article || '—'}</p>
                <p><strong>Остаток:</strong> ${product.stock || '—'} шт</p>
                <p><strong>Цена:</strong> ${product.price ? `${product.price} ₽` : '—'}</p>
                <button class="buy-button">Купить</button>
            `;

            productList.appendChild(card);
        });
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));
