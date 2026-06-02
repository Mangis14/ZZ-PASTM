# Backend implementation plan

Tento plan popisuje postupne napojenie aplikacie na zdroje pravidlovych dat: zbozi, talenty, povolani a kouzla.

## Cielovy tok dat

```text
Google Docs / Drive
  -> import worker
  -> DOCX / Docs parsery
  -> normalizacia a validacia
  -> katalogova databaza
  -> REST API
  -> React / Capacitor aplikacia
```

## Faza 1: Import core

Stav: rozpracovane.

- Vytvorit samostatnu backend/import vrstvu v Node.js.
- Parsovat lokalne `.docx` zdroje z `import_files`.
- Generovat jednotny katalog `items`, `talents`, `spells`, `professions`.
- Generovat import report s poctami, fallbackmi, varovaniami a chybami.
- Zachovat existujuce staticke data ako fallback tam, kde je zdroj nekompletny alebo nejasny.

## Faza 2: Minimalne API

Stav: rozpracovane.

- Vytvorit lokalny HTTP server bez zbytocnych framework zavislosti.
- Pridat endpointy:
  - `GET /api/health`
  - `GET /api/catalog/bootstrap`
  - `GET /api/catalog/items`
  - `GET /api/catalog/talents`
  - `GET /api/catalog/professions`
  - `GET /api/catalog/spells`
  - `POST /api/admin/import`
- Pridat Vite proxy na lokalny backend.

## Faza 3: Frontend adapter

Stav: planovane.

- Pridat `CatalogProvider` / `useCatalogData`.
- Nahradit priame importy `src/data/*` API nacitanim.
- Nechat fallback na staticke data pre offline build a mobilne pouzitie.
- Ukladat v postavach hlavne `id` a `rank`, nie cele popisy, s migraciou starsich save dat.

## Faza 4: Databaza

Stav: planovane.

- MVP: SQLite pre lokalny/dev backend.
- Produkcia: Postgres, ak bude backend nasadeny verejne alebo pre viac zariadeni.
- Tabulky:
  - `sources`
  - `import_runs`
  - `catalog_items`
  - `talents`
  - `professions`
  - `spells`
  - volitelne `characters`, ak sa bude synchronizovat dennik medzi zariadeniami.

## Faza 5: Google/MCP napojenie

Stav: rozpracovane.

Preferovane riesenie je MCP alebo Google connector pre Drive/Docs, ak bude dostupny v Codex prostredi. Import worker potom nebude potrebovat rucne linky ani lokalne kopie.

Aktualny stav:

- Google zdroje su ulozene v `backend/sourceConfig.js`.
- `catalog:sync-google` stiahne Google dokumenty a Drive folder do `backend/source-cache/import_files`.
- Sync cache sa pouzije ako vstup pre rovnaky import parser ako lokalne `import_files`.
- `POST /api/admin/sync-google` spusti Google sync aj katalogovy import z backendu.
- UI panel `Katalog dat` ma akciu `Google Sync`.

Fallback riesenie je Google Drive API:

- `files.export` pre Google Docs -> `.docx`.
- `documents.get` z Google Docs API pre tabulky, ak budeme chciet presne citat bunky bez exportu.
- `changes.watch` alebo naplanovany polling pre automaticke aktualizacie.

AI/MCP automatizacia:

- AI validacny krok porovna predosly a novy import.
- Pri podozrivych zmenach vytvori report namiesto ticheho prepisu.
- MCP/Drive connector spusti import po zmene dokumentu, alebo import pojde cez naplanovanu ulohu.

## Faza 6: Admin workflow

Stav: rozpracovane.

- Pridat admin obrazovku alebo CLI report pre import. Hotove: zakladny modal `Katalog dat`.
- Ukazat import report, warnings a errors. Hotove v zakladnom modal okne.
- Pridat moznost spustit refresh/import z UI. Hotove pre lokalny backend endpoint.
- Ukazat rozdiely: pridane, zmenene, odstranene zaznamy. Planovane.
- Pridat moznost schvalit import pred publikovanim do API. Planovane.

## Zname rizika

- `Zboží.docx` ma viac tabuliek s rozdielnymi hlavickami.
- Niektore historicke JSON hlavicky su rozpadnute, najma pri surovinach a lektvaroch.
- `UpdatedGeneralTalentFormatted (2).docx` je textovy zoznam, nie tabulka.
- Samostatny zdroj pre povolani zatial nie je v repozitari.
- `KouzlaPrintLed.docx` je miesany/anglicky zdroj; aktualne vyzaduje fallback alebo samostatny prekladovy zdroj.
