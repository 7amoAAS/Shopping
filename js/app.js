// ContentFul
const client = contentful.createClient({
	// This is the space ID. A space is like a project folder in Contentful terms
	space: "x710uccszhn9",
	// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
	accessToken: "5oNQNREfY7t7TlXc3YZjcCzAwLE9TFvoXaBtNCYg5Ns",
});

// Select items
const cartBtnEl = document.getElementById("cart-icon");
const cartOverlayEl = document.querySelector(".cart-overlay");
const cartArrowEl = document.querySelector(".cart-icon .arrow ");
const searchBtn = document.getElementById("search-btn");
const inputSaerchEl = document.getElementById("search");
const closeCartEl = document.getElementById("close-cart");
const productDOM = document.querySelector(".products-container");
const cartTotal = document.getElementById("total");
const cartItems = document.getElementById("cartNum");
const cartProducts = document.querySelector(".cart-products");
const clearAllProducts = document.querySelector(".remove-all-products");

let products = [];

// Cart
let cart = [];
// Buttons
let btnsDOM = [];

// Getting the products
class Products {
	async getProducts() {
		try {
			let contentful = await client.getEntries({
				content_type: "shopping",
			});

			// let result = await fetch("products.json");
			// let data = await result.json();
			products = contentful.items;
			products = products.map(product => {
				const { rate, title, price, description } = product.fields;
				const { id } = product.sys;
				const image = product.fields.image.fields.file.url;
				return { rate, title, price, description, id, image };
			});
			return products;
		} catch (error) {
			console.log(error);
		}
	}
}

inputSaerchEl.addEventListener("keyup", e => {
	const searchString = e.target.value;
	const filteredCharacters = products.filter(product => {
		return product.title.includes(searchString);
	});
	displayProducts(filteredCharacters);
	addToCart();
	setCartValues(cart);
});

// Display Products
const displayProducts = products => {
	let result = "";
	products.forEach(product => {
		result += `
		<article class="product">
		<div class="rate">
			<div class="star">
				<svg width="20" height="20" viewBox="0 0 25 25">
					<path
						fill="#ffffff"
						d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
					/>
				</svg>
			</div>
			<span>${product.rate}</span>
		</div>
		<div class="pro-image">
			<div class="add-product-to-cart" data-id=${product.id}>
				<button id="add-product-to-cart">
				<i class="bi bi-bag-plus-fill plus"></i>
				<i class="bi bi-bag-check-fill hide check"></i>
				</button>
			</div>
			<img src="${product.image}" alt="" />
		</div>
		<div class="product-info">
			<div class="pro-title-price">
				<h4>${product.title}</h4>
				<span>$${product.price}</span>
			</div>
			<div class="description-btn">
				<p>${product.description}</p>
				<div data-id=${product.id} class="buy-btn">
					<button class="btn btn-hover">buy</button>
				</div>
			</div>
		</div>
	</article>
		`;
	});
	productDOM.innerHTML = result;
};

// Add Item To Cart
const addToCart = () => {
	const btns = [...document.querySelectorAll(".add-product-to-cart")];
	btns.forEach(btn => {
		let id = btn.dataset.id;
		let plus = btn.querySelector(".plus");
		let check = btn.querySelector(".check");
		// let inCart = cart.find(item => item.id === id);
		// if (inCart) {
		// 	btn.disabled = true;
		// }
		btn.addEventListener("click", e => {
			plus.classList.add("hide");
			check.classList.remove("hide");
			// e.target.disabled = true;
			// Get product from products
			let cartItem = { ...Storage.getProduct(id), amount: 1 };
			// Add product to the cart
			cart = [...cart, cartItem];
			// Save cart in local storage
			Storage.saveCart(cart);
			// Set cart values
			setCartValues(cart);
			// Display cart item
			addCartItem(cartItem);
		});
	});
	const buyBtns = [...document.querySelectorAll(".buy-btn")];
	buyBtns.forEach(btn => {
		let id = btn.dataset.id;
		let inCart = cart.find(item => item.id === id);
		if (inCart) {
			btn.disabled = true;
		}
		btn.addEventListener("click", e => {
			e.target.disabled = true;
			let cartItem = { ...Storage.getProduct(id), amount: 1 };
			// Add product to the cart
			cart = [...cart, cartItem];
			// Save cart in local storage
			Storage.saveCart(cart);
			// Set cart values
			setCartValues(cart);
			// Display cart item
			addCartItem(cartItem);
		});
	});
};

