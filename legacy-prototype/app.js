const formatPrice = (value) =>
  Number(value || 0).toLocaleString('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
  });

const state = {
  products: [],
  options: {
    shippingMethods: [],
    paymentMethods: [],
  },
  filters: {
    category: '',
    brand: '',
    price: '',
    stock: false,
  },
  cart: JSON.parse(localStorage.getItem('dk-cart') || '[]'),
  loadingProducts: true,
  loadError: '',
  checkout: {
    shippingMethod: '',
    paymentMethod: '',
  },
};

const elements = {
  productGrid: document.getElementById('product-grid'),
  categoryFilter: document.getElementById('category-filter'),
  brandFilter: document.getElementById('brand-filter'),
  priceFilter: document.getElementById('price-filter'),
  stockFilter: document.getElementById('stock-filter'),
  cartSummary: document.getElementById('cart-summary'),
  cart: document.getElementById('cart'),
  cartClose: document.getElementById('cart-close'),
  cartItems: document.getElementById('cart-items'),
  cartEmpty: document.getElementById('cart-empty'),
  cartTotal: document.getElementById('cart-total'),
  cartCount: document.getElementById('cart-count'),
  checkoutBtn: document.getElementById('checkout-btn'),
  filtersForm: document.getElementById('filters'),
  navToggle: document.querySelector('.nav-toggle'),
  navLinks: document.querySelector('.nav-links'),
  checkout: document.getElementById('checkout'),
  checkoutClose: document.getElementById('checkout-close'),
  checkoutForm: document.getElementById('checkout-form'),
  checkoutStatus: document.getElementById('checkout-status'),
  checkoutSummary: document.getElementById('checkout-summary'),
  checkoutSubmit: document.getElementById('checkout-submit'),
  checkoutShipping: document.getElementById('checkout-shipping'),
  checkoutPayment: document.getElementById('checkout-payment'),
};

const persistCart = () => {
  localStorage.setItem('dk-cart', JSON.stringify(state.cart));
};

const fetchJSON = async (url) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Nepodařilo se načíst data.');
  }
  return response.json();
};

const getFilteredProducts = () => {
  const source = state.products;
  return source.filter((product) => {
    const { category, brand, price, stock } = state.filters;

    if (category && product.category !== category) return false;
    if (brand && product.brand !== brand) return false;
    if (price && product.price > Number(price)) return false;
    if (stock && !product.stock) return false;

    return true;
  });
};

const getProductById = (id) => state.products.find((product) => product.id === id);

