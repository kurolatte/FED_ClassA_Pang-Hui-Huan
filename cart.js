// 1) Helpers to manage the cart in localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function updateCartBadge() {
  document.getElementById("cartCount").innerText = getCart().length;
}

// 2) Render the cart
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cartContainer");
  container.innerHTML = "";

  if (!cart.length) {
    container.innerHTML = `
      <p class="text-white text-center py-8">Your cart is empty.</p>
      <div class="text-center">
        <a href="products.html"
           class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Continue Shopping
        </a>
      </div>
    `;
    return;
  }

  // Build table of items
  let total = 0;
  const rows = cart.map((p, i) => {
    total += p.price;
    return `
      <div class="flex items-center mb-4">
        <img src="${p.thumbnail}"
             alt="${p.title}"
             class="w-16 h-16 object-cover rounded mr-4" />
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-white">${p.title}</h3>
          <p class="text-white">$${p.price.toFixed(2)}</p>
        </div>
        <button data-index="${i}"
                class="removeBtn text-red-400 hover:text-red-600">
          Remove
        </button>
      </div>
    `;
  }).join("");

  // Render
  container.innerHTML = `
    ${rows}
    <div class="border-t border-gray-600 mt-6 pt-4">
      <p class="text-xl text-white font-semibold">Total: $${total.toFixed(2)}</p>
      <div class="mt-4">
        <a href="checkout.html"
           class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
          Proceed to Checkout
        </a>
      </div>
    </div>
  `;

  // Wire up Remove buttons
  container.querySelectorAll(".removeBtn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = +e.currentTarget.dataset.index;
      cart.splice(idx, 1);
      saveCart(cart);
      updateCartBadge();
      renderCart();
    });
  });
}

// 3) On load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCart();
});
