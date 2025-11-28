// app.js - ES Module
import initNavbar from './nav.js';
// Requirements met:
// - fetch local JSON with try/catch (async)
// - render 15 items (each 4+ properties)
// - search, category filter, sort, pagination
// - accessible modal dialog
// - cart persisted in localStorage
// - DOM manipulation, array methods, template literals

const DATA_PATH = 'data/shop.json'; // local file (15 items) (was furniture.json)
const PAGE_SIZE = 6; // items per page for pagination

// fallback data (in case fetch fails, e.g. file:// or server not present)
const FALLBACK_PRODUCTS = [
  {"id":1,"name":"iPhone 13 Pro","category":"Phones","price":820.00,"image":"https://via.placeholder.com/400x300?text=iPhone+13+Pro","description":"128GB · Super Retina XDR display · Great camera."},
  {"id":2,"name":"Samsung 55-inch Smart TV","category":"Electronics","price":550.00,"image":"https://via.placeholder.com/400x300?text=Samsung+Smart+TV","description":"Crystal UHD 4K · Smart Hub · Clean view."},
  {"id":3,"name":"Men’s Running Sneakers","category":"Fashion","price":48.00,"image":"https://via.placeholder.com/400x300?text=Running+Shoes","description":"Breathable upper · Cushioned midsole."},
  {"id":4,"name":"JBL Bluetooth Speaker","category":"Audio","price":32.00,"image":"https://via.placeholder.com/400x300?text=JBL+Speaker","description":"Portable · Waterproof · Deep bass."},
  {"id":5,"name":"Air Fryer 4.5L","category":"Home Appliances","price":65.00,"image":"https://via.placeholder.com/400x300?text=Air+Fryer","description":"Oil-free cooking · Rapid heat technology."},
  {"id":6,"name":"Ladies’ Handbag","category":"Fashion","price":25.00,"image":"https://via.placeholder.com/400x300?text=Ladies+Handbag","description":"PU leather · Zipper closure · 2 compartments."},
  {"id":7,"name":"Tecno Spark 20","category":"Phones","price":150.00,"image":"https://via.placeholder.com/400x300?text=Tecno+Spark+20","description":"Large battery · AI triple camera · 128GB ROM."},
  {"id":8,"name":"Wireless Earbuds","category":"Audio","price":12.00,"image":"https://via.placeholder.com/400x300?text=Wireless+Earbuds","description":"Touch control · Noise reduction."},
  {"id":9,"name":"Stainless Wrist Watch","category":"Accessories","price":18.00,"image":"https://via.placeholder.com/400x300?text=Wrist+Watch","description":"Water-resistant · Quartz movement."},
  {"id":10,"name":"Standing Fan 16\"","category":"Home Appliances","price":30.00,"image":"https://via.placeholder.com/400x300?text=Standing+Fan","description":"3-speed · Adjustable height."},
  {"id":11,"name":"Gaming Keyboard","category":"Computers","price":22.00,"image":"https://via.placeholder.com/400x300?text=Gaming+Keyboard","description":"Mechanical-feel · RGB backlight."},
  {"id":12,"name":"Electric Blender","category":"Kitchen","price":28.00,"image":"https://via.placeholder.com/400x300?text=Electric+Blender","description":"1.5L · Grinder attachment."},
  {"id":13,"name":"Travel Backpack","category":"Fashion","price":20.00,"image":"https://via.placeholder.com/400x300?text=Backpack","description":"Laptop sleeve · Water resistant."},
  {"id":14,"name":"Android Tablet 10\"","category":"Electronics","price":90.00,"image":"https://via.placeholder.com/400x300?text=Android+Tablet","description":"10\" HD · 4GB RAM · 64GB storage."},
  {"id":15,"name":"Perfume 100ml","category":"Beauty","price":14.00,"image":"https://via.placeholder.com/400x300?text=Perfume","description":"Long-lasting unisex fragrance."}
];

/* ---------- DOM selectors ---------- */
const sel = {
  productList: document.getElementById('product-list'),
  productCount: document.getElementById('product-count'),
  modal: document.getElementById('product-modal'),
  modalBody: document.getElementById('modal-body'),
  modalClose: document.getElementById('modal-close'),
  cartBtn: document.getElementById('cart-btn'),
  cartContainer: document.getElementById('cart-container'),
  cartList: document.getElementById('cart-list'),
  cartTotalValue: document.getElementById('cart-total-value'),
  cartCountInfo: document.getElementById('cart-count-info'),
  navToggler: document.getElementById('nav-toggler'),
  mainNav: document.getElementById('main-nav'),
  searchInput: document.getElementById('search'),
  sortSelect: document.getElementById('sort-select'),
  categoryNav: document.getElementById('category-nav'),
  pagination: document.getElementById('pagination'),
  checkoutLink: document.getElementById('checkout-link')
};

