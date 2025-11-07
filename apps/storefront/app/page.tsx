import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '#novinky', label: 'Novinky' },
  { href: '#produkty', label: 'Produkty' },
  { href: '#kolekce', label: 'Kolekce' },
  { href: '#kontakt', label: 'Kontakt' },
];

const featuredProducts = [
  {
    name: 'Kovová sada kostek "Draconic Tempest"',
    description:
      'Prémiové kovové kostky s okraji ze zlaté mosazi a smaltovaným jádrem inspirovaným dračím ohněm.',
    price: '1 499 Kč',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/4DmetalDice/6e8bb5fb9d58d111f7a82f0f4fa9a316/dragon-dice.jpg',
    badge: 'Nejprodávanější',
  },
  {
    name: 'Oficiální pravidla D&D 5e (CZ)',
    description:
      'Základní příručka hráče v češtině v pevné vazbě. Obsahuje veškerá pravidla, kouzla a povolání.',
    price: '1 299 Kč',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/dndPlayerHandbook/c8d654b021ee0d45f540df36175c1401/player-handbook-cz.jpg',
    badge: 'Novinka',
  },
  {
    name: 'Startovací box "Ztracený důl Phandelveru"',
    description:
      'Kompletní dobrodružství pro začátečníky včetně předpřipravených postav a kostek.',
    price: '699 Kč',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/dndStarterSet/7bf0136f455f6474ec83fb8456992d75/starter-set.jpg',
    badge: 'Ideální pro začátečníky',
  },
];

const productCollections = [
  {
    title: 'Kostky & doplňky',
    description: 'Prémiové sady, dice tower a obaly pro vaše kampaně.',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/diceCollection/da9acb44e090422bb62d78f1228c06af/dice-collection.jpg',
  },
  {
    title: 'Příručky & moduly',
    description: 'Oficiální překlady a originální moduly pro každého Dungeon Mastera.',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/booksCollection/598744a1cd4d3b0ef6b2785c80259503/dnd-books.jpg',
  },
  {
    title: 'Miniatury & terén',
    description: 'Ruční malované figurky, modulární terény a 3D tištěné doplňky.',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/minisCollection/2fb971c2e3ea961f08c6e71155c0cb1b/minis.jpg',
  },
];

const productCatalog = [
  {
    id: 'dice-aurora',
    name: 'Akrylová sada kostek "Aurora"',
    category: 'Kostky',
    description: 'Průsvitné kostky s holografickými třpytkami a jemným gradientem.',
    price: '349 Kč',
    stock: 'Skladem',
    rating: 4.8,
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/auroraDice/83f4f05ad54c7113a0c84d1a9bc8b956/dice-aurora.jpg',
  },
  {
    id: 'dice-obsidian',
    name: 'Kovová sada kostek "Obsidian Edge"',
    category: 'Kostky',
    description: 'Matný černý povrch s laserem vyřezávanými číslicemi naplněnými stříbrnou pryskyřicí.',
    price: '1 199 Kč',
    stock: 'Poslední kusy',
    rating: 4.9,
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/obsidianDice/2b0ca332e1e4d119ac73d79b9b7c02d0/dice-obsidian.jpg',
  },
  {
    id: 'book-xanathar',
    name: "Xanatharův průvodce vším (CZ)",
    category: 'Příručky',
    description: 'Rozšíření pravidel s novými podtřídami, kouzly a nástroji pro vypravěče.',
    price: '999 Kč',
    stock: 'Skladem',
    rating: 4.7,
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/xanatharGuide/a4bca6ea8d4d94c82b6045b2582a97f8/xanathar.jpg',
  },
  {
    id: 'book-monsters',
    name: 'Příručka pánů jeskyně: Monster Manual (ENG)',
    category: 'Příručky',
    description: 'Detailní bestiář s více než 150 ikonickými stvořeními Forgotten Realms.',
    price: '1 399 Kč',
    stock: 'Na cestě',
    rating: 4.6,
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/monsterManual/1da58c13f2b10f7c13e92c91358b5ea9/monster-manual.jpg',
  },
  {
    id: 'mini-dragons',
    name: 'Sada miniatur "Draci Chromatici"',
    category: 'Miniatury',
    description: 'Pět detailních resinových miniatur draků připravených k barvení.',
    price: '1 899 Kč',
    stock: 'Skladem',
    rating: 5,
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/chromaticDragons/922eab11fda3b1f93a4b0f7252870520/dragons.jpg',
  },
  {
    id: 'terrain-forest',
    name: 'Modulární terén "Temný hvozd"',
    category: 'Terén',
    description: 'Sada 18 oboustranných dlaždic a stromů z odolné pěny s magnetickými spoji.',
    price: '2 499 Kč',
    stock: 'Na objednávku do 7 dnů',
    rating: 4.5,
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/forestTerrain/1f19dce4e56db0c5df2d93101b76b516/forest-terrain.jpg',
  },
  {
    id: 'accessory-screen',
    name: 'DM paraván "Forgotten Realms"',
    category: 'Doplňky',
    description: 'Čtyřdílný paraván s mapami a rychlými referencemi pro vypravěče.',
    price: '899 Kč',
    stock: 'Skladem',
    rating: 4.4,
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/dmScreen/92e669f2f4e0f27bdcd28652e3884f5e/dm-screen.jpg',
  },
  {
    id: 'accessory-woodenbox',
    name: 'Dřevěná krabička na kostky s vložkou',
    category: 'Doplňky',
    description: 'Ruční výroba z ořechového dřeva, magnetické uzavírání a prostor pro miniaturu.',
    price: '1 099 Kč',
    stock: 'Posledních 5 kusů',
    rating: 4.9,
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/diceBox/0fd349dc1b109c543e9cfe0f3b478590/dice-box.jpg',
  },
];