// Set Cart Values
const setCartValues = cart => {
	let tempTotal = 0;
	let itemsTotal = 0;
	cart.map(item => {
		tempTotal += item.price * item.amount;
		itemsTotal += item.amount;
	});
	cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
	cartItems.innerText = itemsTotal;
};

const addCartItem = item => {
	const div = document.createElement("div");
	div.classList.add("product");
	div.innerHTML = `
	<div class="img">
			<img src="${item.image}" alt="" />
		</div>
		<div class="text-info">
			<h3 class="title">${item.title}</h3>
			<p class="description">${item.desc}</p>
			<span class="price" id="price">$${item.price}
			<span class="remove-icon">
				<button>
					<svg class="remove-item" data-id=${item.id} width="32" height="32" viewBox="0 0 28 28">
						<path
							d="M19.5 16a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11zM14 2.25a3.75 3.75 0 0 1 3.745 3.55l.005.2h5.5a.75.75 0 0 1 .102 1.493l-.102.007h-1.059l-.634 7.832a6.468 6.468 0 0 0-1.48-.307l.61-7.525H7.313l1.211 14.932a2.25 2.25 0 0 0 2.243 2.068l2.966.001c.287.551.651 1.056 1.077 1.5L10.767 26a3.75 3.75 0 0 1-3.738-3.447L5.808 7.5H4.75a.75.75 0 0 1-.743-.648L4 6.75a.75.75 0 0 1 .648-.743L4.75 6h5.5A3.75 3.75 0 0 1 14 2.25zm3.024 16.774a.5.5 0 0 0 0 .707l1.769 1.77l-1.767 1.766a.5.5 0 0 0 .707.708l1.767-1.767l1.77 1.769a.5.5 0 0 0 .707-.707L20.208 21.5l1.771-1.77a.5.5 0 1 0-.707-.707l-1.771 1.77l-1.77-1.77a.5.5 0 0 0-.707 0zM14 3.75a2.25 2.25 0 0 0-2.245 2.096L11.75 6h4.5l-.005-.154A2.25 2.25 0 0 0 14 3.75z"
							fill="hsl(219, 88%, 63%)"
							fill-rule="nonzero"
						/>
					</svg>
				</button>
			</span>
			</span>
		</div>
		<div class="num-of-pro c-i">
				<i class="bi bi-plus increase" data-id=${item.id} ></i>
			<span class="sum">${item.amount}</span>
				<i class="bi bi-dash minus" data-id=${item.id}></i>
		</div>
	`;
	cartProducts.appendChild(div);
};