const createProductCard = (product) => {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      ${product.stock ? '' : '<span class="badge badge--warning">Na cestě</span>'}
      ${product.tags
        .map((tag) => `<span class="badge">${tag}</span>`)
        .join('')}
    </div>
    <div class="product-card__body">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <ul class="product-card__meta">
        <li><strong>Kategorie:</strong> ${product.category}</li>
        <li><strong>Značka:</strong> ${product.brand}</li>
        <li><strong>Dostupnost:</strong> ${product.shipping}</li>
      </ul>
    </div>
    <div class="product-card__footer">
      <div>
        <strong class="product-card__price">${formatPrice(product.price)}</strong>
        <span class="product-card__stock ${
          product.stock ? 'in-stock' : 'preorder'
        }">
          ${product.stock ? 'Skladem u partnera' : 'Předobjednávka'}
        </span>
      </div>
      <button class="btn btn--primary" data-id="${product.id}">
        Přidat do košíku
      </button>
    </div>
  `;

  card
    .querySelector('button')
    .addEventListener('click', () => addToCart(product.id));

  return card;
};

const renderProducts = () => {
  elements.productGrid.innerHTML = '';

  if (state.loadingProducts) {
    const loading = document.createElement('p');
    loading.className = 'product-grid__empty';
    loading.textContent = 'Načítáme produkty...';
    elements.productGrid.appendChild(loading);
    return;
  }

  if (state.loadError) {
    const error = document.createElement('p');
    error.className = 'product-grid__empty';
    error.textContent = state.loadError;
    elements.productGrid.appendChild(error);
    return;
  }

  const filtered = getFilteredProducts();

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'product-grid__empty';
    empty.textContent =
      'Žádné produkty neodpovídají zvoleným filtrům. Zkuste upravit výběr.';
    elements.productGrid.appendChild(empty);
    return;
  }

  filtered.forEach((product) => {
    elements.productGrid.appendChild(createProductCard(product));
  });
};

const populateSelect = (selectElement, values) => {
  const fragment = document.createDocumentFragment();
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    fragment.appendChild(option);
  });
  selectElement.appendChild(fragment);
};

const populateFilters = () => {
  const categories = Array.from(new Set(state.products.map((p) => p.category))).sort();
  const brands = Array.from(new Set(state.products.map((p) => p.brand))).sort();

  populateSelect(elements.categoryFilter, categories);
  populateSelect(elements.brandFilter, brands);
};

const renderCheckoutOptions = () => {
  const { shippingMethods, paymentMethods } = state.options;

  if (shippingMethods.length && !state.checkout.shippingMethod) {
    state.checkout.shippingMethod = shippingMethods[0].id;
  }
  if (paymentMethods.length && !state.checkout.paymentMethod) {
    state.checkout.paymentMethod = paymentMethods[0].id;
  }

  elements.checkoutShipping.innerHTML = '';
  elements.checkoutPayment.innerHTML = '';

  shippingMethods.forEach((method) => {
    const option = document.createElement('option');
    option.value = method.id;
    option.textContent = `${method.label} (${formatPrice(method.price)})`;
    option.selected = state.checkout.shippingMethod === method.id;
    elements.checkoutShipping.appendChild(option);
  });

  paymentMethods.forEach((method) => {
    const option = document.createElement('option');
    option.value = method.id;
    option.textContent = method.label;
    option.selected = state.checkout.paymentMethod === method.id;
    elements.checkoutPayment.appendChild(option);
  });
};

const getCheckoutDetails = () => {
  const items = state.cart
    .map((cartItem) => {
      const product = getProductById(cartItem.id);
      if (!product) return null;
      return {
        ...product,
        quantity: cartItem.quantity,
        lineTotal: product.price * cartItem.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = state.options.shippingMethods.find(
    (method) => method.id === state.checkout.shippingMethod
  );
  const shippingPrice = shipping ? shipping.price : 0;
  const total = subtotal + shippingPrice;

  return { items, subtotal, shipping, total };
};

const renderCheckoutSummary = () => {
  if (!elements.checkoutSummary) return;
  const summary = getCheckoutDetails();

  elements.checkoutSummary.innerHTML = '';

  if (!summary.items.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Košík je prázdný. Přidejte si produkty před odesláním objednávky.';
    empty.className = 'checkout-summary__empty';
    elements.checkoutSummary.appendChild(empty);
    elements.checkoutSubmit.disabled = true;
    return;
  }

  summary.items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'checkout-summary__item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>${item.quantity} ks × ${formatPrice(item.price)}</span>
      </div>
      <span>${formatPrice(item.lineTotal)}</span>
    `;
    elements.checkoutSummary.appendChild(row);
  });

  if (summary.shipping) {
    const shippingRow = document.createElement('div');
    shippingRow.className = 'checkout-summary__item';
    shippingRow.innerHTML = `
      <div><strong>Doprava</strong><span>${summary.shipping.label}</span></div>
      <span>${formatPrice(summary.shipping.price)}</span>
    `;
    elements.checkoutSummary.appendChild(shippingRow);
  }

  const totalRow = document.createElement('div');
  totalRow.className = 'checkout-summary__total';
  totalRow.innerHTML = `
    <span>Celkem</span>
    <strong>${formatPrice(summary.total)}</strong>
  `;
  elements.checkoutSummary.appendChild(totalRow);

  elements.checkoutSubmit.disabled = false;
};

