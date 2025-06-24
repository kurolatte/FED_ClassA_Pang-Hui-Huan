// 1) API base
const API_BASE = 'http://localhost:3000';

// 2) Cart helpers
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  updateCartCount();
}
function updateCartCount() {
  const count = getCart().length;
  document.getElementById("cartCount").innerText = count;
}

// 3) Fetch products
async function fetchAllProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error(res.status);
  return await res.json();
}

async function fetchProducts(q) {
  // currently your API doesn't support q, so this just returns all
  const products = await fetchAllProducts();
  if (q) {
    const term = q.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }
  return products;
}

// 4) Render grid
let lastProducts = [];
function renderProducts(items) {
  lastProducts = items;  // remember for Add-to-Cart lookup
  const cont = document.getElementById("productContainer");
  cont.innerHTML = "";

  if (!items.length) {
    cont.innerHTML = `
      <div class="col-span-full text-white text-center py-8">
        No products found.
      </div>`;
    return;
  }

  items.forEach(p => {
    // wrap whole card in a link
    const link = document.createElement("a");
    link.href      = `product.html?id=${p.id}`;
    link.className = "block bg-[#5A5A5A] p-4 rounded border border-[#434343] text-white flex flex-col hover:shadow-lg transition";

    link.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.title}"
           class="w-full h-60 object-cover mb-4 rounded"/>
      <h3 class="text-lg font-semibold mb-1">${p.title}</h3>
      <p class="text-xl font-bold mb-2">$${p.price}</p>
      <button data-id="${p.id}"
              class="mt-auto bg-green-500 hover:bg-green-600 px-3 py-2 rounded text-sm">
        Add to Cart
      </button>
    `;

    // keep Add-to-Cart from navigating
    link.querySelector("button").addEventListener("click", e => {
      e.preventDefault();
      addToCart(p);
    });

    cont.appendChild(link);
  });
}

// 5) Main
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const btn   = document.getElementById("searchBtn");
  const minEl = document.getElementById("priceMin");
  const maxEl = document.getElementById("priceMax");

  // show initial cart count
  updateCartCount();

  // load all on start
  fetchAllProducts()
    .then(renderProducts)
    .catch(console.error);

  // search + filter
  async function doSearch() {
    btn.disabled = true;
    try {
      const q = input.value.trim();
      let prods = q
        ? await fetchProducts(q)
        : await fetchAllProducts();

      const min = minEl.value !== "" ? +minEl.value : -Infinity;
      const max = maxEl.value !== "" ? +maxEl.value : Infinity;
      prods = prods.filter(p => p.price >= min && p.price <= max);

      renderProducts(prods);
    } catch (e) {
      console.error(e);
      alert("Search failed");
    } finally {
      btn.disabled = false;
    }
  }

  btn.addEventListener("click", doSearch);
  input.addEventListener("keyup", e => {
    if (e.key === "Enter") doSearch();
  });
});
