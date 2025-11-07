'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

const menuItems = [
  { href: '#o-projektu', label: 'O projektu', icon: 'bi-magic' },
  { href: '#nabidka', label: 'Nabídka', icon: 'bi-gem' },
  { href: '#komunita', label: 'Komunita', icon: 'bi-people' },
  { href: '#program', label: 'Program', icon: 'bi-calendar-event' },
  { href: '#akademie', label: 'Akademie', icon: 'bi-mortarboard' },
  { href: '#kontakt', label: 'Kontakt', icon: 'bi-envelope-open' },
];

const carouselSlides = [
  {
    title: 'Kreativní dílna pro dobrodruhy',
    caption:
      'Arcane Forge je místo, kde vznikají kampaně, malují se miniatury a potkávají se hráči stolních RPG.',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/arcaneWorkshop/0cf57ae3fdb1b6c8961f8c0ceee2437f/arcane-workshop.jpg',
  },
  {
    title: 'Prémiové vybavení a kostky',
    caption:
      'Vyberte si z exkluzivní nabídky kostek, terénů a herních deníků navržených našimi tvůrci.',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/premiumDice/ab8b922366df0f36c48c0faf5ebc975c/premium-dice.jpg',
  },
  {
    title: 'Workshop pro nové Pány jeskyně',
    caption:
      'Naučíme vás, jak připravit první dobrodružství a vést kampaň, na kterou družina nikdy nezapomene.',
    image:
      'https://images.ctfassets.net/lt0wyz0e3ujo/dmWorkshop/2a71f82a3678e547b4f6b5f5b325a6dc/dm-workshop.jpg',
  },
];

const highlightCards = [
  {
    title: 'Autorské produkty',
    description:
      'Navrhujeme vlastní kostky, deníky a tematické mapy inspirované českými legendami a folklórem.',
    icon: 'bi-brush',
  },
  {
    title: 'Program pro školy',
    description:
      'Pomáháme učitelům s adaptací RPG aktivit do výuky dějepisu, literatury i týmové spolupráce.',
    icon: 'bi-bank',
  },
  {
    title: 'Komunitní knihovna',
    description:
      'Sdílíme stovky modulů, jednorázovek a map zdarma členům klubu Arcane Forge.',
    icon: 'bi-journal-richtext',
  },
];

const tabPanels = [
  {
    id: 'tab-kostky',
    title: 'Kolekce kostek',
    icon: 'bi-dice-6',
    description:
      'Limitované série kovových i pryskyřicových kostek navržené našimi členy. Každá sada je ručně leštěna a balena v cestovním pouzdře.',
  },
  {
    id: 'tab-workshopy',
    title: 'Workshopy',
    icon: 'bi-easel',
    description:
      'Týdenní tematické workshopy od zkušených vypravěčů, malířů miniatur a světotvůrců. Využíváme metody designu her i improvizace.',
  },
  {
    id: 'tab-liga',
    title: 'Liga vypravěčů',
    icon: 'bi-trophy',
    description:
      'Celoroční liga pro Pány jeskyně, kteří chtějí získat zpětnou vazbu, sdílet modulární obsah a posouvat své vypravěčské dovednosti.',
  },
];

