# Changelog

All notable changes to this project will be documented in this file.

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
