/*
  Revize tabulek Zboží (Google Docs je zdroj pravdy).

  Každá oprava se uplatní jen tehdy, když dokument v daném poli stále obsahuje
  původní (chybnou) hodnotu `from`. Jakmile se chyba opraví přímo v dokumentu
  nebo se hodnota změní jinak, oprava se přeskočí a import vypíše varování,
  takže úpravy v tabulce mají vždy přednost.

  Klíč: `${subtype}|${název bez hvězdičky}` — název je už po sloučení odstavců
  v buňce (viz getRowCells).
*/

export const goodsCorrections = {
  // --- Zboží ---------------------------------------------------------------
  'general|Kniha': {
    reason: 'Cena byla nižší než cena surovin (50 pergamenů ≈ 30 st.); nejasný zápis surovin.',
    fields: {
      Cena: ['10', '40'],
      Suroviny: ['50 pergamenů, 1/2 kůže|dřeva', '50 pergamenů, 1/2 usně nebo dřeva'],
    },
  },
  'general|Olej, lampový': {
    reason: 'Alternativa „2 Lnu“ (0,6 st.) byla dražší než olej (0,2 st.); Průvodce hráče uvádí jen 1/4 loje.',
    fields: { Suroviny: ['1/4 loje nebo 2 Lnu', '1/4 loje nebo 1/2 lnu'] },
  },
  'general|Lepidlo': {
    reason: 'Překlep v dostupnosti.',
    fields: { Dostupnost: ['běžké', 'běžné'] },
  },
  'general|Brousek': {
    reason: 'Chybějící předložka v účinku.',
    fields: {
      Účinek: [
        'Pro kovové zbraně může být použit opravě, pokud chybí přesně 1 bod',
        'Pro kovové zbraně může být použit k opravě, pokud chybí přesně 1 bod.',
      ],
    },
  },
  'general|Páčidlo': {
    reason: 'Chyběla dostupnost, váha a výroba (bez váhy se nepočítalo do zatížení); doplněno podle Háku na lano (1 železo, 3 st.).',
    fields: {
      Dostupnost: ['', 'běžné'],
      Váha: ['', 'normální'],
      Suroviny: ['', '1 železo'],
      Čas: ['', 'čtvrtden'],
      Talent: ['', 'Kovář'],
      Nářadí: ['', 'kovárna'],
    },
  },

  // --- Zbraně nablízko -----------------------------------------------------
  'weapons_melee|Šavle': {
    reason: 'Gramatika surovin; zranění podle Průvodce hráče (str. 101: 2).',
    fields: {
      Suroviny: ['1 železa, 1/2 usně', '1 železo, 1/2 usně'],
      Zranění: ['1', '2'],
    },
  },
  'weapons_melee|Velký dřevěný kyj': {
    reason: 'Zdvojená vlastnost; podle Průvodce hráče (str. 101: těžká, tupá).',
    fields: { Vlastnosti: ['tupá, tupá', 'těžká, tupá'] },
  },
  'weapons_melee|Hůl': {
    reason: 'Chyběl dosah – podle Průvodce hráče (str. 101) má hůl vzdálenost Krátká jako kopí.',
    fields: { Ruce: ['2', '2 (krátká)'] },
  },
  'weapons_melee|Dlouhé kopí': {
    reason: 'Gramatika surovin.',
    fields: { Suroviny: ['1/2 železa, 2 dřevo', '1/2 železa, 2 dřeva'] },
  },
  'weapons_melee|Píka': {
    reason: 'Gramatika surovin.',
    fields: { Suroviny: ['1/2 železa, 2 dřevo', '1/2 železa, 2 dřeva'] },
  },
  'weapons_melee|Trojzubec': {
    reason: 'Gramatika surovin; zranění podle Průvodce hráče (str. 101: 2).',
    fields: {
      Suroviny: ['1 železo, 1 dřeva', '1 železo, 1 dřevo'],
      Zranění: ['1', '2'],
    },
  },
  'weapons_melee|Odrážecí dýka': {
    reason: 'Požadovaná úroveň talentu byla zapsaná ve sloupci Nářadí.',
    fields: {
      Talent: ['Kovář', 'Kovář (úroveň 3)'],
      Nářadí: ['kovárna, (kovář 3)', 'kovárna'],
    },
  },

  // --- Střelné zbraně ------------------------------------------------------
  'weapons_ranged|Dlouhý luk': {
    reason: 'Chyběl dostřel (Průvodce hráče str. 103: Dlouhá).',
    fields: { Vlastnosti: ['', 'max dlouhá vzdálenost'] },
  },
  'weapons_ranged|Lehká kuše': {
    reason: 'Chyběl dostřel; bonus podle Průvodce hráče (str. 103: +1, Dlouhá) – lehká kuše měla vyšší bonus než těžká.',
    fields: {
      Bonus: ['+2', '+1'],
      Vlastnosti: ['nabíjení je dlouhá akce', 'max dlouhá vzdálenost, nabíjení je dlouhá akce'],
    },
  },
  'weapons_ranged|Těžká kuše': {
    reason: 'Chyběl dostřel (Průvodce hráče str. 103: Dlouhá).',
    fields: { Vlastnosti: ['nabíjení je dlouhá akce', 'max dlouhá vzdálenost, nabíjení je dlouhá akce'] },
  },
  'weapons_ranged|Kompozitní kuše': {
    reason: 'Chyběl dostřel (jako ostatní kuše).',
    fields: { Vlastnosti: ['nabíjení je dlouhá akce', 'max dlouhá vzdálenost, nabíjení je dlouhá akce'] },
  },
  'weapons_ranged|Válečný luk': {
    reason: 'Sjednocení zápisu úrovně talentu.',
    fields: { Talent: ['Lukař 2.', 'Lukař (úroveň 2)'] },
  },
  'weapons_ranged|Kompozitní luk': {
    reason: 'Sjednocení zápisu úrovně talentu a času.',
    fields: {
      Talent: ['Lukař 3.', 'Lukař (úroveň 3)'],
      Čas: ['1 týden', 'jeden týden'],
    },
  },
  'weapons_ranged|Šípy, pazourkový hrot': {
    reason: 'Sjednocení zápisu úrovně talentu.',
    fields: { Talent: ['Lukař 2.', 'Lukař (úroveň 2)'] },
  },
  'weapons_ranged|Šípy dřevěný hrot': {
    reason: 'Dřevěný hrot nepotřebuje kováře (bez železa, nářadí jen nůž); sjednocení názvu.',
    rename: 'Šípy, dřevěný hrot',
    fields: { Talent: ['Kovář, Lukař', 'Lukař'] },
  },
  'weapons_ranged|Šipky dřevěný hrot': {
    reason: 'Sjednocení názvu.',
    rename: 'Šipky, dřevěný hrot',
    fields: {},
  },
  'weapons_ranged|Šipky s jedem': {
    reason: 'Velké písmeno u talentu; cena 1 st. nezahrnuje jed (3–5 st.).',
    fields: {
      Talent: ['Lukař, travič', 'Lukař, Travič'],
      Vlastnosti: ['Při zásahu otráví cíl', 'Při zásahu otráví cíl (cena nezahrnuje jed)'],
    },
  },

  // --- Zbroj ---------------------------------------------------------------
  'armor|Prošívanice': {
    reason: 'Překlep ve váze, gramatika surovin a času.',
    fields: {
      Váha: ['normánlí', 'normální'],
      Suroviny: ['6 látky', '6 látek'],
      Čas: ['2 dny', 'dva dny'],
    },
  },
  'armor|Lehká brigantina': {
    reason: 'Překlepy v surovinách („plátky“), nářadí („kovárka“), talentu a čase.',
    fields: {
      Suroviny: ['5 plátky, železo', '5 látek, 1 železo'],
      Talent: ['Krejčí, kovář', 'Krejčí, Kovář'],
      Nářadí: ['kovárka, jehla a nit', 'kovárna, jehla a nit'],
      Čas: ['týden', 'jeden týden'],
    },
  },
  'armor|Lamelová kožená zbroj': {
    reason: 'Obsahuje železo – stejně jako Pokovaná kožená zbroj (Průvodce hráče str. 191) vyžaduje Kováře a kovárnu.',
    fields: {
      Talent: ['Koželuh', 'Kovář, Koželuh'],
      Nářadí: ['jehla a nit', 'kovárna, jehla a nit'],
    },
  },
  'armor|Pokovaná kožená čapka': {
    reason: 'Gramatika surovin.',
    fields: { Suroviny: ['1/2 železa, 1 usně', '1/2 železa, 1 useň'] },
  },
  'armor|Balvát (prošívaná čapka)': {
    reason: 'Překlep ve váze.',
    fields: { Váha: ['normánlí', 'normální'] },
  },

  // --- Suroviny ------------------------------------------------------------
  'materials_basic|Med': {
    reason: 'Posunuté sloupce: zdroj byl ve sloupci Talent a nářadí/talent ve sloupci Zdroj.',
    fields: {
      Zdroj: ['Pochodeň, Odolnost proti bolesti', 'Úl (2 jednotky 3× ročně)'],
      Talent: ['', 'Odolný proti bolesti'],
      Nářadí: ['Úl (2 jednotky 3x ročně)', 'Pochodeň'],
    },
  },
  'materials_basic|Lůj': {
    reason: 'Nesrozumitelná věta v poznámce.',
    fields: {
      Poznámky: [
        'Zabité nebo poražené zvíře poskytne tolik jednotek loje masa vydělený dvěma (zaokrouhleno nahoru).',
        'Zabité nebo poražené zvíře poskytne tolik jednotek loje, kolik dává jednotek masa, vyděleno dvěma (zaokrouhleno nahoru).',
      ],
    },
  },
  'materials_basic|Vosk': {
    reason: 'Překlep v poznámce.',
    fields: { Poznámky: ['slouží k přídání odolnosti k vodě', 'Slouží k přidání odolnosti proti vodě.'] },
  },
  'materials_basic|Látka, lněná': {
    reason: 'Sjednocení zápisu úrovně talentu.',
    fields: {
      Talent: ['Krejčí II.', 'Krejčí (úroveň 2)'],
      Zdroj: ['5x Len', '5× len'],
    },
  },
  'materials_special|Palivové dřevo': {
    reason: 'Posunuté sloupce: rychlost těžby byla ve sloupci Talent/nářadí.',
    fields: {
      Čas: ['', '1/čtvrtden'],
      'Talent/nářadí': ['1/čtvrtden', 'Sekera'],
    },
  },
  'materials_special|Černé uhlí': {
    reason: 'Posunuté sloupce: rychlost těžby a důl v jednom poli.',
    fields: {
      Čas: ['', '1/čtvrtden'],
      'Talent/nářadí': ['1/Uhelný důl', 'Uhelný důl'],
    },
  },
  'materials_special|Dřevěné uhlí': {
    reason: '4× dřevo (1,2 st.) bylo dražší než výsledné uhlí (0,8 st.).',
    fields: { Zdroj: ['4× dřevo nebo palivové dřevo', '2× dřevo nebo 4× palivové dřevo'] },
  },
  'materials_special|Rtuť': {
    reason: 'Překlep v poměru – rtuť zajistí maximální výtěžnost.',
    fields: {
      Efekt: [
        'Získává také síru, dá se použít pro získání více zlata ze zlaté rudy pomocí mlýnu. (1:1 místo 1:1 až 1:2)',
        'Získává také síru, dá se použít pro získání více zlata ze zlaté rudy pomocí mlýnu. (1:2 místo 1:1 až 1:2)',
      ],
    },
  },
  'materials_special|Dračí kůže': {
    reason: 'Sjednocení zápisu času.',
    fields: { Čas: ['1 směna', '1/směna'] },
  },
  'materials_special|Meteoritový bronz Hvězdný bronz': {
    reason: 'Dva názvy v jedné buňce.',
    rename: 'Meteoritový bronz (Hvězdný bronz)',
    fields: {},
  },
  'materials_special|Meteoritové stříbro Pravostříbro': {
    reason: 'Dva názvy v jedné buňce.',
    rename: 'Meteoritové stříbro (Pravostříbro)',
    fields: {},
  },
  'materials_special|Meteoritové zlato Elyrium': {
    reason: 'Dva názvy v jedné buňce.',
    rename: 'Meteoritové zlato (Elyrium)',
    fields: {},
  },

  // --- Lektvary ------------------------------------------------------------
  'potions|Elixír rychlosti': {
    reason: 'Překlep v příkladu monstra.',
    fields: { 'Příklad monstra': ['gryj, harpyje', 'gryf, harpyje'] },
  },
  'potions|Lektvar vzpružení': {
    reason: 'Chybějící čárka.',
    fields: { 'Příklad monstra': ['améba oliheň', 'améba, oliheň'] },
  },
};

/* Věci, které revize našla, ale bez rozhodnutí autora je nemění. */
export const goodsReviewNotes = [
  'Pokovaná kožená čapka: v tabulce Normální, Průvodce hráče (str. 190) uvádí lehká.',
  'Vrhací sekera: bonus +2, Průvodce hráče (str. 103) uvádí +1.',
];