const inventorySeeds = [
  {
    title: 'Sada kostek Aurora Borealis',
    category: 'Kostky',
    price: '349 Kč',
    stock: 'Skladem',
    focus: 'Světélkující pryskyřice',
  },
  {
    title: 'Kovové kostky Obsidian Edge',
    category: 'Kostky',
    price: '1 299 Kč',
    stock: 'Posledních 8 ks',
    focus: 'Leštěná ocel',
  },
  {
    title: 'Kronika Arcane Forge',
    category: 'Deníky',
    price: '599 Kč',
    stock: 'Skladem',
    focus: 'Ručně šitá vazba',
  },
  {
    title: 'Startovní modul Hvozdní slavnosti',
    category: 'Dobrodružství',
    price: '289 Kč',
    stock: 'Digitální',
    focus: 'Festivalová zápletka',
  },
  {
    title: 'Malířský workshop Miniatures 101',
    category: 'Workshopy',
    price: '1 150 Kč',
    stock: 'Termíny 2× měsíčně',
    focus: 'Techniky dry-brush',
  },
  {
    title: 'Dungeon Tiles "Catacombs"',
    category: 'Terén',
    price: '1 999 Kč',
    stock: 'Na objednávku',
    focus: 'Magnetické spojení',
  },
  {
    title: 'Balíček NPC portrétů Vol. 3',
    category: 'Digitální obsah',
    price: '199 Kč',
    stock: 'Okamžitě ke stažení',
    focus: '40 ilustrací',
  },
  {
    title: 'Mistři improvizace – online kurz',
    category: 'Akademie',
    price: '1 890 Kč',
    stock: 'Nový běh září',
    focus: '4 moduly',
  },
  {
    title: 'Sada emailových háčků pro DM',
    category: 'Komunita',
    price: '99 Kč',
    stock: 'Členský benefit',
    focus: '25 scénářů',
  },
  {
    title: 'Kniha map "Čarotisk"',
    category: 'Mapy',
    price: '749 Kč',
    stock: 'V tisku',
    focus: 'Plátěná obálka',
  },
];

const tableRecords = Array.from({ length: 50 }, (_, index) => {
  const seed = inventorySeeds[index % inventorySeeds.length];
  return {
    id: index + 1,
    code: `AF-${(index + 1).toString().padStart(3, '0')}`,
    ...seed,
    audience:
      index % 4 === 0
        ? 'Začátečníci'
        : index % 4 === 1
          ? 'Rodinné hraní'
          : index % 4 === 2
            ? 'Veteráni'
            : 'Kluby',
  };
});

const upcomingEvents = [
  {
    title: 'Noční open gaming',
    time: 'Každý pátek 18:00 – 00:00',
    description: 'Volné hraní, matchmaking pro nové skupiny a sdílený bufet se speciální nabídkou kostek.',
  },
  {
    title: 'Creative Jam: Navrhni dungeon',
    time: '3. čtvrtek v měsíci',
    description:
      'Společná tvorba dungeonů, map a hádanek. Na konci večera si každý odnese tisknutelný PDF balíček.',
  },
  {
    title: 'Malování miniatur s mistry',
    time: 'Sobota 9:00 – 15:00',
    description:
      'Praktický workshop s půjčenými airbrush stanicemi, pigmenty a konzultací zkušených malířů.',
  },
];