// Display products
class UI {
	displayProducts(products) {
		let result = "";
		products.forEach(product => {
			result += `
			<article class="product">
			<div class="rate">
				<div class="star">
					<svg width="20" height="20" viewBox="0 0 25 25">
						<path
							fill="#ffffff"
							d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"
						/>
					</svg>
				</div>
				<span>${product.rate}</span>
			</div>
			<div class="pro-image">
				<div class="add-product-to-cart" data-id=${product.id}>
					<button id="add-product-to-cart">
					<i class="bi bi-bag-plus-fill plus"></i>
					<i class="bi bi-bag-check-fill hide check"></i>
					</button>
				</div>
				<img src="${product.image}" alt="" />
			</div>
			<div class="product-info">
				<div class="pro-title-price">
					<h4>${product.title}</h4>
					<span>$${product.price}</span>
				</div>
				<div class="description-btn">
					<p>${product.description}</p>
					<div data-id=${product.id} class="buy-btn">
						<button class="btn btn-hover">buy</button>
					</div>
				</div>
			</div>
		</article>
			`;
		});
		productDOM.innerHTML = result;
	}
	addToCart() {
		const btns = [...document.querySelectorAll(".add-product-to-cart")];
		btnsDOM = btns;
		btns.forEach(btn => {
			let plus = btn.querySelector(".plus");
			let check = btn.querySelector(".check");
			let id = btn.dataset.id;
			// let inCart = cart.find(item => item.id === id);
			// if (inCart) {
			// 	btn.disabled = true;
			// }
			btn.addEventListener("click", e => {
				plus.classList.add("hide");
				check.classList.remove("hide");
				// e.target.disabled = true;
				// Get product from products
				let cartItem = { ...Storage.getProduct(id), amount: 1 };
				// Add product to the cart
				cart = [...cart, cartItem];
				// Save cart in local storage
				Storage.saveCart(cart);
				// Set cart values
				this.setCartValues(cart);
				// Display cart item
				this.addCartItem(cartItem);
			});
		});
		const buyBtns = [...document.querySelectorAll(".buy-btn")];
		buyBtns.forEach(btn => {
			let id = btn.dataset.id;
			btn.addEventListener("click", e => {
				// e.target.disabled = true;
				let cartItem = { ...Storage.getProduct(id), amount: 1 };
				// Add product to the cart
				cart = [...cart, cartItem];
				// Save cart in local storage
				Storage.saveCart(cart);
				// Set cart values
				this.setCartValues(cart);
				// Display cart item
				this.addCartItem(cartItem);
			});
		});
	}
	setCartValues(cart) {
		let tempTotal = 0;
		let itemsTotal = 0;
		cart.map(item => {
			tempTotal += item.price * item.amount;
			itemsTotal += item.amount;
		});
		cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
		cartItems.innerText = itemsTotal;
	}
	addCartItem(item) {
		const div = document.createElement("div");
		div.classList.add("product");
		div.innerHTML = `
		<div class="img">
				<img src="${item.image}" alt="" />
			</div>
			<div class="text-info">
				<h3 class="title">${item.title}</h3>
				<p class="description">${item.desc}</p>
				<span class="price" id="price">$${item.price}
				<span class="remove-icon">
					<button>
						<svg class="remove-item" data-id=${item.id} width="32" height="32" viewBox="0 0 28 28">
							<path
								d="M19.5 16a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11zM14 2.25a3.75 3.75 0 0 1 3.745 3.55l.005.2h5.5a.75.75 0 0 1 .102 1.493l-.102.007h-1.059l-.634 7.832a6.468 6.468 0 0 0-1.48-.307l.61-7.525H7.313l1.211 14.932a2.25 2.25 0 0 0 2.243 2.068l2.966.001c.287.551.651 1.056 1.077 1.5L10.767 26a3.75 3.75 0 0 1-3.738-3.447L5.808 7.5H4.75a.75.75 0 0 1-.743-.648L4 6.75a.75.75 0 0 1 .648-.743L4.75 6h5.5A3.75 3.75 0 0 1 14 2.25zm3.024 16.774a.5.5 0 0 0 0 .707l1.769 1.77l-1.767 1.766a.5.5 0 0 0 .707.708l1.767-1.767l1.77 1.769a.5.5 0 0 0 .707-.707L20.208 21.5l1.771-1.77a.5.5 0 1 0-.707-.707l-1.771 1.77l-1.77-1.77a.5.5 0 0 0-.707 0zM14 3.75a2.25 2.25 0 0 0-2.245 2.096L11.75 6h4.5l-.005-.154A2.25 2.25 0 0 0 14 3.75z"
								fill="hsl(219, 88%, 63%)"
								fill-rule="nonzero"
							/>
						</svg>
					</button>
				</span>
				</span>
			</div>
			<div class="num-of-pro c-i">
					<i class="bi bi-plus increase" data-id=${item.id} ></i>
				<span class="sum">${item.amount}</span>
					<i class="bi bi-dash minus" data-id=${item.id}></i>
			</div>
		`;
		cartProducts.appendChild(div);
	}
	setupApp() {
		cart = Storage.getCart();
		this.setCartValues(cart);
		this.populateCart(cart);
	}
	populateCart(cart) {
		cart.forEach(item => this.addCartItem(item));
	}
	cartLogic() {
		clearAllProducts.addEventListener("click", () => {
			this.clearCart();
		});
		// Cart Functionality
		cartProducts.addEventListener("click", e => {
			if (e.target.classList.contains("remove-item")) {
				let removeItem = e.target;
				let id = removeItem.dataset.id;
				cartProducts.removeChild(removeItem.closest(".product"));
				this.removeItem(id);
			} else if (e.target.classList.contains("increase")) {
				let increase = e.target;
				let id = increase.dataset.id;
				let tempItem = cart.find(item => item.id === id);
				tempItem.amount = tempItem.amount + 1;
				Storage.saveCart(cart);
				this.setCartValues(cart);
				increase.nextElementSibling.innerText = tempItem.amount;
			} else if (e.target.classList.contains("minus")) {
				let decrease = e.target;
				let id = decrease.dataset.id;
				let tempItem = cart.find(item => item.id === id);
				tempItem.amount = tempItem.amount - 1;
				if (tempItem.amount > 0) {
					Storage.saveCart(cart);
					this.setCartValues(cart);
					decrease.previousElementSibling.innerText = tempItem.amount;
				} else {
					let removeItem = e.target;
					let id = removeItem.dataset.id;
					cartProducts.removeChild(removeItem.closest(".product"));
					this.removeItem(id);
				}
			}
		});
	}
	clearCart() {
		let cartItems = cart.map(item => item.id);
		cartItems.forEach(id => this.removeItem(id));
		while (cartProducts.children.length > 0) {
			cartProducts.removeChild(cartProducts.children[0]);
		}
	}
	removeItem(id) {
		cart = cart.filter(item => item.id !== id);
		this.setCartValues(cart);
		Storage.saveCart(cart);
		let btn = this.getSingleBtn(id);
		let plus = btn.querySelector(".plus");
		let check = btn.querySelector(".check");
		plus.classList.remove("hide");
		check.classList.add("hide");
		btn.disabled = false;
	}
	getSingleBtn(id) {
		return btnsDOM.find(btn => btn.dataset.id === id);
	}
}

