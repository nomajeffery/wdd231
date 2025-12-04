// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  hamburger.classList.toggle("open");
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
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>💲 ${p.price}</p>
      <p>${p.category}</p>
      <button class="btn view-btn">Quick View</button>
      <button class="btn add-cart-btn">Add to Cart</button>
    `;
    productList.appendChild(card);

    // Quick View button
    card.querySelector(".view-btn").addEventListener("click", () => {
      openModal(p);
    });

    // Add to Cart button
    card.querySelector(".add-cart-btn").addEventListener("click", () => {
      addToCart(p);
    });
  });
}

// Open modal
function openModal(product) {
  modal.style.display = "block";
  modalImg.src = product.image;
  modalTitle.textContent = product.title;
  modalPrice.textContent = `💲 ${product.price}`;
  modalCategory.textContent = `Category: ${product.category}`;
  modalDesc.textContent = product.description;

  modalCartBtn.onclick = () => addToCart(product);
}

// Close modal
modalClose.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target == modal) modal.style.display = "none"; });

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
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.getAttribute("data-category");
    const filtered = cat === "all"
      ? products
      : products.filter(p => p.category === cat);
    renderProducts(filtered);
  });
});

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  document.getElementById("year").textContent = new Date().getFullYear();
  updateCartCount();
});