export default function Page() {
  useEffect(() => {
    let table: { destroy: () => void } | undefined;

    const loadEnhancements = async () => {
      await import('bootstrap/dist/js/bootstrap.bundle.min.js');
      const DataTable = (await import('datatables.net-bs5')).default;
      if (typeof window !== 'undefined' && document.getElementById('catalogTable')) {
        table = new DataTable('#catalogTable', {
          paging: true,
          searching: true,
          ordering: true,
          lengthChange: false,
          pageLength: 10,
          language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.8/i18n/cs.json',
          },
        });
      }
    };

    loadEnhancements();

    return () => {
      if (table) {
        table.destroy();
      }
    };
  }, []);

  return (
    <div>
      <header className="border-bottom border-secondary bg-dark">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
          <div className="container">
              <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
              <span className="fs-4 fw-bold text-uppercase">Arcane Forge</span>
              <span className="badge bg-primary">RPG hub</span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
              aria-controls="mainNav"
              aria-expanded="false"
              aria-label="Přepnout navigaci"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">
                {menuItems.map((item) => (
                  <li className="nav-item" key={item.href}>
                    <a className="nav-link d-flex align-items-center gap-2" href={item.href}>
                      <i className={`bi ${item.icon}`}></i>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        <div className="bg-secondary bg-opacity-25 py-2">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="#o-projektu" className="link-light text-decoration-none">
                    Úvod
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#nabidka" className="link-light text-decoration-none">
                    Nabídka
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Kostky a tvorba světa
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </header>

      <section className="bg-dark" id="o-projektu">
        <div className="container py-4 py-md-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div id="heroCarousel" className="carousel slide shadow-lg rounded-4 overflow-hidden" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  {carouselSlides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      data-bs-target="#heroCarousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? 'active' : ''}
                      aria-current={index === 0 ? 'true' : undefined}
                      aria-label={slide.title}
                    ></button>
                  ))}
                </div>
                <div className="carousel-inner">
                  {carouselSlides.map((slide, index) => (
                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={slide.title}>
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={1200}
                        height={640}
                        className="d-block w-100 object-fit-cover"
                        priority={index === 0}
                      />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
                        <h5 className="fw-bold">{slide.title}</h5>
                        <p className="mb-0">{slide.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Předchozí</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Další</span>
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold text-white">Arcane Forge</h1>
              <p className="lead text-light">
                Kreativní dílna, komunitní klub a specializovaný obchod zaměřený na stolní hry na hrdiny.
                Spojujeme hráče, vypravěče, ilustrátory i pedagogy, kteří chtějí pomocí RPG vyprávět silné příběhy.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="#nabidka" className="btn btn-primary btn-lg">
                  <i className="bi bi-cart-plus me-2"></i>
                  Prohlédnout nabídku
                </a>
                <a href="#komunita" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-discord me-2"></i>
                  Připojit se ke komunitě
                </a>
                <button
                  type="button"
                  className="btn btn-warning btn-lg text-dark"
                  data-bs-toggle="modal"
                  data-bs-target="#visionModal"
                >
                  <i className="bi bi-lightning-charge me-2"></i>
                  Naše vize
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary bg-opacity-10 py-5" id="wireframe">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-5">
              <div className="p-4 h-100 rounded-4 bg-dark border border-secondary">
                <h2 className="h4 text-primary">Wireframe mobilní verze</h2>
                <p className="mb-3">
                  Mobilní wireframe domovské stránky začíná kompaktním logem a hamburger menu. Pod nimi je carousel s
                  aktuálními událostmi, následovaný sekcí statistik, třemi kartami nabídek, taby s programem a formulářem
                  pro přihlášení do klubu. Spodní část uzavírá datová tabulka novinek a kontaktní blok s mapou.
                </p>
                <ul className="list-unstyled mb-0 small">
                  <li className="mb-2">
                    <i className="bi bi-1-circle me-2 text-primary"></i>Horní panel s logem a navigací.
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-2-circle me-2 text-primary"></i>Carousel s propagačním sdělením.
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-3-circle me-2 text-primary"></i>Blok highlight karet a sekce komunitních aktivit.
                  </li>
                  <li>
                    <i className="bi bi-4-circle me-2 text-primary"></i>Formulář členství, tabulka inventáře, patička.
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="ratio ratio-9x16 shadow-lg rounded-4 overflow-hidden border border-secondary">
                <Image
                  src="https://images.ctfassets.net/lt0wyz0e3ujo/mobileWireframe/5f4b1c06a8b85184bb7f132951a7858b/wireframe.jpg"
                  alt="Wireframe mobilní verze Arcane Forge"
                  width={900}
                  height={1600}
                  className="object-fit-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" id="nabidka">
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col">
              <span className="badge bg-primary rounded-pill text-uppercase">Nabídka</span>
              <h2 className="mt-2">Co u nás vzniká</h2>
              <p className="text-secondary">
                Od vlastních produktů přes komunitní akce až po vzdělávání budoucích mistrů jeskyně.
              </p>
            </div>
          </div>
          <div className="row g-4">
            {highlightCards.map((card) => (
              <div className="col-md-4" key={card.title}>
                <div className="h-100 p-4 rounded-4 bg-dark border border-secondary">
                  <div className="display-6 text-primary mb-3">
                    <i className={`bi ${card.icon}`}></i>
                  </div>
                  <h3 className="h5">{card.title}</h3>
                  <p className="text-secondary">{card.description}</p>
                  <a href="#program" className="btn btn-sm btn-outline-primary">
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Zjistit více
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary bg-opacity-10 py-5" id="komunita">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <h2 className="h3">Komunitní kalendář</h2>
              <p className="text-secondary">
                Každý měsíc pořádáme desítky akcí pro veřejnost i členy klubu. Rezervujte si místo skrze náš portál nebo se
                zastavte osobně v dílně.
              </p>
              <ul className="list-group list-group-flush bg-dark border border-secondary rounded-4">
                {upcomingEvents.map((event) => (
                  <li key={event.title} className="list-group-item bg-dark text-light border-secondary">
                    <h3 className="h5 mb-1">
                      <i className="bi bi-calendar-week me-2 text-primary"></i>
                      {event.title}
                    </h3>
                    <div className="small text-secondary mb-2">{event.time}</div>
                    <p className="mb-0">{event.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <h2 className="h3">Programové bloky</h2>
              <ul className="nav nav-tabs" id="programTabs" role="tablist">
                {tabPanels.map((tab, index) => (
                  <li className="nav-item" role="presentation" key={tab.id}>
                    <button
                      className={`nav-link ${index === 0 ? 'active' : ''}`}
                      id={`${tab.id}-tab`}
                      data-bs-toggle="tab"
                      data-bs-target={`#${tab.id}`}
                      type="button"
                      role="tab"
                      aria-controls={tab.id}
                      aria-selected={index === 0}
                    >
                      <i className={`bi ${tab.icon} me-2`}></i>
                      {tab.title}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="tab-content border border-top-0 border-secondary rounded-bottom-4 bg-dark p-4" id="programTabsContent">
                {tabPanels.map((tab, index) => (
                  <div
                    key={tab.id}
                    className={`tab-pane fade ${index === 0 ? 'show active' : ''}`}
                    id={tab.id}
                    role="tabpanel"
                    aria-labelledby={`${tab.id}-tab`}
                  >
                    <p className="mb-0">{tab.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" id="program">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <h2 className="h3">Arcane Forge DataTable katalog</h2>
              <p className="text-secondary">
                Kompletní katalog produktů, workshopů a digitálních balíčků. Tabulku lze filtrovat, vyhledávat a řadit podle
                libovolného sloupce. Vzorek obsahuje 50 aktuálních položek, které pravidelně obměňujeme podle zájmu komunity.
              </p>
              <p className="small text-secondary">
                <i className="bi bi-info-circle me-2"></i>DataTable je stylovaná komponenta pro Bootstrap 5 s podporou
                stránkování, vyhledávání a řazení.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#formular" className="btn btn-outline-light me-2">
                <i className="bi bi-pencil-square me-2"></i>
                Přihláška do klubu
              </a>
              <a href="#kontakt" className="btn btn-primary">
                <i className="bi bi-geo-alt me-2"></i>
                Navštívit dílnu
              </a>
            </div>
          </div>
          <div className="table-responsive mt-4">
            <table id="catalogTable" className="table table-dark table-striped table-hover align-middle" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Kód</th>
                  <th scope="col">Název položky</th>
                  <th scope="col">Kategorie</th>
                  <th scope="col">Cena</th>
                  <th scope="col">Dostupnost</th>
                  <th scope="col">Silná stránka</th>
                  <th scope="col">Publikum</th>
                </tr>
              </thead>
              <tbody>
                {tableRecords.map((record) => (
                  <tr key={record.code}>
                    <th scope="row">{record.id}</th>
                    <td>{record.code}</td>
                    <td>{record.title}</td>
                    <td>{record.category}</td>
                    <td>{record.price}</td>
                    <td>{record.stock}</td>
                    <td>{record.focus}</td>
                    <td>{record.audience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-secondary bg-opacity-10 py-5" id="akademie">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <h2 className="h3">Komplexní přihláška do Arcane Forge Academy</h2>
              <p className="text-secondary">
                Připojte se k ročnímu programu zaměřenému na tvorbu světů, přípravu kampaní a vedení herních skupin. Formulář
                vyplňte co nejpodrobněji, ať vám můžeme nabídnout ideální studijní plán.
              </p>
              <form className="row g-3" id="formular">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label">
                    Celé jméno
                  </label>
                  <input type="text" className="form-control" id="fullName" placeholder="Jana Dračí" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    E-mail
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" id="email-addon">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      aria-describedby="email-addon"
                      placeholder="jana@arcane.cz"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">
                    Telefon
                  </label>
                  <input type="tel" className="form-control" id="phone" placeholder="+420 777 123 456" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">
                    Město
                  </label>
                  <input type="text" className="form-control" id="city" placeholder="Brno" />
                </div>
                <div className="col-12">
                  <label className="form-label d-block">Preferovaná role ve skupině</label>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="role" id="rolePlayer" value="player" defaultChecked />
                    <label className="form-check-label" htmlFor="rolePlayer">
                      Hráč
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="role" id="roleDm" value="dm" />
                    <label className="form-check-label" htmlFor="roleDm">
                      Vypravěč
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="role" id="roleDesigner" value="designer" />
                    <label className="form-check-label" htmlFor="roleDesigner">
                      Návrhář světa
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="experience" className="form-label">
                    Zkušenosti
                  </label>
                  <select id="experience" className="form-select" defaultValue="intermediate">
                    <option value="beginner">Začátečník</option>
                    <option value="intermediate">Středně pokročilý</option>
                    <option value="advanced">Pokročilý</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="groupSize" className="form-label">
                    Velikost skupiny
                  </label>
                  <select id="groupSize" className="form-select" defaultValue="4">
                    <option value="3">3 osoby</option>
                    <option value="4">4 osoby</option>
                    <option value="5">5 osob</option>
                    <option value="6">6 osob</option>
                    <option value="7">7+ osob</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Dostupné dny</label>
                  <div className="d-flex flex-wrap gap-3">
                    {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'].map((day, index) => (
                      <div className="form-check" key={day}>
                        <input className="form-check-input" type="checkbox" id={`day-${index}`} />
                        <label className="form-check-label" htmlFor={`day-${index}`}>
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="topics" className="form-label">
                    Oblasti zájmu
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-bookmark-star"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="topics"
                      placeholder="Worldbuilding, improvizace, audio produkce"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="motivation" className="form-label">
                    Motivace a cíle
                  </label>
                  <textarea className="form-control" id="motivation" rows={4} placeholder="Popište, co chcete v rámci akademie dokázat."></textarea>
                </div>
                <div className="col-12 form-check">
                  <input className="form-check-input" type="checkbox" value="newsletter" id="newsletter" defaultChecked />
                  <label className="form-check-label" htmlFor="newsletter">
                    Chci dostávat měsíční newsletter s novinkami Arcane Forge.
                  </label>
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-success btn-lg">
                    <i className="bi bi-save me-2"></i>
                    Uložit přihlášku
                  </button>
                </div>
              </form>
            </div>
            <div className="col-lg-5">
              <div className="p-4 rounded-4 bg-dark border border-secondary h-100">
                <h3 className="h4">Proč vstoupit?</h3>
                <ul className="list-unstyled text-secondary mb-4">
                  <li className="mb-2">
                    <i className="bi bi-check2-circle text-success me-2"></i>Mentoring od profesionálních designérů her.
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2-circle text-success me-2"></i>Přístup do digitální knihovny modulů a map.
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2-circle text-success me-2"></i>Možnost prezentovat projekty na komunitních akcích.
                  </li>
                  <li>
                    <i className="bi bi-check2-circle text-success me-2"></i>Produkční zázemí pro podcasty a streamy.
                  </li>
                </ul>
                <button className="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#visionModal">
                  <i className="bi bi-stars me-2"></i>
                  Přečíst manifest
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" id="kontakt">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <h2 className="h3">Kontakt a odkazy</h2>
              <p className="text-secondary">
                Najdete nás v kreativním centru Brna. Sledujte nás na sociálních sítích a rezervujte si prohlídku dílny.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-3">
                <a className="btn btn-outline-primary" href="https://discord.gg" target="_blank" rel="noreferrer">
                  <i className="bi bi-discord me-2"></i>
                  Discord
                </a>
                <a className="btn btn-primary" href="https://www.instagram.com" target="_blank" rel="noreferrer">
                  <i className="bi bi-instagram me-2"></i>
                  Instagram
                </a>
                <a className="btn btn-danger" href="https://www.youtube.com" target="_blank" rel="noreferrer">
                  <i className="bi bi-youtube me-2"></i>
                  YouTube kanál
                </a>
                <a className="btn btn-outline-light" href="mailto:ahoj@arcaneforge.cz">
                  <i className="bi bi-envelope-arrow-up me-2"></i>
                  Napište nám
                </a>
              </div>
              <div className="p-4 rounded-4 bg-secondary bg-opacity-25">
                <h3 className="h5">Otevírací doba</h3>
                <p className="mb-1">Po–Pá: 10:00 – 20:00</p>
                <p className="mb-1">So: 12:00 – 22:00</p>
                <p className="mb-0">Ne: zavřeno (streamujeme)</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ratio ratio-16x9 rounded-4 overflow-hidden border border-secondary">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.734262602813!2d16.606837176996045!3d49.19506007137948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDExJzQyLjIiTiAxNsKwMzYnMzIuNyJF!5e0!3m2!1scs!2scz!4v1700000000000!5m2!1scs!2scz"
                  title="Arcane Forge na mapě"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black py-4 mt-5">
        <div className="container text-center text-secondary small">
          <p className="mb-1">© {new Date().getFullYear()} Arcane Forge – komunitní dílna pro fanoušky stolních RPG.</p>
          <p className="mb-0">
            Vyrobeno s láskou k dobrodružství. Sledujte nás na{' '}
            <a href="https://www.facebook.com" className="link-light text-decoration-none" target="_blank" rel="noreferrer">
              Facebooku
            </a>{' '}
            a{' '}
            <a href="https://open.spotify.com" className="link-light text-decoration-none" target="_blank" rel="noreferrer">
              Spotify
            </a>
            .
          </p>
        </div>
      </footer>

      <div className="modal fade" id="visionModal" tabIndex={-1} aria-labelledby="visionModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark text-light border border-secondary">
            <div className="modal-header border-secondary">
              <h2 className="modal-title h4" id="visionModalLabel">
                Manifest Arcane Forge
              </h2>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Zavřít"></button>
            </div>
            <div className="modal-body">
              <p>
                Arcane Forge vznikla z touhy tvořit světy, které propojují lidi. Věříme v otevřenou komunitu, sdílení know-how
                a podporu lokálních autorů. Každý měsíc vydáváme nové materiály, pořádáme workshopy a pomáháme charitativním
                projektům, které využívají RPG k rozvoji kreativity, empatie a týmové spolupráce.
              </p>
              <p className="mb-0">
                Naše dílna je bezpečným místem pro experimenty. Přineste svůj nápad a společně z něj vykováme legendární
                dobrodružství.
              </p>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Zavřít
              </button>
              <a href="#formular" className="btn btn-primary">
                <i className="bi bi-rocket-takeoff me-2"></i>
                Spustit vlastní projekt
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
