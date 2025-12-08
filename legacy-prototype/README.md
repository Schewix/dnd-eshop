# Drak & Kostky — Bootstrap statický web

Jednostránkový web postavený na **Bootstrap 5**, který prezentuje český D&D e-shop. Obsahuje karusel, záložky, modal, formulář, DataTable s 50 položkami a další komponenty v jednotném fantasy stylu.

## Jak spustit

1. Otevři `legacy-prototype/index.html` v prohlížeči. Pro lokální server můžeš použít např.:

   ```bash
   cd legacy-prototype
   python -m http.server 8000
   ```

2. Obrázky jsou lokálně v `legacy-prototype/images/`. HTML už na ně odkazuje.

## Co stránka obsahuje

- Navigaci s logem a 6 položkami menu + ikony.
- Carousel se třemi snímky hned pod navigací.
- Breadcrumb trail pod karuselem.
- Sekci se 3 záložkami (nav-tabs) a obsahem pro vybavení, logistiku a komunitu.
- Katalog s DataTables (50 záznamů, hledání, řazení, stránkování).
- Modal okno s detaily, vyvolatelné z tabulky i tlačítkem.
- Různě stylovaná tlačítka a odkazy (filled, outline, link) s ikonami.
- Komplexní formulář s 10+ poli: text, e-mail, telefon, selecty, radio, checkbox, textarea, input group, uložit/reset na konci.
- FAQ (accordion), galerie obrázků, kontaktní bloky.

## Wireframe homepage (mobilní pohled)

Textový popis drátového modelu pro smartphone:

- Header: úzký top-bar s kontaktem, pod ním sticky navbar s logem a hamburgerem.
- Carousel: plná šířka s indikátory, overlay textem a CTA v prvním snímku.
- Breadcrumb: jednořádkový trail pod karuselem, zarovnán na střed.
- Hero: sloupec textu, pod ním hero obrázek přes celou šířku a badges.
- Záložky: nav-tabs scrollovatelný horizontální seznam, pod ním blok s obsahem.
- Katalog: stat boxy nad tabulkou, DataTable jako horizontálně scrollovatelná tabulka.
- Formulář: jednosloupcový layout, Input Group pro příspěvek, radio a checkbox stacked.
- FAQ & Footer: accordion, následovaný kontaktním blokem a tlačítky.
