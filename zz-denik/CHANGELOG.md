# Changelog

All notable changes to this project will be documented in this file.

## [1.8.0] - 2026-06-02

### Added
- Celková optimalizace záložky Zboží pro mobilní zařízení.
- **Harmonikové zobrazení (Accordion)**: Karty předmětů jsou nyní ve výchozím stavu zbalené a zobrazují pouze název, kategorii a cenu. Kliknutím se plynule rozbalí a ukáží kompletní detaily (suroviny, čas, talenty, bojové statistiky, efekty) a akční tlačítka. To ušetří až 70 % vertikálního prostoru na mobilu.
- **Sdružení kategorií (Grouped Tabs)**: 9 původních horizontálně rolovatelných tabů bylo zredukováno na **5 hlavních záložek**:
  - *Vše*: Kompletní katalog.
  - *Výzbroj*: Zbraně nablízko, střelné zbraně a zbroje.
  - *Výbava*: Zboží, oblečení a lektvary.
  - *Suroviny*: Craftovací suroviny.
  - *Služby*: Služby, hostince a doprava.
- **Chytré kontextové filtry (Smart Filters)**: Panel detailních filtrů se nyní dynamicky přizpůsobuje vybrané záložce (např. skrývá filtry jako bojové zranění a ruce, pokud si hráč prohlíží Suroviny nebo Služby).
- Přidán filtr **Typ předmětu** pro rychlé rozlišení subkategorií ve sdružených záložkách (např. filtrování pouze Zbroje uvnitř Výzbroje).
- **Prepojení nákupu a vybavení**: Přidáno akční tlačítko **Koupit & Vybavit** pro zbraně a zbroje, které předmět zakoupí a automaticky dosadí do aktivního slotu na listu postavy (zbraně, zbroj, helma, štít) a přepočítá statistiky.

## [1.7.0] - 2026-06-02

### Added
- Nový interaktivní herní tahák a přehled pravidel (`RulesReferenceModal.jsx`) dostupný přímo z bočního menu pod tlačítkem **Pravidla & Tahák**.
- Přehledně rozčleněné karty pravidel a tabulky optimalizované pro mobilní displeje:
  - **Boj**: Pomalé a rychlé akce (1 AP), dosahy a vzdálenostní zóny (Rvačka, Blízká, Krátká, Dlouhá, Extrémní).
  - **Stavy**: Detailní mechanické dopady a penalizace pro stavy Hladový, Žíznivý, Nevyspalý a Prochladlý.
  - **Cesta**: Aktivity během čtyř čtvrtin dne (Pochod, Stavba tábora, Hlídka, Lov/Sběr) a pravidla odpočinku a spánku.
  - **Dovednosti**: Přehledná tabulka mapování dovedností k mateřským vlastnostem (Síla, Obratnost, Rozum, Empatie).
- Integrace do `app.jsx` s automatickým blokováním swipe gest při otevřeném taháku pro bezproblémovou interakci a scrollování na mobilech.

## [1.6.0] - 2026-06-02

### Added
- Plně funkční import a export postav přizpůsobený pro mobilní (Capacitor/WebView) i desktopové prostředí.
- Nový komponent `DataManagementModal.jsx` poskytující dvě záložky:
  - **Aktuální postava**: Umožňuje sdílení (Web Share API), stahování JSON souboru nebo zkopírování do schránky pouze pro vybranou postavu. Import umožňuje přidání (import) nové postavy do databáze bez přepsání stávajících.
  - **Celá záloha**: Umožňuje sdílení, stažení nebo zkopírování kompletní databáze všech uložených postav a kompletní obnovu (přepsání) databáze.
- Integrace do `app.jsx` se stavem `showDataModal` a helper funkcemi `importAllCharacters` a `importSingleCharacter` (včetně prevence kolizí ID).

### Changed
- Tlačítka **Export** a **Import** v bočním menu nyní namísto přímého stahování/nahrávání otevírají nový modal pro správu dat.

## [1.5.0] - 2026-06-02

### Added
- Nový modul Tvorba postavy (Character Creation Wizard) s podporou standardních pravidel a homebrew změn.
- Průvodce krok za krokem: základní údaje, rozdělování vlastností, rozdělování dovedností, výběr talentů a startovních kouzel.
- Rozšíření schématu postavy o věk, pýchu, temné tajemství, vzhled, reputaci a vztahy.

