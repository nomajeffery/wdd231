// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  hamburger.classList.toggle("open");
  
  // Update aria-expanded for accessibility
  const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!isExpanded));
});
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");
const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryButtons = document.querySelectorAll(".cat-btn");
const cartCountEl = document.getElementById("cart-count");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalCategory = document.getElementById("modal-category");
const modalDesc = document.getElementById("modal-desc");
const modalClose = document.querySelector(".close-btn");
const modalCartBtn = document.getElementById("modal-cart-btn");

const apiUrl = "https://fakestoreapi.com/products";
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Keep track of last focused element when opening modal
let lastFocusedElement = null;

// Update cart count in UI
function updateCartCount() {
  cartCountEl.textContent = cart.length;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Load products
async function loadProducts() {
  loading.style.display = "block";
  errorMsg.style.display = "none";
  productList.innerHTML = "";

  try {
    const resp = await fetch(apiUrl);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    products = await resp.json();

    loading.style.display = "none";
    renderProducts(products);

  } catch (err) {
    console.error("Failed:", err);
    loading.style.display = "none";
    errorMsg.style.display = "block";
    errorMsg.textContent = "⚠️ Failed to load products. Please try again.";
  }
}

// Render product cards
function renderProducts(items) {
  productList.innerHTML = "";
  items.forEach(p => {
    const card = createProductCard(p);
    productList.appendChild(card);
  });
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  
  // Using template literal for HTML content
  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <h3>${product.title}</h3>
    <p>💲 ${product.price}</p>
    <p>${product.category}</p>
  `;

  // Quick View button
  const viewBtn = document.createElement("button");
  viewBtn.className = "btn view-btn";
  viewBtn.type = "button";
  viewBtn.textContent = "Quick View";
  viewBtn.setAttribute("aria-haspopup", "dialog");
  viewBtn.setAttribute("aria-controls", "modal");
  viewBtn.setAttribute("aria-label", `Quick view ${product.title}`);
  viewBtn.addEventListener("click", () => openModal(product, viewBtn));
  viewBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      viewBtn.click();
    }
  });
  card.appendChild(viewBtn);

  // Add to Cart button
  const addBtn = document.createElement("button");
  addBtn.className = "btn add-cart-btn";
  addBtn.type = "button";
  addBtn.textContent = "Add to Cart";
  addBtn.setAttribute("aria-label", `Add ${product.title} to cart`);
  addBtn.setAttribute("aria-pressed", "false");
  addBtn.addEventListener("click", () => {
    const pressed = addBtn.getAttribute("aria-pressed") === "true";
    addBtn.setAttribute("aria-pressed", String(!pressed));
    addToCart(product);
  });
  addBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addBtn.click();
    }
  });
  card.appendChild(addBtn);

  return card;
}

// Open modal
function openModal(product, triggerElement) {
  lastFocusedElement = triggerElement || document.activeElement;

  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
  modalImg.src = product.image;
  modalTitle.textContent = product.title;
  modalPrice.textContent = `💲 ${product.price}`;
  modalCategory.textContent = `Category: ${product.category}`;
  modalDesc.textContent = product.description;

  const closeBtn = modal.querySelector(".close-btn");
  if (closeBtn) closeBtn.focus();

  modalCartBtn.onclick = () => addToCart(product);

  function escHandler(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }
  document.addEventListener("keydown", escHandler);
  modal._escHandler = escHandler;
}

// Close modal
function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");

  if (modal._escHandler) {
    document.removeEventListener("keydown", modal._escHandler);
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

// Close modal on click
modalClose.addEventListener("click", () => closeModal());
window.addEventListener("click", (e) => {
  if (e.target == modal) closeModal();
});

// Add product to cart
function addToCart(product) {
  cart.push(product);
  saveCart();
  alert(`✅ "${product.title}" added to cart`);
}

// Search
searchBtn.addEventListener("click", () => {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(q));
  renderProducts(filtered);
});

// Category filter
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    const cat = btn.getAttribute("data-category");
    const filtered = cat === "all"
      ? products
      : products.filter(p => p.category === cat);
    renderProducts(filtered);
  });
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });
});

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  document.getElementById("year").textContent = new Date().getFullYear();
  updateCartCount();
});
