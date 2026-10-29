
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
        name: "Elegant Gold Earrings",
        category: "earrings",
        price: 8999,
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Wedding Ring",
        category: "rings",
        price: 14999,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Bridal Necklace Set",
        category: "necklaces",
        price: 32999,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Classic Diamond Earrings",
        category: "earrings",
        price: 11999,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Forever Wedding Band",
        category: "rings",
        price: 17999,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

function displayProducts(category = "all") {
    if (!productGrid) return;

    const filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Timeless design for your special moments.</p>
                <div class="product-price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    ADD TO BAG
                </button>
            </div>
        </article>
    `).join("");
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        displayProducts(button.dataset.category);
    });
});

productGrid?.addEventListener("click", event => {
    const button = event.target.closest(".add-to-cart");
    if (!button) return;

    const product = products.find(
        item => item.id === Number(button.dataset.id)
    );

    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    cartPanel.hidden = false;
});

function updateCart() {
    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p>₹${item.price.toLocaleString("en-IN")} × ${item.quantity}</p>
            </div>
            <div>
                <button data-action="minus" data-id="${item.id}">−</button>
                <button data-action="plus" data-id="${item.id}">+</button>
                <button data-action="remove" data-id="${item.id}">Remove</button>
            </div>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartTotal.textContent = "₹" + total.toLocaleString("en-IN");
}

cartItems?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "plus") item.quantity++;
    if (action === "minus") item.quantity--;
    if (action === "remove" || item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
});

cartButton?.addEventListener("click", () => {
    cartPanel.hidden = false;
});

closeCart?.addEventListener("click", () => {
    cartPanel.hidden = true;
});

checkoutButton?.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }

    const message = cart.map(item =>
        `${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString("en-IN")}`
    ).join("\n");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const enquiry = encodeURIComponent(
        `Hello AMIT YELMAR, I would like to enquire about:\n${message}\nTotal: ₹${total.toLocaleString("en-IN")}`
    );

    window.location.href = `mailto:?subject=Jewellery Purchase Enquiry&body=${enquiry}`;
});

document.getElementById("year").textContent = new Date().getFullYear();

displayProducts();
updateCart();