const testimonials = [
  {
    name: 'Marek S.',
    role: 'Dungeon Master od roku 2014',
    quote:
      'Rychlé dodání a bezkonkurenční výběr kostek. Kovová sada Obsidian Edge je absolutní must-have.',
  },
  {
    name: 'Alena K.',
    role: 'Začínající hráčka',
    quote:
      'Startovací box mi pomohl pochopit pravidla během jednoho večera. Navíc krásné balení a dárek v podobě žetonků.',
  },
  {
    name: 'Tomáš L.',
    role: 'Miniaturista',
    quote:
      'Terén Temný hvozd je detailně vypracovaný a skvěle se kombinuje s mými 3D tisky. Určitě objednám další sety.',
  },
];

const stats = [
  { label: 'Doručení do druhého dne', value: '89 % objednávek' },
  { label: 'Prémiových produktů skladem', value: '320+' },
  { label: 'Hodnocení zákazníků', value: '4,9/5' },
];

export default function HomePage() {
  return (
    <div className="bg-slate-950">
      <header className="border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-lg font-bold text-slate-950 shadow-lg shadow-brand-primary/40">
              D&K
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Drak &amp; Kostky</p>
              <p className="text-xs text-slate-400">Dungeons &amp; Dragons specializovaný e-shop</p>
            </div>
          </div>
          <ul className="hidden items-center gap-8 text-sm font-medium text-slate-200 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a className="transition hover:text-brand-light" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="#produkty"
            className="hidden rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light lg:inline-flex"
          >
            Prohlédnout nabídku
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr]" id="novinky">
          <div className="flex flex-col justify-center gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-light">
              Nová kolekce podzim 2024
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
              Vybavte svou družinu kvalitními produkty, které obstojí i v nejepičtější kampani.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Od kovových kostek přes oficiální příručky až po ručně malované miniatury. Všechny produkty testujeme v našich
              vlastních kampaních a doručujeme do celé ČR i Slovenska.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#produkty"
                className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
              >
                Prohlédnout produkty
              </Link>
              <Link
                href="#kolekce"
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-light hover:text-brand-light"
              >
                Objevte kolekce
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                  <p className="text-2xl font-semibold text-brand-light">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative grid gap-5">
            {featuredProducts.map((product) => (
              <article
                key={product.name}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 p-6 shadow-xl shadow-slate-950/50"
              >
                <span className="inline-flex items-center rounded-full border border-brand-light/40 bg-brand-light/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-brand-light">
                  {product.badge}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-50">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{product.description}</p>
                <p className="mt-4 text-lg font-semibold text-brand-primary">{product.price}</p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800/60">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={640}
                    height={400}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40" id="kolekce">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 lg:grid-cols-3">
            {productCollections.map((collection) => (
              <article
                key={collection.title}
                className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/40"
              >
                <div className="overflow-hidden rounded-2xl border border-slate-800/60">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    width={480}
                    height={320}
                    className="h-40 w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-50">{collection.title}</h3>
                <p className="text-sm text-slate-300">{collection.description}</p>
                <Link
                  href="#produkty"
                  className="mt-auto w-fit text-sm font-semibold text-brand-light transition hover:text-brand-primary"
                >
                  Prohlédnout nabídku →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24" id="produkty">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-light">Kurátorovaný výběr</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50">Nejoblíbenější produkty</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Všechny produkty máme fyzicky skladem v pražském showroomu. Každá položka prochází kontrolou kvality a je
                připravena k okamžitému odeslání.
              </p>
            </div>
            <Link
              href="#kontakt"
              className="hidden rounded-full border border-slate-800 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand-light hover:text-brand-light sm:inline-flex"
            >
              Potřebuji poradit
            </Link>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {productCatalog.map((product) => (
              <article
                key={product.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/40 transition hover:border-brand-light/60"
              >
                <div className="overflow-hidden rounded-2xl border border-slate-800/60">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="h-52 w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{product.category}</span>
                  <span>{product.stock}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-50">{product.name}</h3>
                <p className="text-sm text-slate-300">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-lg font-semibold text-brand-primary">{product.price}</p>
                  <p className="text-sm text-slate-400">Hodnocení {product.rating.toFixed(1)}★</p>
                </div>
                <button className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light">
                  Přidat do košíku
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-800 bg-slate-900/40">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-light">Pro dungeon mastery i hráče</p>
              <h2 className="text-3xl font-semibold text-slate-50">Proč nakoupit u nás?</h2>
              <ul className="grid gap-4 text-sm text-slate-300">
                <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  🔥 Exkluzivní limitované edice kostek a miniatur dovážené přímo z USA a Velké Británie.
                </li>
                <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  ⚔️ Odborné poradenství – náš tým vede pravidelné kampaně a pomůže vám s výběrem.
                </li>
                <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  📦 Doprava zdarma při objednávce nad 1 500 Kč a možnost osobního odběru v Praze.
                </li>
                <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  🎨 Workshop barvení miniatur a komunitní hraní každý první víkend v měsíci.
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-lg shadow-slate-950/40">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-light">Recenze zákazníků</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-50">Hráči, kteří s námi táhnou za jeden provaz</h3>
              <div className="mt-8 space-y-6">
                {testimonials.map((testimonial) => (
                  <blockquote key={testimonial.name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <p className="text-sm text-slate-200">“{testimonial.quote}”</p>
                    <footer className="mt-4 text-xs text-slate-400">
                      {testimonial.name} • {testimonial.role}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950" id="kontakt">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-50">Zůstaňte ve spojení</h3>
            <p className="text-sm text-slate-300">
              Přihlaste se k odběru a získejte přístup k exkluzivním předobjednávkám, bonusovým materiálům pro DMs a slevovým
              kódům.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="w-full sm:flex-1">
                <span className="sr-only">E-mail</span>
                <input
                  type="email"
                  placeholder="vaše@email.cz"
                  className="w-full rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-light focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
              >
                Odebírat novinky
              </button>
            </form>
          </div>
          <div className="grid gap-6 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-light">Showroom</h4>
              <p className="mt-2 text-slate-400">
                Opatovická 18, Praha 1
                <br />
                Po–Pá 10:00–18:00 • So 10:00–14:00
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-light">Kontakt</h4>
              <p className="mt-2 text-slate-400">
                +420 777 123 456
                <br />
                podpora@drakakostky.cz
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-light">Sledujte nás</h4>
              <ul className="mt-2 space-y-1 text-slate-400">
                <li>
                  <a className="transition hover:text-brand-light" href="https://www.instagram.com" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-brand-light" href="https://www.facebook.com" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-brand-light" href="https://discord.com" target="_blank" rel="noreferrer">
                    Discord komunita
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-light">Informace</h4>
              <ul className="mt-2 space-y-1 text-slate-400">
                <li>
                  <a className="transition hover:text-brand-light" href="#" rel="noreferrer">
                    Obchodní podmínky
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-brand-light" href="#" rel="noreferrer">
                    Reklamace &amp; vrácení
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-brand-light" href="#" rel="noreferrer">
                    Často kladené dotazy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800/70 bg-slate-950 py-6">
          <p className="mx-auto max-w-6xl px-6 text-xs text-slate-500">
            © {new Date().getFullYear()} Drak &amp; Kostky. Všechna práva vyhrazena. Ilustrace a fotografie použity se souhlasem
            výrobců.
          </p>
        </div>
      </footer>
    </div>
  );
}