let products = [];
let filtered = [];
let cart = [];
let currentPage = 1;

/* ---------- Utilities ---------- */
const fmt = v => Number(v || 0).toFixed(2);
const q = sel;

/* escape for safety */
function escapeHtml(str = '') {
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}

/* ---------- localStorage ---------- */
function loadCart() {
  try {
    const raw = localStorage.getItem('cart');
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

/* ---------- fetch products ---------- */
async function fetchProducts() {
  try {
    const res = await fetch(DATA_PATH);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Invalid data');
    console.debug('fetchProducts: loaded', data.length, 'items');
    products = data.map(p => ({ ...p })); // clone
    filtered = [...products];
    renderProductsPage(1);
    loadCart();
    updateCartUI();
  } catch (err) {
    console.error('Error loading products', err, '\nUsing fallback data.');
    // fallback to embedded sample data
    products = [...FALLBACK_PRODUCTS];
    filtered = [...products];
    renderProductsPage(1);
    loadCart();
    updateCartUI();
    if (q.productList) q.productList.innerHTML = '<p class="error">Unable to load products. Serve using a local server (Live Server or python -m http.server).</p>';
  }
}

/* ---------- rendering ---------- */
function renderProductCard(item) {
  // each item must show image, name, category, price, description (4+ properties satisfied)
  return `
    <article class="product-card" data-id="${item.id}" aria-labelledby="pname-${item.id}">
      <div class="product-img">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" width="400" height="300" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image';">
        <button type="button" class="add-to-cart-btn btn" data-action="add" data-id="${item.id}" aria-label="Add ${escapeHtml(item.name)} to cart">Add to Cart</button>
      </div>
      <div class="product-content">
        <h3 id="pname-${item.id}" class="product-name">${escapeHtml(item.name)}</h3>
        <p class="product-category">${escapeHtml(item.category)}</p>
        <p class="product-desc">${escapeHtml(item.description)}</p>
        <p class="product-price">$${fmt(item.price)}</p>
        <div style="display:flex;gap:0.5rem;justify-content:center;margin-top:0.5rem;">
          <button type="button" class="btn view-btn" data-action="view" data-id="${item.id}" aria-label="View ${escapeHtml(item.name)}">View</button>
          <button type="button" class="btn add-btn" data-action="add" data-id="${item.id}" aria-label="Add ${escapeHtml(item.name)} to cart">Add</button>
        </div>
      </div>
    </article>
  `;
}

function renderProductsPage(page = 1) {
  currentPage = page;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  if (!q.productList) {
    console.error('renderProductsPage: #product-list not found');
    return;
  }
  q.productList.innerHTML = pageItems.map(renderProductCard).join('') || '<p class="text">No products found.</p>';
  q.productCount.textContent = `(${filtered.length})`;
  renderPagination();
}

/* ---------- pagination ---------- */
function renderPagination() {
  const total = Math.ceil(filtered.length / PAGE_SIZE);
  if (total <= 1) {
    q.pagination.innerHTML = '';
    return;
  }
  let html = '';
  for (let i = 1; i <= total; i++) {
    if (i === currentPage) html += `<button type="button" class="btn page-btn" data-page="${i}" aria-current="page">${i}</button>`;
    else html += `<button type="button" class="btn page-btn" data-page="${i}">${i}</button>`;
  }
  q.pagination.innerHTML = html;
}

/* ---------- modal ---------- */
function openModal(id) {
  const product = products.find(p => Number(p.id) === Number(id));
  if (!product || !q.modal) return;
  q.modalBody.innerHTML = `
    <div class="modal-product">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" width="400" height="300">
      <div class="modal-product-info">
        <h2>${escapeHtml(product.name)}</h2>
        <p><strong>Category:</strong> ${escapeHtml(product.category)}</p>
        <p><strong>Price:</strong> $${fmt(product.price)}</p>
        <p>${escapeHtml(product.description)}</p>
        <form id="buy-form" action="form-result.html" method="get" style="margin-top:1rem;">
          <input type="hidden" name="id" value="${product.id}">
          <label for="qty">Qty:</label>
          <input id="qty" name="qty" type="number" min="1" value="1" style="width:72px;margin-left:6px;">
          <button class="btn" type="submit" style="margin-left:8px;">Buy now</button>
          <button class="btn" type="button" id="modal-add" data-id="${product.id}" style="margin-left:8px;">Add to cart</button>
        </form>
      </div>
    </div>
  `;
  q.modal.hidden = false;
  q.modal.setAttribute('aria-hidden','false');
  document.addEventListener('keydown', modalKeyHandler);
  // focus modal close
  setTimeout(()=> q.modalClose?.focus?.(), 10);
}

function closeModal() {
  if (!q.modal) return;
  q.modal.hidden = true;
  q.modal.setAttribute('aria-hidden','true');
  q.modalBody.innerHTML = '';
  document.removeEventListener('keydown', modalKeyHandler);
}

function modalKeyHandler(e) {
  if (e.key === 'Escape') closeModal();
}

/* ---------- cart ---------- */
function addToCart(id, qty = 1) {
  const pid = Number(id);
  if (!pid) return;
  const existing = cart.find(i => i.id === pid);
  if (existing) existing.qty += Number(qty);
  else cart.push({ id: pid, qty: Number(qty) });
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== Number(id));
  saveCart();
}

function updateCartUI() {
  if (!q.cartList || !q.cartTotalValue || !q.cartCountInfo) return;
  if (!cart.length) {
    q.cartList.innerHTML = '<p class="empty">Your cart is empty.</p>';
  } else {
    q.cartList.innerHTML = cart.map(ci => {
      const p = products.find(pp => Number(pp.id) === Number(ci.id)) || {};
      const subtotal = (p.price || 0) * ci.qty;
      return `
        <div class="cart-item" data-id="${ci.id}">
          <img src="${p.image||''}" alt="${escapeHtml(p.name||'')}" width="80" height="60">
          <div class="cart-item-info">
            <h4>${escapeHtml(p.name||'Item')}</h4>
            <p>Qty: <span class="cart-item-qty">${ci.qty}</span>
              <button type="button" class="qty-btn" data-action="dec" data-id="${ci.id}" aria-label="Decrease quantity">-</button>
              <button type="button" class="qty-btn" data-action="inc" data-id="${ci.id}" aria-label="Increase quantity">+</button>
            </p>
            <p>Price: $${fmt(p.price)}</p>
            <p>Subtotal: $${fmt(subtotal)}</p>
            <div class="cart-item-actions">
              <button type="button" class="btn remove-btn" data-action="remove" aria-label="Remove ${escapeHtml(p.name||'')}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const total = cart.reduce((acc, ci) => {
    const p = products.find(pp => Number(pp.id) === Number(ci.id));
    return acc + ((p?.price || 0) * ci.qty);
  }, 0);

  q.cartTotalValue.textContent = fmt(total);
  const count = cart.reduce((s,i)=>s+i.qty,0);
  q.cartCountInfo.textContent = `${count}`;
}

/* ---------- filters / search / sort ---------- */
function applyFilters() {
  const qstr = (q.searchInput?.value || '').trim().toLowerCase();
  const sortBy = q.sortSelect?.value || 'default';
  // category selection from nav: active link has data-active="true"
  const activeCatLink = q.categoryNav?.querySelector('a[data-active="true"]');
  const category = activeCatLink ? activeCatLink.dataset.category : 'All';

  filtered = products.filter(p => {
    const matchesSearch = !qstr || (p.name + ' ' + p.description + ' ' + p.category).toLowerCase().includes(qstr);
    const matchesCat = !category || category === 'All' || p.category === category;
    return matchesSearch && matchesCat;
  });

  // sort
  if (sortBy === 'price-asc') filtered.sort((a,b)=> a.price - b.price);
  else if (sortBy === 'price-desc') filtered.sort((a,b)=> b.price - a.price);
  else if (sortBy === 'name-asc') filtered.sort((a,b)=> a.name.localeCompare(b.name));

  // reset to page 1
  renderProductsPage(1);
}

/* ---------- events ---------- */
function initEventHandlers() {
  // unified click handler for product list: view/add buttons and overlay add
  q.productList?.addEventListener('click', (e) => {
    // handle buttons (view/add)
    const btn = e.target.closest('button');
    if (btn) {
      const action = btn.dataset.action;
      const id = btn.dataset.id || btn.closest('.product-card')?.dataset.id;
      if (action === 'view') return openModal(id);
      if (action === 'add') {
        addToCart(id);
        const orig = btn.textContent;
        btn.textContent = 'Added';
        setTimeout(()=> btn.textContent = orig || 'Add', 600);
        return;
      }
    }

    // overlay add (in case overlay button isn't a <button> or uses class)
    const overlayBtn = e.target.closest('.add-to-cart-btn');
    if (overlayBtn) {
      addToCart(overlayBtn.dataset.id);
      const orig = overlayBtn.textContent;
      overlayBtn.textContent = 'Added';
      setTimeout(()=> overlayBtn.textContent = orig || 'Add to Cart', 700);
      return;
    }
  });

  // buy/add inside modal
  q.modal?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'modal-add') {
      const id = btn.dataset.id;
      addToCart(id);
      closeModal();
    } else if (btn === q.modalClose) closeModal();
  });

  // close modal when clicking overlay
  q.modal?.addEventListener('click', (e) => {
    if (e.target === q.modal) closeModal();
  });

  // cart button toggle
  q.cartBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const hidden = !!q.cartContainer.hidden;
    q.cartContainer.hidden = !hidden;
    q.cartBtn.setAttribute('aria-expanded', String(!hidden));
  });

  // cart list (remove)
  q.cartList?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const item = btn.closest('.cart-item');
    const id = item?.dataset.id;
    if (action === 'remove' && id) removeFromCart(id);
    else if (action === 'dec' && id) {
      // decrease quantity
      const ci = cart.find(c => Number(c.id) === Number(id));
      if (!ci) return;
      if (ci.qty > 1) {
        ci.qty = Math.max(1, ci.qty - 1);
        saveCart();
      } else {
        // remove if reaches 0
        removeFromCart(id);
      }
    } else if (action === 'inc' && id) {
      const ci = cart.find(c => Number(c.id) === Number(id));
      if (!ci) return;
      ci.qty = Number(ci.qty) + 1;
      saveCart();
    }
  });

  // clicks outside cart close it
  document.addEventListener('click', (e) => {
    if (q.cartContainer && !q.cartContainer.hidden && !e.target.closest('#cart-container') && !e.target.closest('#cart-btn')) {
      q.cartContainer.hidden = true;
      q.cartBtn?.setAttribute('aria-expanded','false');
    }
  });

  // pagination buttons
  q.pagination?.addEventListener('click', (e) => {
    const btn = e.target.closest('button.page-btn');
    if (!btn) return;
    const page = Number(btn.dataset.page);
    renderProductsPage(page);
  });

  // page buttons inside product-list (e.g., view)
  // navbar toggler (responsive) — delegated to `nav.js`
  initNavbar();
  console.debug('initNavbar called', q.navToggler, q.mainNav);

  // search input
  q.searchInput?.addEventListener('input', debounce(() => applyFilters(), 230));

  // allow search button in `search.js` to ask app to apply the filters
  document.addEventListener('app.search', (e) => {
    applyFilters();
  });

  // sort
  q.sortSelect?.addEventListener('change', () => applyFilters());

  // category nav
  q.categoryNav?.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-category]');
    if (!a) return;
    e.preventDefault();
    // toggle active
    q.categoryNav.querySelectorAll('a').forEach(link => link.removeAttribute('data-active'));
    a.setAttribute('data-active','true');
    applyFilters();
    // close mobile nav after selecting a category
    const nav = q.mainNav;
    if (nav && window.innerWidth < 768) {
      nav.classList.remove('open');
      nav.hidden = true;
      nav.setAttribute('aria-hidden', 'true');
      q.navToggler?.setAttribute('aria-expanded', 'false');
    }
  });

  // view all button resets filters
  document.getElementById('view-all')?.addEventListener('click', (e) => {
    if (q.searchInput) q.searchInput.value = '';
    if (q.sortSelect) q.sortSelect.value = 'default';
    if (q.categoryNav) q.categoryNav.querySelectorAll('a').forEach(a => a.removeAttribute('data-active'));
    const all = q.categoryNav?.querySelector('a[data-category="All"]');
    if (all) all.setAttribute('data-active','true');
    applyFilters();
  });

  // page keyboard escape to close modal/cart
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (q.modal && !q.modal.hidden) closeModal();
      if (q.cartContainer && !q.cartContainer.hidden) {
        q.cartContainer.hidden = true;
        q.cartBtn?.setAttribute('aria-expanded','false');
      }
    }
  });

  // (handlers for view/add were unified above)
}

/* ---------- navbar toggler ---------- */
// navbar toggler code moved to `nav.js` (imported as initNavbar)

/* ---------- helpers ---------- */
function debounce(fn, wait=200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), wait);
  };
}

/* ---------- init ---------- */
function init() {
  initEventHandlers();
  fetchProducts();
}

init();