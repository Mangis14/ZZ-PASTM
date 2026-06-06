# ZZ Denník

Mobilný a webový denník postavy pre stolovú RPG hru Forbidden Lands / Zapovězené země.

![Stack](https://img.shields.io/badge/React%20%2B%20Vite%20%2B%20Capacitor-Android-green.svg)
![Main](https://img.shields.io/badge/main-aktu%C3%A1lny%20v%C3%BDvoj-blue.svg)

> Aktuálny stav vetvy `main` obsahuje nové funkcie a opravy vytvorené po poslednom publikovanom APK `1.8.3`.

## Najnovšie funkcie

- Kompletný responzívny overhaul Denníka s prehľadnými dlaždicami.
- Personalizácia Denníka:
  - zbalenie a rozbalenie každej dlaždice,
  - uloženie otvoreného a zbaleného stavu,
  - zmena poradia dlaždíc podržaním,
  - uloženie preferovaného herného prehľadu,
  - obnovenie predvoleného rozloženia,
  - režim Hra, ktorý skryje editačné tlačidlá.
- Karty vlastností v poradí `SIL`, `OBR`, `OSO`, `BYS` s jasným zdravým, poškodeným a vyradeným stavom.
- Klikateľný horný panel s vlastnosťami, stavmi, vôľou, záťažou a farebným mešcom.
- Kliknutie na horný indikátor otvorí a presunie používateľa na príslušnú dlaždicu.
- Automatické otvorenie menu Nová postava, ak ešte nie je vytvorená žiadna postava.
- Opravený výpočet záťaže z maximálnej Sily; Soumar úrovne 3 pridáva `+10`.
- Možnosť odstrániť aj prázdne sloty inventára.
- Potvrdenie pred zmenou maximálnej hodnoty vlastnosti.
- Výber talentov a kúziel zostáva otvorený pri pridávaní viacerých položiek.
- Odstránená swipe navigácia a horizontálne slide animácie pre plynulejšie používanie na telefóne.

## Zboží

- Samostatné hlavné kategórie bez spájania do všeobecných skupín.
- Viacnásobný výber kategórií.
- Vyhľadávanie, radenie, rýchle filtre a aktívne filtre.
- Uloženie posledného filtra pri návrate na kartu.
- Katalóg sa synchronizuje z Google Drive a transformuje do jednotného formátu.
- Android a offline režim používajú posledný pribalený transformovaný katalóg.

## Kúzla

- Responzívne kategórie podľa školy mágie.
- Viacnásobný výber škôl.
- Filtrovanie podľa stupňa a stavu `Naučené` / `Ostatné`.
- Vyhľadávanie podľa názvu, školy, popisu a pomôcky.
- Rovnaké filtre pri pridávaní nového kúzla.
- Vyhľadávanie medzi naučenými kúzlami priamo v Denníku.

## Ďalšie funkcie

- Správa viacerých postáv a sprievodca vytvorením novej postavy.
- Boj, inventár, zdroje, talenty, kúzla, kritické zranenia, zvieratá a poznámky.
- Export a import postáv a záloh.
- Svetlý a tmavý režim.
- Webová aplikácia aj Android aplikácia cez Capacitor.

## Štruktúra repozitára

- [`zz-denik/src/`](zz-denik/src/) - React aplikácia.
- [`zz-denik/src/components/`](zz-denik/src/components/) - komponenty Denníka, katalógov a dialógov.
- [`zz-denik/backend/`](zz-denik/backend/) - katalógový import, Google Drive synchronizácia a lokálne API.
- [`zz-denik/import_files/`](zz-denik/import_files/) - zdrojové dokumenty používané pri importe.
- [`zz-denik/android/`](zz-denik/android/) - Capacitor Android projekt.
- [`zz-denik/CHANGELOG.md`](zz-denik/CHANGELOG.md) - kompletný prehľad zmien.

## Lokálne spustenie

```powershell
cd zz-denik
npm install
npm run dev
```

Produkčný web build:

```powershell
npm run build
```

## Katalóg a Google Drive

Synchronizácia Google Drive zdrojov a následný import:

```powershell
cd zz-denik
npm run catalog:sync-google
```

Import lokálnych zdrojov:

```powershell
npm run catalog:import
```

Lokálny katalógový backend:

```powershell
npm run backend:dev
```

## Android build

```powershell
cd zz-denik
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

Výsledné debug APK:

```text
zz-denik/android/app/build/outputs/apk/debug/app-debug.apk
```

Posledné publikované APK v koreňovom adresári je [`FL_1.8.3.apk`](FL_1.8.3.apk). Aktuálny `main` už obsahuje ďalšie zmeny uvedené vyššie.

## Technológie

- React 18
- Vite 5
- Tailwind CSS
- Capacitor 8
- Node.js katalógový backend

## Licencia

Projekt je licencovaný pod MIT licenciou. Herný systém Forbidden Lands vytvorilo Free League Publishing.
