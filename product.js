const API_BASE = 'http://localhost:3000';

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.innerText = getCart().length;
}
function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  updateCartCount();
}

document.addEventListener('DOMContentLoaded', async () => {
  const details = document.getElementById('productDetails');
  const id      = new URLSearchParams(location.search).get('id');

  if (!id) {
    details.innerHTML = `
      <p class="text-red-500 text-center font-semibold">
        No product ID specified.
      </p>`;
    return;
  }

  try {
    const res     = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { title, thumbnail, description, price } = await res.json();
    details.innerHTML = `
      <h1 class="text-3xl font-bold mb-4">${title}</h1>
      <img src="${thumbnail}" alt="${title}"
           class="w-full h-96 object-cover mb-6 rounded"/>
      <p class="mb-4">${description}</p>
      <div class="text-2xl font-semibold mb-6">
        Price: $${price}
      </div>
      <button id="addToCartBtn"
              class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
        Add to Cart
      </button>
    `;

    document
      .getElementById('addToCartBtn')
      .addEventListener('click', () => {
        addToCart({ id: Number(id), title, thumbnail, price });
      });
      
  } catch {
    details.innerHTML = `
      <p class="text-red-500 text-center font-semibold">
        Failed to load product.
      </p>`;
  }
});
