let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsEl = document.getElementById("cart-items");
const summaryCountEl = document.getElementById("summary-count");
const summaryTotalEl = document.getElementById("summary-total");

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Remove item
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
}

// Change quantity
function changeQty(index, amount) {
  cart[index].qty += amount;

  if (cart[index].qty <= 0) cart[index].qty = 1;

  saveCart();
}

// Render the cart UI
function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    summaryCountEl.textContent = "0";
    summaryTotalEl.textContent = "₦0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    if (!item.qty) item.qty = 1; // default qty

    total += item.price * item.qty;

    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">

        <div class="cart-item-info">
          <p class="cart-item-title">${item.title}</p>
          <p class="cart-item-price">₦${item.price}</p>

          <div class="qty-box">
            <button class="qty-btn" onclick="changeQty(${index}, -1)" aria-label="Decrease quantity for ${item.title}">−</button>
            <span aria-label="Quantity: ${item.qty}">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${index}, 1)" aria-label="Increase quantity for ${item.title}">+</button>
          </div>

          <button class="remove-btn" onclick="removeItem(${index})" aria-label="Remove ${item.title} from cart" type="button">Remove</button>
        </div>
      </div>
    `;
  });

  summaryCountEl.textContent = cart.length;
  summaryTotalEl.textContent = "₦" + total.toFixed(2);
}

// Init
renderCart();
