
"use strict";

// Demo jewellery catalogue.
// Replace demo names, prices and images with your actual products.
const products = [
    {
        id: 1,
        name: "Royal Gold Necklace",
        category: "necklaces",
        price: 25999,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=85",
        description: "An elegant statement piece for celebrations."
    },
    {
        id: 2,
        name: "Elegant Gold Earrings",
        category: "earrings",
        price: 8999,
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=85",
        description: "A graceful finishing touch for your look."
    },
    {
        id: 3,
        name: "Forever Wedding Ring",
        category: "rings",
        price: 14999,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85",
        description: "A timeless design inspired by lasting love."
    },
    {
        id: 4,
        name: "Bridal Necklace Set",
        category: "necklaces",
        price: 32999,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85",
        description: "A statement style for your special day."
    },
    {
        id: 5,
        name: "Classic Diamond Earrings",
        category: "earrings",
        price: 11999,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85",
        description: "Understated elegance for every occasion."
    },
    {
        id: 6,
        name: "Wedding Gold Band",
        category: "rings",
        price: 17999,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85",
        description: "A beautiful symbol of a shared journey."
    }
];

// IMPORTANT: Replace this placeholder with your WhatsApp number.
// Use country code + number, digits only. Example format: 919876543210
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

let cart = [];
let activeCategory = "all";

const productGrid = document.getElementById("productGrid");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const emptyCart = document.getElementById("emptyCart");
const cartBackdrop = document.getElementById("cartBackdrop");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

function displayProducts(category = activeCategory) {
    if (!productGrid) return;

    activeCategory = category;

    const filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);

    if (filteredProducts.length === 0) {
        productGrid.innerHTML =
            '<p class="no-products">No products found in this collection.</p>';
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy">
                <span class="product-number">
                    NO. ${String(product.id).padStart(2, "0")}
                </span>
            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="add-to-cart" data-id="${product.id}">
                    ADD TO BAG +
                </button>
            </div>
        </article>
    `).join("");

    // Show a fallback if a remote product image cannot load.
    productGrid.querySelectorAll(".product-image").forEach(img => {
        img.addEventListener("error", () => {
            img.alt = "Product image unavailable: " + img.alt;
            img.style.display = "none";
            img.parentElement.style.background = "#e8e0d3";
        }, { once: true });
    });
}


document.addEventListener("click", function (event) {
    const button = event.target.closest(".filter");

    if (!button) return;

    const category = button.dataset.category;

    setActiveFilter(category);
    displayProducts(category);
});

// Clicking a collection card filters the products.
document.querySelectorAll(".collection-card").forEach(card => {
    card.addEventListener("click", () => {
        const category = card.dataset.filter;
        if (!category) return;

        setActiveFilter(category);
        displayProducts(category);
    });
});

function openCart() {
    if (!cartPanel || !cartBackdrop) return;

    cartPanel.hidden = false;
    cartBackdrop.hidden = false;
    document.body.classList.add("cart-open");

    if (closeCart) closeCart.focus();
}

function hideCart() {
    if (!cartPanel || !cartBackdrop) return;

    cartPanel.hidden = true;
    cartBackdrop.hidden = true;
    document.body.classList.remove("cart-open");

    if (cartButton) cartButton.focus();
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    openCart();
}

productGrid?.addEventListener("click", event => {
    const button = event.target.closest(".add-to-cart");
    if (!button) return;

    addToCart(Number(button.dataset.id));
});

function updateCart() {
    if (!cartCount || !cartItems || !cartTotal) return;

    const itemCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = itemCount;

    if (emptyCart) {
        emptyCart.hidden = cart.length > 0;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p>${formatPrice(item.price)} × ${item.quantity}</p>
            </div>

            <div class="cart-item-actions">
                <button
                    data-action="minus"
                    data-id="${item.id}"
                    aria-label="Decrease ${item.name} quantity">−</button>

                <button
                    data-action="plus"
                    data-id="${item.id}"
                    aria-label="Increase ${item.name} quantity">+</button>

                <button
                    data-action="remove"
                    data-id="${item.id}">Remove</button>
            </div>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = formatPrice(total);

    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
        checkoutButton.style.opacity = cart.length === 0 ? "0.5" : "1";
    }
}

cartItems?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "plus") {
        item.quantity += 1;
    } else if (action === "minus") {
        item.quantity -= 1;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }
    } else if (action === "remove") {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
});

cartButton?.addEventListener("click", openCart);
closeCart?.addEventListener("click", hideCart);
cartBackdrop?.addEventListener("click", hideCart);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && cartPanel && !cartPanel.hidden) {
        hideCart();
    }
});

// Mobile navigation
menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open") ?? false;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation");
    });
});

// Send the selected products to WhatsApp for an enquiry.
checkoutButton?.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping bag is empty.");
        return;
    }

    if (WHATSAPP_NUMBER.includes("X")) {
        alert(
            "Before using WhatsApp enquiries, replace WHATSAPP_NUMBER " +
            "in script.js with your WhatsApp number, including country code."
        );
        return;
    }

    const lines = cart.map(item =>
        `${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const message = [
        "Hello AMIT YELMAR!",
        "I would like to enquire about these jewellery pieces:",
        "",
        ...lines,
        "",
        `Demo subtotal: ${formatPrice(total)}`,
        "Please confirm the actual price and availability."
    ].join("\n");

    const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

// Footer copyright year
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Initialise the page
displayProducts("all");
setActiveFilter("all");
updateCart();
