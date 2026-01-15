'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import optionsData from '../data/options.json';
import productsData from '../data/products.json';

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: boolean;
  shipping: string;
  image: string;
  tags: string[];
};

type ShippingMethod = {
  id: string;
  label: string;
  price: number;
};

type PaymentMethod = {
  id: string;
  label: string;
};

type Filters = {
  category: string;
  brand: string;
  price: string;
  stock: boolean;
};

type CartItem = {
  id: string;
  quantity: number;
};

type CheckoutStatus = {
  type: 'success' | 'error';
  message: string;
};

type NewsletterStatus = {
  type: 'success' | 'error';
  message: string;
};

const products = productsData as Product[];
const { shippingMethods, paymentMethods } = optionsData as {
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(value);

const navLinks = [
  { href: '#produkty', label: 'Produkty' },
  { href: '#dropshipping', label: 'Jak funguje' },
  { href: '#vyhody', label: 'Výhody' },
  { href: '#faq', label: 'FAQ' },
  { href: '#kontakt', label: 'Kontakt' },
];

const uspBlocks = [
  {
    title: 'Garance originality',
    description: 'Nakupujete přímo z distribuční sítě Wizards of the Coast a ověřených výrobců doplňků.',
  },
  {
    title: 'Průběžné novinky',
    description: 'Pravidelně přidáváme nové oficiální moduly, kampaně a limitované runy.',
  },
  {
    title: 'Flexibilní platba',
    description: 'Platba kartou, bankovním převodem, Apple Pay i Twisto na fakturu.',
  },
  {
    title: 'Podpora hráčů',
    description: 'Zkušení DM a hráči na chatu poradí s výběrem příruček i s tvorbou kampaně.',
  },
];

const dropshippingSteps = [
  {
    step: '1',
    title: 'Napojení na distributory',
    description: 'Vidíme skladovost v reálném čase. Zobrazené produkty jsou opravdu dostupné.',
  },
  {
    step: '2',
    title: 'Automatické objednávky',
    description: 'Po zaplacení odešleme objednávku partnerovi a zajistíme fakturaci včetně DPH.',
  },
  {
    step: '3',
    title: 'Tracking zásilky',
    description: 'Dostanete sledovací číslo a čas doručení. Servis řeší i případné reklamace.',
  },
  {
    step: '4',
    title: 'Podpora po dodání',
    description: 'Tým hráčů poradí s pravidly, rozšířeními i péčí o prémiové produkty.',
  },
];

const partnerLogos = [
  'Wizards Direct',
  'Legend Dice UK',
  'Gale Force Nine',
  'Critical Role Shop',
  "Beadle & Grimm's",
];

const testimonials = [
  {
    quote:
      '„Balíček z USA dorazil za 6 dní a kostky vypadají ještě lépe než na fotkách. Díky za doporučení!“',
    author: 'Petra, DM z Brna',
  },
  {
    quote: '„Objednali jsme startovní set a český manuál byl součástí balení. Super servis!“',
    author: 'Martin, klub Draci z Vysočiny',
  },
  {
    quote: '„Líbí se mi, že vidím aktuální skladovost. Dropshipping funguje bez starostí.“',
    author: 'Jana, hráčka z Prahy',
  },
];

const faqs = [
  {
    question: 'Jaká je doba doručení?',
    answer:
      'U produktů skladem v EU doručujeme do 3 pracovních dní. U USA počítejte s 5–8 dny, proclení řešíme za vás.',
  },
  {
    question: 'Řešíte reklamace a vrácení zboží?',
    answer:
      'Ano, reklamace zajišťujeme společně s distributorem. Stačí číslo objednávky, zbytek vyřešíme my.',
  },
  {
    question: 'Je možné platit na fakturu?',
    answer: 'Pro kluby a školy nabízíme fakturaci se splatností 14 dní. Stačí nás kontaktovat předem.',
  },
  {
    question: 'Mohu sledovat stav zásilky?',
    answer:
      'Ano, každý balík má sledovací číslo. Posíláme ho e-mailem a najdete ho i v zákaznickém portálu.',
  },
];

export default function Page() {
  const [navOpen, setNavOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({ category: '', brand: '', price: '', stock: false });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<string>(shippingMethods[0]?.id ?? '');
  const [selectedPayment, setSelectedPayment] = useState<string>(paymentMethods[0]?.id ?? '');
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<NewsletterStatus | null>(null);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), []);
  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand))).sort(), []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }
      if (filters.price && product.price > Number(filters.price)) {
        return false;
      }
      if (filters.stock && !product.stock) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const detailedCartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.id);
        if (!product) {
          return null;
        }
        return { ...item, product };
      })
      .filter((value): value is { id: string; quantity: number; product: Product } => Boolean(value));
  }, [cart]);

  const cartCount = useMemo(() => detailedCartItems.reduce((sum, item) => sum + item.quantity, 0), [detailedCartItems]);
  const cartSubtotal = useMemo(
    () => detailedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [detailedCartItems],
  );
  const visibleNavLinks = useMemo(
    () => navLinks.filter((link) => link.label !== 'Stanoviště'),
    [],
  );

  const shippingOption = shippingMethods.find((method) => method.id === selectedShipping) ?? shippingMethods[0];
  const orderTotal = cartSubtotal + (shippingOption?.price ?? 0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedCart = window.localStorage.getItem('dk-cart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart) as CartItem[];
        setCart(parsed);
      } catch (error) {
        console.warn('Failed to parse stored cart', error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('dk-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const shouldLockScroll = isCartOpen || isCheckoutOpen;
    document.body.classList.toggle('no-scroll', shouldLockScroll);
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isCartOpen, isCheckoutOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCartOpen(false);
        setCheckoutOpen(false);
        setNavOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return undefined;
  }, []);

  const handleFilterChange = (name: keyof Filters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: '', brand: '', price: '', stock: false });
  };

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
    setCartOpen(true);
    setCheckoutOpen(false);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const handleCheckoutOpen = () => {
    if (!detailedCartItems.length) {
      setCheckoutStatus({ type: 'error', message: 'Košík je prázdný. Přidejte si produkty do objednávky.' });
      setCheckoutOpen(false);
      setCartOpen(true);
      return;
    }
    if (!selectedShipping && shippingMethods[0]) {
      setSelectedShipping(shippingMethods[0].id);
    }
    if (!selectedPayment && paymentMethods[0]) {
      setSelectedPayment(paymentMethods[0].id);
    }
    setCheckoutStatus(null);
    setCheckoutOpen(true);
    setCartOpen(false);
  };

  const handleCheckoutClose = () => {
    setCheckoutOpen(false);
    setCheckoutStatus(null);
    setCheckoutLoading(false);
  };

  const handleCheckoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detailedCartItems.length) {
      setCheckoutStatus({ type: 'error', message: 'Košík je prázdný. Přidejte si produkty do objednávky.' });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      customer: {
        name: formData.get('name')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        phone: formData.get('phone')?.toString().trim(),
        address: formData.get('address')?.toString().trim(),
        city: formData.get('city')?.toString().trim(),
        zip: formData.get('zip')?.toString().trim(),
        country: formData.get('country')?.toString().trim(),
      },
      note: formData.get('note')?.toString().trim() ?? '',
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
    };

    setCheckoutLoading(true);
    setCheckoutStatus(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: { orderId?: string; invoice?: { invoiceId?: string }; message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? 'Objednávku se nepodařilo dokončit.');
      }

      setCart([]);
      event.currentTarget.reset();
      setSelectedShipping(shippingMethods[0]?.id ?? '');
      setSelectedPayment(paymentMethods[0]?.id ?? '');
      setCheckoutStatus({
        type: 'success',
        message: `Objednávka přijata! Číslo objednávky: ${data.orderId}. Faktura byla vystavena jako ${data.invoice?.invoiceId}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Objednávku se nepodařilo dokončit.';
      setCheckoutStatus({ type: 'error', message });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const newsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('newsletter-email')?.toString().trim();

    if (!email) {
      setNewsletterStatus({ type: 'error', message: 'Zadejte prosím platnou e-mailovou adresu.' });
      return;
    }

    setNewsletterStatus({ type: 'success', message: 'Děkujeme! Potvrzení odběru je na cestě do vaší schránky.' });
    event.currentTarget.reset();
  };

  return (
    <>
      <header>
        <div className="top-bar">
          <div className="top-bar__info">
            <span>📦 Objednávky odesíláme přímo od oficiálních distributorů D&D.</span>
            <span>💬 Zákaznická linka: +420 777 123 456</span>
          </div>
        </div>
        <nav className="main-nav" aria-label="Hlavní navigace">
          <div className="container">
            <Link className="logo" href="#hero" onClick={() => setNavOpen(false)}>
              Drak &amp; Kostky
            </Link>
            <button
              className="nav-toggle"
              type="button"
              aria-expanded={navOpen}
              aria-controls="primary-navigation"
              onClick={() => setNavOpen((previous) => !previous)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <ul
              id="primary-navigation"
              className={`nav-links ${navOpen ? 'nav-links--open' : ''}`}
              onClick={() => setNavOpen(false)}
            >
              {visibleNavLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
            <button className="cart-summary" type="button" onClick={() => setCartOpen((previous) => !previous)}>
              <span className="cart-summary__icon" aria-hidden="true">
                🛒
              </span>
              <span>Košík</span>
              <span className="cart-summary__count" aria-live="polite">
                {cartCount}
              </span>
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="container hero__content">
            <div className="hero__text">
              <p className="hero__tag">Oficiální partner Wizards of the Coast</p>
              <h1>Český e-shop pro Dungeons &amp; Dragons dobrodruhy</h1>
              <p>
                Vydejte se na epickou výpravu s prémiovými kostkami, miniaturami a oficiálními příručkami. Logistiku řešíme
                dropshippingem přímo od ověřených distributorů.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#produkty">
                  Prohlédnout produkty
                </a>
                <a className="btn btn--ghost" href="#dropshipping">
                  Jak funguje dropshipping
                </a>
              </div>
              <ul className="hero__badges">
                <li>✔️ Oficiální licence D&amp;D</li>
                <li>🚚 Odeslání do 48 hodin</li>
                <li>🌍 Dodání po celé EU</li>
              </ul>
            </div>
            <div className="hero__visual">
              <div className="hero__visual-card">
                <Image
                  src="https://images.unsplash.com/photo-1612036782180-6f0b6cd649b6?auto=format&fit=crop&w=800&q=80"
                  alt="Prémiová sada D&D kostek"
                  width={800}
                  height={600}
                  priority
                />
                <div className="hero__visual-overlay">
                  <p>Limitované edice kostek</p>
                  <span>už od 649 Kč</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="usp" id="vyhody">
          <div className="container">
            <div className="section-header">
              <h2>Proč nakupovat u nás</h2>
              <p>Spojujeme komunitu hráčů D&amp;D s nejlepšími oficiálními produkty a jistotou rychlého doručení.</p>
            </div>
            <div className="usp__grid">
              {uspBlocks.map((block) => (
                <article key={block.title}>
                  <h3>{block.title}</h3>
                  <p>{block.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="product-filters" aria-label="Filtr produktů">
          <div className="container">
            <form
              className="filters"
              onReset={(event) => {
                event.preventDefault();
                resetFilters();
              }}
            >
              <div className="filters__group">
                <label htmlFor="category-filter">Kategorie</label>
                <select
                  id="category-filter"
                  name="category"
                  value={filters.category}
                  onChange={(event) => handleFilterChange('category', event.target.value)}
                >
                  <option value="">Vše</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filters__group">
                <label htmlFor="brand-filter">Značka</label>
                <select
                  id="brand-filter"
                  name="brand"
                  value={filters.brand}
                  onChange={(event) => handleFilterChange('brand', event.target.value)}
                >
                  <option value="">Vše</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filters__group">
                <label htmlFor="price-filter">Cena do</label>
                <select
                  id="price-filter"
                  name="price"
                  value={filters.price}
                  onChange={(event) => handleFilterChange('price', event.target.value)}
                >
                  <option value="">Bez limitu</option>
                  <option value="1000">1 000 Kč</option>
                  <option value="1500">1 500 Kč</option>
                  <option value="2000">2 000 Kč</option>
                  <option value="3000">3 000 Kč</option>
                </select>
              </div>
              <div className="filters__group">
                <label className="checkbox" htmlFor="stock-filter">
                  <input
                    id="stock-filter"
                    type="checkbox"
                    checked={filters.stock}
                    onChange={(event) => handleFilterChange('stock', event.target.checked)}
                  />
                  <span>Skladem u partnera</span>
                </label>
              </div>
              <button className="btn btn--ghost" type="reset">
                Vymazat
              </button>
            </form>
          </div>
        </section>

        <section className="products" id="produkty">
          <div className="container">
            <div className="section-header">
              <h2>Vyberte si své vybavení</h2>
              <p>Kompletní nabídka oficiálních D&amp;D produktů s aktuálním statusem dostupnosti.</p>
            </div>
            <div className="product-grid" aria-live="polite">
              {filteredProducts.length === 0 ? (
                <p className="product-grid__empty">
                  Žádné produkty neodpovídají zvoleným filtrům. Zkuste upravit výběr.
                </p>
              ) : (
                filteredProducts.map((product) => {
                  const isInStock = product.stock;
                  return (
                    <article className="product-card" key={product.id}>
                      <div className="product-card__image">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={600}
                          height={420}
                          sizes="(min-width: 1024px) 300px, 100vw"
                        />
                        {!isInStock && <span className="badge badge--warning">Na cestě</span>}
                        {product.tags.map((tag) => (
                          <span className="badge" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="product-card__body">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <ul className="product-card__meta">
                          <li>
                            <strong>Kategorie:</strong> {product.category}
                          </li>
                          <li>
                            <strong>Značka:</strong> {product.brand}
                          </li>
                          <li>
                            <strong>Dostupnost:</strong> {product.shipping}
                          </li>
                        </ul>
                      </div>
                      <div className="product-card__footer">
                        <div>
                          <strong className="product-card__price">{formatPrice(product.price)}</strong>
                          <span className={`product-card__stock ${isInStock ? 'in-stock' : 'preorder'}`}>
                            {isInStock ? 'Skladem u partnera' : 'Předobjednávka'}
                          </span>
                        </div>
                        <button className="btn btn--primary" type="button" onClick={() => addToCart(product.id)}>
                          Přidat do košíku
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="dropshipping" id="dropshipping">
          <div className="container">
            <div className="section-header">
              <h2>Jak funguje náš dropshipping</h2>
              <p>Vy si vyberete produkty, my je rezervujeme u dodavatele a ten je odešle přímo k vám.</p>
            </div>
            <div className="dropshipping__grid">
              {dropshippingSteps.map((step) => (
                <article key={step.step}>
                  <span className="step" aria-hidden="true">
                    {step.step}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="partners" aria-label="Naši partneři">
          <div className="container">
            <div className="section-header">
              <h2>Partnerská síť</h2>
              <p>Spolupracujeme s oficiálními licencovanými velkoobchody a výrobci prémiových doplňků.</p>
            </div>
            <div className="partner-logos">
              {partnerLogos.map((partner) => (
                <span key={partner}>{partner}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="testimonials">
          <div className="container">
            <div className="section-header">
              <h2>Hráči o nás říkají</h2>
              <p>Reference z české D&amp;D komunity.</p>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((testimonial) => (
                <article key={testimonial.author}>
                  <p>{testimonial.quote}</p>
                  <span>— {testimonial.author}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="newsletter" aria-label="Přihláška k odběru">
          <div className="container newsletter__content">
            <div>
              <h2>Získávejte novinky o limitovaných edicích</h2>
              <p>Maximálně jednou měsíčně posíláme nové produkty, akce a tipy pro vaše kampaně.</p>
              {newsletterStatus && (
                <p
                  role="status"
                  style={{ color: newsletterStatus.type === 'success' ? '#6ad18d' : '#f4d47a', marginTop: '12px' }}
                >
                  {newsletterStatus.message}
                </p>
              )}
            </div>
            <form className="newsletter__form" onSubmit={newsletterSubmit}>
              <input type="email" name="newsletter-email" placeholder="Vaše e-mailová adresa" required />
              <button className="btn btn--primary" type="submit">
                Odebírat
              </button>
            </form>
          </div>
        </section>

        <section className="faq" id="faq" aria-label="Často kladené dotazy">
          <div className="container">
            <div className="section-header">
              <h2>FAQ</h2>
              <p>Vše, co vás zajímá o nákupu přes dropshipping.</p>
            </div>
            <div className="faq__items">
              {faqs.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="kontakt">
        <div className="container footer__grid">
          <div>
            <h3>Drak &amp; Kostky</h3>
            <p>Specializovaný D&amp;D e-shop s dropshipping logistikou a podporou české komunity.</p>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>E-mail: podpora@drakakostky.cz</li>
              <li>Tel: +420 777 123 456</li>
              <li>Sídlo: Dračí hrad 13, Praha</li>
            </ul>
          </div>
          <div>
            <h4>Užitečné odkazy</h4>
            <ul>
              <li>
                <a href="#produkty">Katalog</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#dropshipping">Logistika</a>
              </li>
              <li>
                <a href="#vyhody">Proč my</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Právní</h4>
            <ul>
              <li>Obchodní podmínky</li>
              <li>Ochrana osobních údajů</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>
        <p className="footer__note">© 2024 Drak &amp; Kostky. Všechna práva vyhrazena.</p>
      </footer>

      <div className={`cart ${isCartOpen ? 'cart--open' : ''}`} aria-hidden={!isCartOpen}>
        <div className="cart__header">
          <h2>Košík</h2>
          <button className="cart__close" type="button" aria-label="Zavřít košík" onClick={() => setCartOpen(false)}>
            ×
          </button>
        </div>
        <div className="cart__body">
          {!detailedCartItems.length ? (
            <p className="cart__empty">Váš košík je zatím prázdný.</p>
          ) : (
            detailedCartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <h4>{item.product.name}</h4>
                  <p>
                    {formatPrice(item.product.price)} • {item.product.shipping}
                  </p>
                </div>
                <div className="cart-item__controls">
                  <div className="quantity" aria-label={`Množství pro ${item.product.name}`}>
                    <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Snížit množství">
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Zvýšit množství">
                      +
                    </button>
                  </div>
                  <button className="link" type="button" onClick={() => removeFromCart(item.id)}>
                    Odstranit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart__footer">
          <div className="cart__summary">
            <span>Mezisoučet</span>
            <strong>{formatPrice(cartSubtotal)}</strong>
          </div>
          <p className="cart__note">
            Objednávkou potvrzujete, že zboží bude odesláno přímo od partnerského distributora.
          </p>
          <button className="btn btn--primary" type="button" onClick={handleCheckoutOpen}>
            Pokračovat k objednávce
          </button>
        </div>
      </div>

      <div className={`checkout ${isCheckoutOpen ? 'checkout--open' : ''}`} aria-hidden={!isCheckoutOpen}>
        <div className="checkout__dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <button className="checkout__close" type="button" aria-label="Zavřít objednávku" onClick={handleCheckoutClose}>
            ×
          </button>
          <h2 id="checkout-title">Dokončení objednávky</h2>
          <p className="checkout__intro">
            Vyplňte prosím doručovací údaje. Platba a fakturace proběhne automaticky přes propojené systémy partnerů.
          </p>
          <div className="checkout__grid">
            <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
              <div className="form-row">
                <label>
                  Jméno a příjmení
                  <input name="name" type="text" required autoComplete="name" />
                </label>
                <label>
                  E-mail
                  <input name="email" type="email" required autoComplete="email" />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Telefon
                  <input name="phone" type="tel" required autoComplete="tel" />
                </label>
                <label>
                  Ulice a číslo
                  <input name="address" type="text" required autoComplete="address-line1" />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Město
                  <input name="city" type="text" required autoComplete="address-level2" />
                </label>
                <label>
                  PSČ
                  <input name="zip" type="text" required autoComplete="postal-code" />
                </label>
              </div>
              <label>
                Země
                <input name="country" type="text" defaultValue="Česká republika" required />
              </label>
              <label>
                Doprava
                <select value={selectedShipping} onChange={(event) => setSelectedShipping(event.target.value)} required>
                  {shippingMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.label} ({formatPrice(method.price)})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Platba
                <select value={selectedPayment} onChange={(event) => setSelectedPayment(event.target.value)} required>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Poznámka k objednávce
                <textarea name="note" rows={3} placeholder="Upřesněte doručení, klub, fakturaci..."></textarea>
              </label>
              <div className="checkout__actions">
                <button className="btn btn--primary" type="submit" disabled={checkoutLoading}>
                  {checkoutLoading ? 'Odesíláme objednávku…' : 'Odeslat objednávku'}
                </button>
              </div>
            </form>
            <aside className="checkout-summary">
              {detailedCartItems.length === 0 ? (
                <p className="checkout-summary__empty">Košík je prázdný. Přidejte si produkty do objednávky.</p>
              ) : (
                <>
                  {detailedCartItems.map((item) => (
                    <div className="checkout-summary__item" key={item.id}>
                      <div>
                        <strong>{item.product.name}</strong>
                        <span>
                          {item.quantity} × {formatPrice(item.product.price)}
                        </span>
                      </div>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  {shippingOption && (
                    <div className="checkout-summary__item">
                      <div>
                        <strong>Doprava</strong>
                        <span>{shippingOption.label}</span>
                      </div>
                      <span>{formatPrice(shippingOption.price)}</span>
                    </div>
                  )}
                  <div className="checkout-summary__total">
                    <span>Celkem</span>
                    <strong>{formatPrice(orderTotal)}</strong>
                  </div>
                  <p className="checkout-summary__hint">
                    Po potvrzení objednávky automaticky zašleme instrukce dodavateli a e-mailem obdržíte fakturu.
                  </p>
                </>
              )}
            </aside>
          </div>
          {checkoutStatus && (
            <div
              className={`checkout__status ${
                checkoutStatus.type === 'success' ? 'checkout-status--success' : 'checkout-status--error'
              }`}
              role="status"
            >
              {checkoutStatus.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
