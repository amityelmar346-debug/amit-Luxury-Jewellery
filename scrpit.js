
const products = [
    {
        id: 1,
        name: "Royal Gold Necklace",
        category: "necklaces",
        price: 25999,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Elegant Bridal Earrings",
        category: "earrings",
        price: 8999,
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Forever Wedding Ring",
        category: "rings",
        price: 12999,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Luxury Gold Bracelet",
        category: "bracelets",
        price: 15999,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function displayProducts(category = "all") {
    if (!productGrid) return;

    const filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>₹${product.price.toLocaleString("en-IN")}</p>
                <button class="primary-button"
                    onclick="addToCart(${product.id})">
                    ADD TO BAG
                </button>
            </div>
        </article>
    `).join("");
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    if (cartCount) {
        cartCount.textContent = cart.reduce(
            (total, item) => total + item.quantity, 0
        );
    }

    if (cartItems) {
        cartItems.innerHTML = cart.length
            ? cart.map(item => `
                <div class="cart-item">
                    <p>${item.name}</p>
                    <p>₹${(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `).join("")
            : "<p>Your shopping bag is empty.</p>";
    }

    if (cartTotal) {
        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );
        cartTotal.textContent = "₹" + total.toLocaleString("en-IN");
    }
}

function changeQuantity(productId, amount) {
    const item = cart.find(product => product.id === productId);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Jewellery category filters
document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");
        displayProducts(button.dataset.category);
    });
});

// Open and close shopping bag
if (cartPanel) {
    cartPanel.hidden = true;
}

document.getElementById("cartButton")?.addEventListener("click", () => {
    if (cartPanel) cartPanel.hidden = false;
});

document.getElementById("closeCart")?.addEventListener("click", () => {
    if (cartPanel) cartPanel.hidden = true;
});

// Demo checkout enquiry
document.getElementById("checkoutButton")?.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }

    const orderDetails = cart.map(item =>
        `${item.name} x ${item.quantity}`
    ).join("\n");

    alert(
        "Thank you for choosing AMIT YELMAR!\n\n" +
        orderDetails +
        "\n\nThis is a demo store. No order or payment was processed."
    );
});

// Current year in footer
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Show products when website opens
displayProducts();
updateCart();