// Local Storage
class Storage {
	static saveProducts(products) {
		localStorage.setItem("products", JSON.stringify(products));
	}
	static getProduct(id) {
		let products = JSON.parse(localStorage.getItem("products"));
		return products.find(product => product.id === id);
	}
	static saveCart(cart) {
		localStorage.setItem("cart", JSON.stringify(cart));
	}
	static getCart() {
		return localStorage.getItem("cart")
			? JSON.parse(localStorage.getItem("cart"))
			: [];
	}
}

//! AddEventListener
document.addEventListener("DOMContentLoaded", () => {
	const ui = new UI();
	const products = new Products();

	// Setup App
	ui.setupApp();

	// Get all products
	products
		.getProducts()
		.then(products => {
			ui.displayProducts(products);
			Storage.saveProducts(products);
		})
		.then(() => {
			ui.addToCart();
			ui.cartLogic();
		});
});
cartBtnEl.addEventListener("click", toggleCart);
closeCartEl.addEventListener("click", closeCart);
searchBtn.addEventListener("click", showInputForm);

//! Functions

function toggleCart() {
	cartOverlayEl.classList.toggle("hide");
	cartArrowEl.classList.toggle("hide");
}

function closeCart() {
	cartOverlayEl.classList.add("hide");
	cartArrowEl.classList.add("hide");
}

function showInputForm() {
	inputSaerchEl.classList.toggle("open");
}