### Fixed
- Oprava chyby `TypeError: Cannot read properties of undefined (reading 'hungry')` v `SheetAttributes.jsx` zavedením bezpečného přístupu (optional chaining) ke stavům postavy a správnou inicializací `conditions` v průvodci tvorbou postavy.
- Sjednocení navigace: horní lišta s taby z `Header.jsx` byla zcela odstraněna a spodní navigace `BottomNav` je nyní aktivní pro všechna rozlišení (včetně PC). Tím se předešlo duplicitám a chybějícímu menu na různých typech displejů.
- Oprava pozice vnitřního sticky menu postavy (`Navigation.jsx`) zavedením třídy `sticky-sheet-nav` s jednotným horním offsetem 80px.
- Oprava prázdné mezery v horní části deníku zavedením jednotného paddingu (`main-content-layout`).

## [1.4.0] - 2026-06-02


### Added
- Backend implementation plan for catalog imports, API, database, and Google/MCP automation.
- Initial backend catalog import pipeline for local `.docx` sources.
- Minimal local backend API with catalog endpoints and admin import trigger.
- Frontend catalog provider that loads `/api/catalog/bootstrap` and falls back to bundled static data.
- Catalog status modal with source, counts, import warnings/errors, refresh, and import actions.
- Google source manifest and sync pipeline for the supplied Google Docs/Drive links.
- Backend endpoint `POST /api/admin/sync-google` and npm script `catalog:sync-google`.
- Import run history with catalog snapshots and diff summaries for added, changed, and removed records.
- Backend endpoint `GET /api/catalog/history` for recent catalog import runs.
- npm scripts `catalog:import` and `backend:dev`.

### Changed
- Vite dev server now proxies `/api` requests to the local backend on port `8787`.
- Zboží, talents, spells, pickers, and inventory autocomplete now read catalog data through the shared provider.
- Catalog status modal can now trigger Google source sync from the app.
- Catalog status modal now shows the latest import diff summary and a short preview of changed records.
- Talent DOCX import now separates all `Cesta` talents into profession talents and preserves list subpoints under their three rank levels.
- Character sheet restored stepper controls for attributes, willpower, and experience.
- Inventory equipment flow restored for equipping weapons/armor and unequipping to backpack or dropping items.
- Encumbrance limit now includes the Soumar talent carrying bonus.

## [1.3.0] - 2025-11-28

### Added
- **Talents Section**: Dedicated view for browsing talents with tabs for "Profession" and "General".
- **Spells Section**: Dedicated view for browsing spells with tabs for "Druid" and "Sorcerer".
- **Data**: Added comprehensive list of profession talents (Bard, Fighter, Rider, Peddler, Hunter, Rogue, Craftsman, Champion, Swashbuckler) and placeholder spell data.
- **Components**: Created `TalentsSection.jsx` and `SpellsSection.jsx` for modularity.

### Changed
- **Navigation**: Restructured top navigation into 4 main tabs: Deník, Zboží, Talenty, Kouzla.
- **Header**: Moved Dice Roller to the main menu to declutter the header. Expanded the Weight (Zátěž) component. Increased top padding for better mobile status bar clearance.
- **UI**: Improved layout and responsiveness of the main character sheet.

### Fixed
- **Code Integrity**: Resolved persistent corruption and syntax errors in `app.jsx` by performing a full rewrite and verification.

## [1.2.0] - 2025-11-27

### Added
- **Logo**: Added application logo to the header and browser favicon.
- **Mobile UI**: Added safe-area padding support to prevent header overlap with mobile status bars.
- **Shared Components**: Created `src/components/common` for reusable UI elements (`Card`, `SectionHeader`, `Toast`, `WeightSelect`).

### Changed
- **Refactoring**: Major refactor of `App.jsx` to reduce code duplication and improve maintainability.
- **Zboží Section**: Moved `Zboží` logic to a dedicated `ZboziSection.jsx` component.
- **Currency**: Improved currency management UI for Gold, Silver, and Copper.

### Fixed
- **Header Layout**: Fixed header height and padding issues on mobile devices.
- **Syntax Errors**: Resolved syntax errors and component structure issues in `App.jsx`.

## [1.1.0] - 2025-11-26

### Added
- **Zboží Section**: A new section for browsing, searching, filtering, and sorting items.
    - Full-text search for items.
    - Filtering by Category and Talent.
    - Sorting by Price.
    - Data conversion scripts (`convert_docx_to_csv.js`, `csv_to_json.js`) to process `Zboží.docx`.
- **Navigation**: Added "Zboží" button to the main navigation bar.

### Fixed
- **App Corruption**: Fixed a critical issue where `src/app.jsx` was corrupted with duplicated code. Reconstructed the file to restore functionality.
- **Data Normalization**: Normalized item categories (e.g., mapping "Oděv", "Zbraň" to "Předmět") during CSV conversion.

## [1.0.0] - Initial Release
- Initial release of the Character Sheet application.
- Features: Attributes, Skills, Inventory, Money, Consumables, Dice Roller, Critical Injuries.