const addToCart = (productId) => {
  const existing = state.cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  persistCart();
  renderCart();
  renderCheckoutSummary();
  toggleCart(true);
};

const removeFromCart = (productId) => {
  state.cart = state.cart.filter((item) => item.id !== productId);
  persistCart();
  renderCart();
  renderCheckoutSummary();
};

const updateQuantity = (productId, delta) => {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    persistCart();
    renderCart();
    renderCheckoutSummary();
  }
};

const renderCart = () => {
  elements.cartItems.innerHTML = '';

  if (!state.cart.length) {
    elements.cartEmpty.style.display = 'block';
    elements.cartItems.appendChild(elements.cartEmpty);
    elements.cartTotal.textContent = formatPrice(0);
    elements.cartCount.textContent = '0';
    return;
  }

  elements.cartEmpty.style.display = 'none';
  let total = 0;
  let totalItems = 0;

  state.cart.forEach((cartItem) => {
    const product = getProductById(cartItem.id);
    if (!product) return;
    total += product.price * cartItem.quantity;
    totalItems += cartItem.quantity;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <h4>${product.name}</h4>
        <p>${formatPrice(product.price)} • ${product.shipping}</p>
      </div>
      <div class="cart-item__controls">
        <div class="quantity">
          <button type="button" aria-label="Snížit množství" data-action="decrease">−</button>
          <span>${cartItem.quantity}</span>
          <button type="button" aria-label="Zvýšit množství" data-action="increase">+</button>
        </div>
        <button class="link" type="button" data-action="remove">Odstranit</button>
      </div>
    `;

    const [decrease, , increase] = row.querySelectorAll('button[data-action]');
    decrease.addEventListener('click', () => updateQuantity(cartItem.id, -1));
    increase.addEventListener('click', () => updateQuantity(cartItem.id, 1));
    row
      .querySelector("button[data-action='remove']")
      .addEventListener('click', () => removeFromCart(cartItem.id));

    elements.cartItems.appendChild(row);
  });

  elements.cartTotal.textContent = formatPrice(total);
  elements.cartCount.textContent = totalItems.toString();
};

const toggleCart = (open) => {
  const isOpen = elements.cart.classList.contains('cart--open');
  const nextState = open !== undefined ? open : !isOpen;
  elements.cart.setAttribute('aria-hidden', (!nextState).toString());
  elements.cart.classList.toggle('cart--open', nextState);
  document.body.classList.toggle('no-scroll', nextState);

  if (nextState) {
    closeCheckout();
  }
};

const openCheckout = () => {
  if (!state.cart.length) {
    elements.checkoutStatus.hidden = false;
    elements.checkoutStatus.textContent = 'Košík je prázdný. Přidejte si produkty do objednávky.';
    return;
  }
  elements.checkout.classList.add('checkout--open');
  elements.checkout.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  toggleCart(false);
  elements.checkoutStatus.hidden = true;
  renderCheckoutSummary();
};

const closeCheckout = () => {
  elements.checkout.classList.remove('checkout--open');
  elements.checkout.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  elements.checkoutStatus.hidden = true;
  elements.checkoutStatus.classList.remove('checkout-status--error');
  elements.checkoutStatus.classList.remove('checkout-status--success');
  elements.checkoutForm.reset();
  renderCheckoutOptions();
  renderCheckoutSummary();
};

const submitOrder = async (event) => {
  event.preventDefault();
  if (!state.cart.length) return;

  const formData = new FormData(elements.checkoutForm);
  const payload = {
    customer: {
      name: formData.get('name')?.trim(),
      email: formData.get('email')?.trim(),
      phone: formData.get('phone')?.trim(),
      address: formData.get('address')?.trim(),
      city: formData.get('city')?.trim(),
      zip: formData.get('zip')?.trim(),
      country: formData.get('country')?.trim(),
    },
    note: formData.get('note')?.trim() || '',
    shippingMethod: state.checkout.shippingMethod,
    paymentMethod: state.checkout.paymentMethod,
    items: state.cart.map((item) => ({ id: item.id, quantity: item.quantity })),
  };

  elements.checkoutSubmit.disabled = true;
  elements.checkoutSubmit.textContent = 'Odesíláme objednávku...';
  elements.checkoutStatus.hidden = true;

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Objednávku se nepodařilo dokončit.');
    }

    state.cart = [];
    persistCart();
    renderCart();
    renderCheckoutSummary();

    elements.checkoutStatus.hidden = false;
    elements.checkoutStatus.classList.remove('checkout-status--error');
    elements.checkoutStatus.classList.remove('checkout-status--success');
    elements.checkoutStatus.classList.add('checkout-status--success');
    elements.checkoutStatus.innerHTML = `
      <strong>Objednávka přijata!</strong><br />
      Číslo objednávky: ${result.orderId}.<br />
      Faktura byla uložena jako ${result.invoice.invoiceId}. Za pár minut vám přijde potvrzovací e-mail.
    `;

    elements.checkoutForm.reset();
    renderCheckoutOptions();
    elements.checkoutSubmit.textContent = 'Odeslat objednávku';
    elements.checkoutSubmit.disabled = false;
  } catch (error) {
    elements.checkoutStatus.hidden = false;
    elements.checkoutStatus.classList.remove('checkout-status--success');
    elements.checkoutStatus.classList.add('checkout-status--error');
    elements.checkoutStatus.textContent = error.message;
    elements.checkoutSubmit.textContent = 'Odeslat objednávku';
    elements.checkoutSubmit.disabled = false;
  }
};

const bindEvents = () => {
  elements.filtersForm.addEventListener('change', (event) => {
    const { name, type, value, checked } = event.target;

    if (!name && event.target.id === 'stock-filter') {
      state.filters.stock = checked;
    } else if (type === 'select-one') {
      state.filters[name] = value;
    }

    renderProducts();
  });

  elements.filtersForm.addEventListener('reset', () => {
    state.filters = {
      category: '',
      brand: '',
      price: '',
      stock: false,
    };
    setTimeout(() => {
      elements.stockFilter.checked = false;
      renderProducts();
    }, 0);
  });

  elements.stockFilter.addEventListener('change', (event) => {
    state.filters.stock = event.target.checked;
    renderProducts();
  });

  elements.cartSummary.addEventListener('click', () => toggleCart());
  elements.cartClose.addEventListener('click', () => toggleCart(false));
  elements.checkoutBtn.addEventListener('click', openCheckout);
  elements.checkoutClose.addEventListener('click', closeCheckout);
  elements.checkoutForm.addEventListener('submit', submitOrder);

  elements.checkoutShipping.addEventListener('change', (event) => {
    state.checkout.shippingMethod = event.target.value;
    renderCheckoutSummary();
  });

  elements.checkoutPayment.addEventListener('change', (event) => {
    state.checkout.paymentMethod = event.target.value;
  });

  elements.navToggle.addEventListener('click', () => {
    const expanded = elements.navLinks.classList.toggle('nav-links--open');
    elements.navToggle.setAttribute('aria-expanded', expanded);
  });

  elements.navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      elements.navLinks.classList.remove('nav-links--open');
      elements.navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (elements.cart.classList.contains('cart--open')) {
        toggleCart(false);
      }
      if (elements.checkout.classList.contains('checkout--open')) {
        closeCheckout();
      }
    }
  });
};

const loadInitialData = async () => {
  try {
    const [products, options] = await Promise.all([
      fetchJSON('/api/products'),
      fetchJSON('/api/options'),
    ]);
    state.products = products;
    state.options = options;
    state.loadingProducts = false;
    populateFilters();
    renderProducts();
    renderCart();
    renderCheckoutOptions();
    renderCheckoutSummary();
  } catch (error) {
    state.loadingProducts = false;
    state.loadError = error.message;
    renderProducts();
  }
};

const init = () => {
  bindEvents();
  renderCart();
  loadInitialData();
};

document.addEventListener('DOMContentLoaded', init);
