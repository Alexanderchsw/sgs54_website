document.addEventListener('DOMContentLoaded', () => {
  /* === НАСТРОЙКИ ===================================================== */
  const PAGE_SIZE = 50;                        // сколько карточек на страницу

  /* === СЛОВАРЬ КАТЕГОРИЙ ============================================= */
  const categoryMap = {
    двигатель : ['двигатель', 'двс', 'motor', 'engine'],
    ходовая   : ['ходовая', 'рессор', 'амортиз', 'ступиц', 'подвеск'],
    электрика : ['электр', 'датчик', 'ламп', 'реле', 'стартер', 'генерат']
    // ➜ расширяйте при необходимости
  };

  const detectCategory = name => {
    const n = name.toLowerCase();
    for (const [cat, keys] of Object.entries(categoryMap))
      if (keys.some(k => n.includes(k))) return cat;
    return '';                                // ← нет категории — пустая строка
  };

  /* === DOM-элементы =================================================== */
  const container   = document.getElementById('product-list');
  const pagination  = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const filterSel   = document.getElementById('filterSelect');
  const sortSel     = document.getElementById('sortSelect');

  /* === ГЛОБАЛЬНЫЕ МАССИВЫ ============================================ */
  let allProducts      = [];
  let filteredProducts = [];
  let currentPage      = 1;

  /* === ЗАГРУЗКА ДАННЫХ =============================================== */
  fetch('data/products_converted.txt')
    .then(r => r.text())
    .then(t => {
      const lines = t.trim().split('\n').slice(1);        // без заголовка
      allProducts = lines.map(line => {
        const [nameRaw, stockRaw, unitRaw, priceRaw, artRaw, imgRaw] = line.split('\t');

        const name    = (nameRaw  || '').trim();
        const stock   = (stockRaw || '').trim();
        const unit    = (unitRaw  || '').trim();
        const price   = parseFloat((priceRaw || '')
                        .replace(/\u00A0/g, '')           // убираем неразр. пробелы
                        .replace(',', '.')) || 0;
        const article = (artRaw   || '').trim();
        const image   = (imgRaw   || '').trim();

        return { name, stock, unit, price, article, image, category: detectCategory(name) };
      });

      /* динамически наполним select категорий (без пустых) */
      const cats = [...new Set(allProducts.map(p => p.category).filter(Boolean))].sort();
      filterSel.innerHTML =
        '<option value="">Все категории</option>' +
        cats.map(c => `<option value="${c}">${c[0].toUpperCase()+c.slice(1)}</option>`).join('');

      filteredProducts = [...allProducts];
      renderCurrentPage();
      renderPagination();
    });

  /* === ПРИМЕНИТЬ ФИЛЬТРЫ/ПОИСК/СОРТ ================================== */
  function applyFilters() {
    const q       = searchInput.value.toLowerCase();
    const cat     = filterSel.value;
    const sortDir = sortSel.value;

    filteredProducts = allProducts.filter(p => {
      const matchText = p.name.toLowerCase().includes(q) || p.article.toLowerCase().includes(q);
      const matchCat  = !cat || p.category === cat;
      return matchText && matchCat;
    });

    if (sortDir)
      filteredProducts.sort((a,b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price);

    currentPage = 1;
    renderCurrentPage();
    renderPagination();
  }

  /* === ОТРИСОВКА ТЕКУЩЕЙ СТРАНИЦЫ =================================== */
  function renderCurrentPage() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page  = filteredProducts.slice(start, start + PAGE_SIZE);

    const frag = document.createDocumentFragment();

    page.forEach(p => {
      const displayStock   = p.stock ? `${p.stock}${p.unit ? ' '+p.unit : ''}` : '—';
      const displayPrice   = p.price ? p.price.toLocaleString('ru-RU', {minimumFractionDigits:2}) + ' ₽' : '—';
      const displayArticle = p.article || '—';
      const imgSrc         = p.image || 'img/no-image.png';
      const needBadge      = displayStock==='—' || displayPrice==='—' || displayArticle==='—';

      const card = document.createElement('div');
      card.className = 'product-card product';
      card.dataset.category = p.category;
      card.dataset.price    = p.price;

      card.innerHTML = `
        ${needBadge ? '<div class="badge">Требует уточнения</div>' : ''}
        <img src="${imgSrc}" alt="${p.name}" class="product-image">
        <h3 class="product-title">${p.name}</h3>
        <p><strong>Артикул:</strong> <span class="product-article">${displayArticle}</span></p>
        <p><strong>Остаток:</strong> ${displayStock}</p>
        <p><strong>Цена:</strong> ${displayPrice}</p>
        <div class="btn-wrapper">
          <button class="btn small-btn"
                  onclick="addToCart('${p.name.replace(/'/g, '\\\'')}', '${displayArticle}', '${p.price}')">
            В корзину
          </button>
        </div>
      `;
      frag.appendChild(card);
    });

    container.replaceChildren(frag);
  }

  /* === ПАГИНАЦИЯ ===================================================== */
  function renderPagination() {
    const total = Math.ceil(filteredProducts.length / PAGE_SIZE);
    pagination.innerHTML = '';
    if (total <= 1) return;

    const makeBtn = (label, page) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.className = 'pagination-btn' + (page === currentPage ? ' active' : '');
      b.onclick = () => { currentPage = page; renderCurrentPage(); renderPagination(); };
      return b;
    };

    if (currentPage > 1) pagination.appendChild(makeBtn('‹ Назад', currentPage - 1));

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - currentPage) <= 1) {
        pagination.appendChild(makeBtn(i, i));
      } else if ((i === currentPage - 2 || i === currentPage + 2) && total > 5) {
        const dots = document.createElement('span');
        dots.textContent = '…';
        dots.className = 'dots';
        pagination.appendChild(dots);
      }
    }

    if (currentPage < total) pagination.appendChild(makeBtn('Вперёд ›', currentPage + 1));
  }

  /* === ОБРАБОТЧИКИ =================================================== */
  searchInput.addEventListener('input',  applyFilters);
  filterSel  .addEventListener('change', applyFilters);
  sortSel    .addEventListener('change', applyFilters);
});
