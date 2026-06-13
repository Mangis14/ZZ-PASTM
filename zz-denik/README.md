# ZZ Denník

Mobilný a webový denník postavy pre stolovú RPG hru Forbidden Lands / Zapovězené země. Aplikácia je postavená na Reacte, Vite, Tailwind CSS a Capacitore a je pripravená na používanie v prehliadači aj na Androide.

## Hlavné funkcie

- Správa viacerých postáv a sprievodca vytvorením novej postavy.
- Responzívny Denník s dlaždicami pre profil, vlastnosti, stavy, boj, inventár, zdroje, talenty, kúzla a poznámky.
- Tri vizuálne stavy vlastností: zdravá, poškodená a vyradená.
- Personalizácia Denníka:
  - zbalenie a rozbalenie jednotlivých dlaždíc,
  - uloženie preferovaného prehľadu,
  - zmena poradia dlaždíc podržaním,
  - obnovenie predvoleného rozloženia,
  - režim Hra, ktorý skryje editačné prvky.
- Plynulé presúvanie dlaždíc bez nechceného označovania textu.
- Android tlačidlo Späť najprv presunie stránku hore, potom sa vráti na Denník a na úvodnej obrazovke ponúkne úplné ukončenie aplikácie.
- Spodná navigácia sa automaticky skryje pri každom otvorenom dialógu alebo module.
- Klikateľný horný stavový panel s vlastnosťami, stavmi, vôľou, záťažou a farebným mešcom.
- Výpočet záťaže z maximálnej Sily a bonusov talentu Soumar.
- Odstraňovanie použitých aj prázdnych slotov inventára a potvrdené vyčistenie celého inventára.
- Prehľad zboží s viacnásobným výberom kategórií, vyhľadávaním, filtrami, radením a uložením posledného filtra.
- Kniha kúziel s kategóriami podľa školy mágie, viacnásobným výberom škôl, filtrami stupňa a naučených kúziel.
- Vyhľadávanie medzi naučenými kúzlami priamo v Denníku.
- Pridávanie viacerých talentov alebo kúziel bez zatvorenia výberového okna.
- Export a import dát postáv.
- Svetlý a tmavý režim.

Hlavné sekcie sa prepínajú okamžite cez spodnú navigáciu. Swipe navigácia a horizontálne slide animácie boli odstránené kvôli plynulejšiemu používaniu na telefóne.

## Katalóg a Google Drive

Zboží, talenty, povolania a kúzla sa načítavajú cez katalógový import. Aktuálne zdrojové dokumenty sa synchronizujú z Google Drive, transformujú do jednotného katalógu a ukladajú do `backend/data/catalog.json`.

Android a offline režim používajú pribalený posledný transformovaný katalóg, takže mobilný build funguje aj bez dostupného backendu.

```powershell
npm run catalog:sync-google
```

Samotný import lokálnych zdrojov:

```powershell
npm run catalog:import
```

Lokálny katalógový backend:

```powershell
npm run backend:dev
```

## Lokálne spustenie

Požiadavky:

- Node.js
- npm

```powershell
npm install
npm run dev
```

Produkčný web build:

```powershell
npm run build
```

## Android

Po každej zmene webovej aplikácie treba vytvoriť produkčný build a synchronizovať ho do Capacitor Android projektu:

```powershell
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

Výsledné debug APK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Projekt `android/` je možné následne otvoriť priamo v Android Studio a aplikáciu spustiť na telefóne alebo emulátore.

## Technológie

- React 18
- Vite 5
- Tailwind CSS
- Capacitor 8
- Node.js katalógový backend

## Zmeny

Kompletný prehľad opráv a nových funkcií je v [CHANGELOG.md](CHANGELOG.md).
