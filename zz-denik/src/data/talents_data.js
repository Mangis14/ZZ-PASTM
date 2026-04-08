export const TALENTS_DATA = {
    profession: [
        // BARD
        {
            id: 'path_of_praise',
            name: 'Cesta chvály',
            profession: 'Bard',
            ranks: [
                { rank: 1, description: 'Vyřazeného společníka (STŘEDNÍ) postavíš na nohy. Za 1 VŮLE obnovíš 1 bod vlastnosti.' },
                { rank: 2, description: 'Utrať X VŮLE: X společníků (STŘEDNÍ) si obnoví 1 bod zranění v určené vlastnosti.' },
                { rank: 3, description: 'Předej libovolný počet VŮLE společníkovi (DLOUHÁ).' }
            ]
        },
        {
            id: 'path_of_song',
            name: 'Cesta písně',
            profession: 'Bard',
            ranks: [
                { rank: 1, description: 'Zpěv (1 VŮLE): Upoutáš pozornost (KRÁTKÁ). Postih k OSTRAŽITOSTI rovný utracené VŮLI.' },
                { rank: 2, description: 'Jako 1., navíc ti zaplatí tolik stříbrňáků, kolik utratíš VŮLE.' },
                { rank: 3, description: 'Zpěv (STŘEDNÍ): 1 zranění SÍLY za každý bod VŮLE. Rozdělitelné. Vzdoruje EMPATIE.' }
            ]
        },
        {
            id: 'path_of_war_cry',
            name: 'Cesta válečného pokřiku',
            profession: 'Bard',
            ranks: [
                { rank: 1, description: 'Pokřik (STŘEDNÍ): Společníci mají +1 k útoku za každý bod VŮLE na jedno kolo.' },
                { rank: 2, description: 'Řev (STŘEDNÍ): Nepřátelé mají -1 k útoku za každý bod VŮLE na jedno kolo.' },
                { rank: 3, description: 'Řev (STŘEDNÍ): 1 zranění BYSTROSTI za každý bod VŮLE. Vzdoruje EMPATIE.' }
            ]
        },
        // BOJOVNÍK
        {
            id: 'path_of_the_blade',
            name: 'Cesta ostří',
            profession: 'Bojovník',
            ranks: [
                { rank: 1, description: '1 VŮLE: Ignoruješ zbroj soupeře.' },
                { rank: 2, description: '1 VŮLE: Po spotřebování akcí okamžitý útok zblízka (1x za kolo).' },
                { rank: 3, description: 'Zvýšení zranění o 1 za každý bod VŮLE.' }
            ]
        },
        {
            id: 'path_of_the_enemy',
            name: 'Cesta nepřítele',
            profession: 'Bojovník',
            ranks: [
                { rank: 1, description: '1 VŮLE: Změna iniciativy na jinou nevyužitou v kole.' },
                { rank: 2, description: '1 VŮLE: Cíl nemůže ODRÁŽET ani se VYHNOUT jednomu útoku.' },
                { rank: 3, description: '1 VŮLE: Při ODRAŽENÍ s více ⚔️ se přebytečné počítají jako protiútok (nelze bránit).' }
            ]
        },
        {
            id: 'path_of_the_shield',
            name: 'Cesta štítu',
            profession: 'Bojovník',
            ranks: [
                { rank: 1, description: '1 VŮLE: ODRAZIT útok místo společníka (KRÁTKÁ).' },
                { rank: 2, description: '1 VŮLE: ODRÁŽENÍ se nepočítá do akcí.' },
                { rank: 3, description: 'Snížení zranění o 1 za každý bod VŮLE po úspěšném ODRAŽENÍ.' }
            ]
        },
        // JEZDEC
        {
            id: 'path_of_the_knight',
            name: 'Cesta rytíře',
            profession: 'Jezdec',
            ranks: [
                { rank: 1, description: '1 VŮLE: Líznout kartu iniciativy navíc a vybrat lepší.' },
                { rank: 2, description: 'Na zvířeti: 1 VŮLE vyruší 1 ⚔️ útoku.' },
                { rank: 3, description: 'Na zvířeti: Zvýšení zranění o 1 za každý bod VŮLE.' }
            ]
        },
        {
            id: 'path_of_the_companion',
            name: 'Cesta společníka',
            profession: 'Jezdec',
            ranks: [
                { rank: 1, description: '1 VŮLE: Zvíře tě brání, když jsi vyřazen.' },
                { rank: 2, description: '1 VŮLE: Zvíře ti obnoví 1 bod vlastnosti, když jsi vyřazen.' },
                { rank: 3, description: '1 VŮLE: Zvíře zaútočí spolu s tebou.' }
            ]
        },
        {
            id: 'path_of_the_plains',
            name: 'Cesta stepi',
            profession: 'Jezdec',
            ranks: [
                { rank: 1, description: '1 VŮLE: Zvíře ujede o hex víc (otevřený terén).' },
                { rank: 2, description: '1 VŮLE: Útěk z boje bez házení.' },
                { rank: 3, description: '1 VŮLE: Zvýšení pohyblivosti zvířete o 1 stupeň na kolo.' }
            ]
        },
        // KUPEC
        {
            id: 'path_of_lies',
            name: 'Cesta lží',
            profession: 'Kupec',
            ranks: [
                { rank: 1, description: '1 VŮLE: Vypravěč prozradí, zda NPC lže (ne o čem).' },
                { rank: 2, description: '1 VŮLE: Automatický úspěch při MANIPULACI (NPC ti uvěří).' },
                { rank: 3, description: '1 VŮLE: Po úspěšné MANIPULACI po tobě cíl nemůže nic chtít a nezaútočí.' }
            ]
        },
        {
            id: 'path_of_many_things',
            name: 'Cesta mnoha věcí',
            profession: 'Kupec',
            ranks: [
                { rank: 1, description: 'Najdeš v tlumoku běžný předmět (max 1 stříbrný za 1 VŮLE).' },
                { rank: 2, description: 'Můžeš nacházet i zbraně.' },
                { rank: 3, description: 'Předmět může stát až 1 zlatý za 1 VŮLE.' }
            ]
        },
        {
            id: 'path_of_gold',
            name: 'Cesta zlata',
            profession: 'Kupec',
            ranks: [
                { rank: 1, description: 'Sleva 1/5 za každý bod VŮLE (max 4 body).' },
                { rank: 2, description: '1 VŮLE: Rozpoznáš cennosti v místnosti.' },
                { rank: 3, description: '1 VŮLE: Najdeš 1 zlaťák po kapsách.' }
            ]
        },
        // LOVEC
        {
            id: 'path_of_the_forest',
            name: 'Cesta hvozdu',
            profession: 'Lovec',
            ranks: [
                { rank: 1, description: '1 VŮLE: Automatický úspěch při HLEDÁNÍ POTRAVY, LOVU, UDÁVÁNÍ SMĚRU.' },
                { rank: 2, description: '1 VŮLE: Automatický úspěch při odolávání zimě.' },
                { rank: 3, description: '1 VŮLE: Nemusíš jíst ani pít jeden den.' }
            ]
        },
        {
            id: 'path_of_the_beast',
            name: 'Cesta šelmy',
            profession: 'Lovec',
            ranks: [
                { rank: 1, description: '1 VŮLE: Zvíře provede průzkum a varuje před hrozbou.' },
                { rank: 2, description: '1 VŮLE: Zvíře ti obnoví 1 bod vlastnosti, když jsi vyřazen.' },
                { rank: 3, description: '1 VŮLE: Zvíře bojuje po tvém boku jedno kolo.' }
            ]
        },
        {
            id: 'path_of_the_arrow',
            name: 'Cesta šípu',
            profession: 'Lovec',
            ranks: [
                { rank: 1, description: '1 VŮLE: Ignoruješ zbroj při střelbě.' },
                { rank: 2, description: '1 VŮLE: Okamžitý útok střelnou zbraní po spotřebování akcí (1x za kolo).' },
                { rank: 3, description: 'Zvýšení zranění střelbou o 1 za každý bod VŮLE.' }
            ]
        },
        // LUPIČ
        {
            id: 'path_of_acrobatics',
            name: 'Cesta akrobacie',
            profession: 'Lupič',
            ranks: [
                { rank: 1, description: '1 VŮLE: +k8 k hodu na MRŠTNOST při použití vybavení.' },
                { rank: 2, description: '1 VŮLE: Útěk z pout nebo protažení malým otvorem.' },
                { rank: 3, description: 'Snížení zranění z pádu o 1 za každý bod VŮLE (max 5).' }
            ]
        },
        {
            id: 'path_of_dexterity',
            name: 'Cesta šikovnosti',
            profession: 'Lupič',
            ranks: [
                { rank: 1, description: '1 VŮLE: Žádný postih s improvizovanými nástroji + kostka vybavení.' },
                { rank: 2, description: '1 VŮLE: Použití ZLODĚJINY místo BOJE ZBLÍZKA (lehké/vrhací). +1 zranění za další VŮLI.' },
                { rank: 3, description: 'Snížení úspěchů protivníka na OSTRAŽITOST o 1 za každý bod VŮLE.' }
            ]
        },
        {
            id: 'path_of_shadows',
            name: 'Cesta stínů',
            profession: 'Lupič',
            ranks: [
                { rank: 1, description: 'Zvýšení zranění při ÚTOKU ZE ZÁLOHY o 1 za každý bod VŮLE.' },
                { rank: 2, description: '+1 k modifikátoru vzdálenosti při přepadení za každý bod VŮLE.' },
                { rank: 3, description: '1 VŮLE za osobu: Házíš na PLÍŽENÍ za celou skupinu.' }
            ]
        },
        // ŘEMESLNÍK
        {
            id: 'path_of_destruction',
            name: 'Cesta ničení',
            profession: 'Řemeslník',
            ranks: [
                { rank: 1, description: 'Použití ŘEMESLA místo SVALŮ/BOJE ZBLÍZKA při ničení předmětů.' },
                { rank: 2, description: 'Zvýšení poškození předmětu o 1 za každý bod VŮLE.' },
                { rank: 3, description: '1 VŮLE: Okamžité zničení předmětu (až do TZ 8) při úspěšném hodu.' }
            ]
        },
        {
            id: 'path_of_durability',
            name: 'Cesta stálosti',
            profession: 'Řemeslník',
            ranks: [
                { rank: 1, description: '1 VŮLE = 1 úspěch při opravě.' },
                { rank: 2, description: '1 VŮLE: Předmět ignoruje první bod poškození.' },
                { rank: 3, description: 'Zvýšení bonusu vybavení (cena: 2x nový bonus ve VŮLI).' }
            ]
        },
        {
            id: 'path_of_adaptability',
            name: 'Cesta přizpůsobivosti',
            profession: 'Řemeslník',
            ranks: [
                { rank: 1, description: '1 VŮLE: Výroba dočasného předmětu bez vybavení.' },
                { rank: 2, description: '1 VŮLE: Dočasný předmět má bonus +1.' },
                { rank: 3, description: '1 VŮLE: Dočasný předmět má bonus až +3 (cena 1 VŮLE za +1).' }
            ]
        },
        // ŠAMPIÓN
        {
            id: 'path_of_protection',
            name: 'Cesta ochrany',
            profession: 'Šampión',
            ranks: [
                { rank: 1, description: '1 VŮLE: POVALENÍ protivníka (STŘEDNÍ) jako pomalá akce.' },
                { rank: 2, description: '1 VŮLE: Výměna místa se spojencem (KRÁTKÁ) jako rychlá akce.' },
                { rank: 3, description: '1 VŮLE: Utrpíš poškození místo spojence (KRÁTKÁ). 1 zranění za 1 VŮLE.' }
            ]
        },
        {
            id: 'path_of_fate',
            name: 'Cesta osudu',
            profession: 'Šampión',
            ranks: [
                { rank: 1, description: '1 VŮLE: +1 k útokům a obraně proti jednomu protivníkovi na kolo.' },
                { rank: 2, description: 'Snížení poškození o 1 za každý bod VŮLE (po hodu na zbroj).' },
                { rank: 3, description: '1-3 VŮLE: Získání 1-3 akcí navíc (jen v tvém kole).' }
            ]
        },
        {
            id: 'path_of_holy_vow',
            name: 'Cesta svatého slibu',
            profession: 'Šampión',
            ranks: [
                { rank: 1, description: '1 VŮLE: +k8 k hodu souvisejícímu s přísahou.' },
                { rank: 2, description: '1 VŮLE: +k10 k hodu.' },
                { rank: 3, description: '1 VŮLE: +k12 k hodu.' }
            ]
        },
        // ŠVIHÁK
        {
            id: 'path_of_the_hound',
            name: 'Cesta ohaře',
            profession: 'Švihák',
            ranks: [
                { rank: 1, description: '1 VŮLE: Pes bojuje v tvém kole.' },
                { rank: 2, description: '1 VŮLE: Pes ignoruje zbroj protivníka.' },
                { rank: 3, description: 'Zvýšení zranění psa o 1 za každý bod VŮLE.' }
            ]
        },
        {
            id: 'path_of_the_commander',
            name: 'Cesta velitele',
            profession: 'Švihák',
            ranks: [
                { rank: 1, description: '1 VŮLE: Spojenec (STŘEDNÍ) provede volnou akci (Tasení, Běh, Ústup, Příprava).' },
                { rank: 2, description: '1 VŮLE: Spojenec není zlomen strachem (zůstane na 1 BYSTROSTI).' },
                { rank: 3, description: '1 VŮLE: Spojenec provede útok (Seknutí, Bodnutí, Výstřel, Zteč).' }
            ]
        },
        {
            id: 'path_of_the_scholar',
            name: 'Cesta učence',
            profession: 'Švihák',
            ranks: [
                { rank: 1, description: '1 VŮLE: Ověření PŘÍBĚHŮ. Úspěchy navíc = bonus +1 později.' },
                { rank: 2, description: '1 VŮLE: Inspirace spojence (+2/+1 k hodu) hodem na EMPATII.' },
                { rank: 3, description: 'Odstranění úspěchu protivníka při MANIPULACI za každý bod VŮLE.' }
            ]
        },
        // ZLODĚJ
        {
            id: 'path_of_poison',
            name: 'Cesta jedu',
            profession: 'Zloděj',
            ranks: [
                { rank: 1, description: 'X VŮLE: Smrtelný jed s účinností 3*X.' },
                { rank: 2, description: 'Možnost zvolit jiný typ jedu.' },
                { rank: 3, description: 'Jed nanesen na zbraň bez akce.' }
            ]
        },
        {
            id: 'path_of_the_face',
            name: 'Cesta tváře',
            profession: 'Zloděj',
            ranks: [
                { rank: 1, description: '1 VŮLE: Změna podoby (stejný rod/pohlaví). -1 k odhalení za další VŮLI.' },
                { rank: 2, description: 'Napodobení hlasu a vystupování.' },
                { rank: 3, description: 'Změna podoby na opačné pohlaví/jiný rod.' }
            ]
        },
        {
            id: 'path_of_the_killer',
            name: 'Cesta zabijáka',
            profession: 'Zloděj',
            ranks: [
                { rank: 1, description: 'Zvýšení zranění při ÚTOKU ZE ZÁLOHY o 1 za každý bod VŮLE.' },
                { rank: 2, description: '1 VŮLE: Vysmeknutí z pout nebo protažení malým otvorem.' },
                { rank: 3, description: '1 VŮLE: Hypnóza - donucení k akci.' }
            ]
        }
    ],
    general: [
        {
            id: 'alchymista',
            name: 'Alchymista',
            description: 'Při hledání potravy můžeš hledat bylinky.',
            ranks: [
                { rank: 1, description: 'Hodem na LÉČENÍ můžeš vytvořit 1 dávku za 1 ⚔️.' },
                { rank: 2, description: 'Při výrobě máš +1 na lektvary.' },
                { rank: 3, description: 'Můžeš si přičíst k8.' }
            ]
        },
        {
            id: 'berserker',
            name: 'Berserker',
            description: 'Když poprvé utrpíš vyřazení, můžeš propadnout pudovému běsnění. Musíš hned napadnout nejbližšího protivníka útokem nablízko a pokračovat v boji, dokud tě nevyřadí nebo dokud nebudou vyřazeni všichni nepřátelé v dohledu. Po dobu běsnění se na tebe nedá používat MANIPULACE a všechny tvoje útoky v boji zblízka způsobí 1 bod zranění navíc.',
            ranks: [
                { rank: 1, description: 'Při vyřazení doplníš 1 bod vlastnosti, která ti klesla na nulu.' },
                { rank: 2, description: 'Při vyřazení doplníš 2 body vlastnosti, která ti klesla na nulu.' },
                { rank: 3, description: 'Při vyřazení doplníš 3 body vlastnosti, která ti klesla na nulu.' }
            ]
        },
        {
            id: 'bojovnik_s_holi',
            name: 'Bojovník s holí',
            description: 'Umíš bojovat dobře s holí.',
            ranks: [
                { rank: 1, description: 'Při odrážení máš +1.' },
                { rank: 2, description: 'Úspěchy navíc při ODRÁŽENÍ, ODZBROJENÍ nebo POVALENÍ mohou udělit zranění.' },
                { rank: 3, description: 'K ODRÁŽENÍ nebo útoku můžeš přičíst k8.' },
                { rank: 4, description: 'Útok holí je krátká akce.' }
            ]
        },
        {
            id: 'bojovnik_s_tezkou_zbrani',
            name: 'Bojovník s těžkou zbraní',
            description: 'Umíš dobře zacházet s těžkou zbraní.',
            ranks: [
                { rank: 1, description: 'Při nápřahu s těžkou zbraní můžeš házet na SVALY (s bonusem +2 pokud používáš obě ruce), počet úspěchů pak nahradí bonus +1.' },
                { rank: 2, description: 'Protivníci mají postih k odrážení dle počtu rukou, kterými držíš zbraň.' },
                { rank: 3, description: 'Každá nevzozená zbroj dostane dodatečné zranění.' },
                { rank: 4, description: 'Každý předmět, který odrážel tvůj útok získá jedno poškození za každou 💀.' }
            ]
        },
        {
            id: 'bojovnik_v_sedle',
            name: 'Bojovník v sedle',
            description: 'Umíš bojovat ze hřbetu jezdeckého zvířete. Všechny uvedené účinky se dají vyžít jedině v otevřené bojové zóně.',
            ranks: [
                { rank: 1, description: 'Ze hřbetu jezdeckého zvířete můžeš střílet z krátkého luku nebo praku.' },
                { rank: 2, description: 'Na všechny útoky nablízko ze hřbetu dostáváš úpravu +1.' },
                { rank: 3, description: 'Ze hřbetu zvířete můžeš provést JÍZDNÍ ZTEČ. Jde o kombinaci plného pohybu zvířete (alespoň ze střední vzdálenosti do vzdálenosti délky paže) s útokem zbraní nablízko. K tomuto útoku můžeš přičíst k8.' },
                { rank: 4, description: 'JÍZDNÍ ZTEČ je krátká akce.' }
            ]
        },
        {
            id: 'bylinkar',
            name: 'Bylinkář',
            description: 'Umíš rozpoznat jedlé rostliny od obyčejného plevele.',
            ranks: [
                { rank: 1, description: 'Při HLEDÁNÍ POTRAVY v divočině se tvůj hod na PŘEŽITÍ vztahuje úprava +1.' },
                { rank: 2, description: 'Čtvrtden HLEDÁNÍ POTRAVY se pro tebe počítá jako ODPOČINEK.' },
                { rank: 3, description: 'Při HLEDÁNÍ POTRAVY pokaždé najdeš dvounásobek plodin.' }
            ]
        },
        {
            id: 'desivy',
            name: 'Děsivý',
            description: 'Dokážeš lidi výhružkami přimět, aby tě poslechli.',
            ranks: [
                { rank: 1, description: 'Při vyhrožování můžeš místo MANIPULACE hodit na SVALY. Při úspěchu po tobě nemůže protivník nic chtít, při neúspěchu na tebe zaútočí.' },
                { rank: 2, description: 'Viz I., ale při vyhrožování máš bonus SVALY +1.' },
                { rank: 3, description: 'Jako 2., ale můžeš si přičíst jednu k8.' }
            ]
        },
        {
            id: 'drakobijec',
            name: 'Drakobijec',
            description: 'Bonusy v boji proti nestvůrám.',
            ranks: [
                { rank: 1, description: 'Tvoje útoky proti nestvůrám mají + 1.' },
                { rank: 2, description: 'Útoky mají +1 zranění.' },
                { rank: 3, description: 'Můžeš si přičíst jednu k8.' }
            ]
        },
        {
            id: 'duelista',
            name: 'Duelista',
            description: 'Vynikáte v boji s volnou rukou.',
            ranks: [
                { rank: 1, description: 'Pro útoky máš +1, pokud používáte jednoruční zbraň a druhou ruku máte volnou.' },
                { rank: 2, description: 'Funguje i na odrážení.' },
                { rank: 3, description: 'Můžeš si přičíst jednu k8.' }
            ]
        },
        {
            id: 'dykar',
            name: 'Dýkař',
            description: 'Bonusy při boji s dýkou nebo nožem.',
            ranks: [
                { rank: 1, description: 'V boji máš bonus +1.' },
                { rank: 2, description: 'BODNUTÍ je pro tebe krátká akce.' },
                { rank: 3, description: 'Ke každému útoku můžeš přičíst k8.' }
            ]
        },
        {
            id: 'harpunar',
            name: 'Harpunář',
            description: 'Když házíš harpunou nebo házecím kopím, málokdy mineš svůj cíl a znáš slabinu svého cíle.',
            ranks: [
                { rank: 1, description: 'Tvoje útoky mají úpravu +1.' },
                { rank: 2, description: 'Při zásahu nepřítele s alespoň 1 zraněním způsobíš cíli krvácení. Krvácející cíl ztratí 1 bod síly na začátku každého kola, dokud není vyřazen (smrt po d6 minutách). Krvácení lze zastavit hodem na LÉČENÍ.' },
                { rank: 3, description: 'Ke každému útoku můžeš přičíst k8.' }
            ]
        },
        {
            id: 'hbite_nohy',
            name: 'Hbité nohy',
            description: 'V boji umíš pohotově uskakovat.',
            ranks: [
                { rank: 1, description: 'V každém kole máš jednu akci ÚHYB zdarma. Dodatečný úhyb se nepočítá do tvých akcí za kolo.' },
                { rank: 2, description: 'Na všechny ÚHYBY máš +1.' },
                { rank: 3, description: 'V každém kole máš neomezení počet ÚHYBŮ, ale vždy jenom jeden útok. Úhyby se počítají jako jedna akce.' }
            ]
        },
        {
            id: 'chladnokrevny',
            name: 'Chladnokrevný',
            description: 'Jsi schopen zabít bezbranné protivníky.',
            ranks: [
                { rank: 1, description: 'Na akci RÁNA Z MILOSTI neházíš.' },
                { rank: 2, description: 'Viz I., ale nemusíš utrácet bod vůle, ani nemáš zranění osobnosti.' },
                { rank: 3, description: 'Viz II., ale po provedení RÁNY Z MILOSTI si obnovíš bod osobnosti.' },
                { rank: 4, description: 'Tvoje RÁNA Z MILOSTI je útok strachem pro nepřátele v krátké vzdálenosti proti tvému vystupování nebo manipulaci.' }
            ]
        },
        {
            id: 'intuitivni',
            name: 'Intuitivní',
            description: 'Dokážeš číst lidi snadněji než ostatní.',
            ranks: [
                { rank: 1, description: 'Když použijete empatii k čtení lidí, můžete za každý další ⚔️ získat náznaky o jejich motivacích, minulosti a věcech, které skrývají.' },
                { rank: 2, description: 'Získáte +1 bonus při použití postřehu k čtení lidí nebo při odporování manipulaci.' },
                { rank: 3, description: 'Lidé nemohou číst tebe; můžeš je zmást falešnými informacemi.' }
            ]
        },
        {
            id: 'kapsar',
            name: 'Kapsář',
            description: 'Jsi mistr v kradení a ukrývání věcí.',
            ranks: [
                { rank: 1, description: 'Při použití ZLODĚJNA na kradení nebo ukrývání máš bonus +1.' },
                { rank: 2, description: 'Dokážeš nechat malé předměty zmizet před očima ostatních, což ti přidává bonus k vystoupením.' },
                { rank: 3, description: 'Můžeš přidat k8 při kradení, schovávání předmětů nebo podvádění při hazardu.' }
            ]
        },
        {
            id: 'kladivar',
            name: 'Kladivář',
            description: 'Bonusy při boji s TUPOU zbraní.',
            ranks: [
                { rank: 1, description: 'Ke všem útokům si přičítáš +1.' },
                { rank: 2, description: 'Všechny útoky způsobí alespoň 1 zranění.' },
                { rank: 3, description: 'Ke všem útokům můžeš přičíst k8.' },
                { rank: 4, description: 'Ignoruješ polovinu ⚔️ pro zbroj (Nahoru).' }
            ]
        },
        {
            id: 'kopinik',
            name: 'Kopiník',
            description: 'Bonusy při boji s kopím, halapartnou, píkou a trojzubcem.',
            ranks: [
                { rank: 1, description: 'Ke všem útokům si přičítáš +1.' },
                { rank: 2, description: 'Pokud zbraň držíš můžeš okamžitě provést útok, pokud se nepřítel přesune z KRÁTKÉ na DÉLKU PAŽE. Útok se počítá mezi tvé akce, ale přeskakuje pořadí.' },
                { rank: 3, description: 'Ke všem útokům můžeš přičíst k8.' },
                { rank: 4, description: 'Útok z úrovně II. Je brán jako krátká akce.' }
            ]
        },
        {
            id: 'kuchar',
            name: 'Kuchař',
            description: 'Umíš vařit třeba i z mála.',
            ranks: [
                { rank: 1, description: 'Umíš přeměnit za čtvrden pomocí ohně k6 surovin na jídlo.' },
                { rank: 2, description: 'Vytvoříš o jednu jednotku jídla navíc.' },
                { rank: 3, description: 'Tvoje jídlo doplní bod osobnosti (max 1 za čtvrtden).' },
                { rank: 4, description: 'Jednou za krátký odpočínek/čtvrden si dokážeš najít čas na to přeměnit 1 jednotku jídla.' }
            ]
        },
        {
            id: 'kurator_magie',
            name: 'Kurátor magie',
            description: 'Zvládáš ovládat více kouzel než běžní čarodějové. Tvoje BYSTROST se při výpočtu maximálního počtu známých kouzel počítá, jako by byla zvýšena o úroveň tohoto talentu. Pokud překročíš limit kouzel, můžeš místo zapomenutí jednoho z nich získat tento talent.',
            ranks: []
        },
        {
            id: 'namornik',
            name: 'Námořník',
            description: 'Umíš kormidlovat vory a lodě.',
            ranks: [
                { rank: 1, description: 'Při UDÁVÁNÍ SMĚRU +1 na PŘEŽITÍ.' },
                { rank: 2, description: 'Čtvrtden UDÁVÁNÍ SMĚRU je pro tebe odpočinek.' },
                { rank: 3, description: 'Při UDÁVÁNÍ SMĚRU přičti k8.' }
            ]
        },
        {
            id: 'nebojacny',
            name: 'Nebojácný',
            description: 'Nic tě neděsí.',
            ranks: [
                { rank: 1, description: 'Proti útoku strachem se můžeš bránit hodem na EMPATII jako by to byla zbroj. Každý ⚔️ vyruší jeden ⚔️.' },
                { rank: 2, description: 'Útoky strachem ti mohou poškodit osobnosti místo bystrosti.' },
                { rank: 3, description: 'Po hodu se můžeš rozhodnout, že se staneš imunní vůči danému útoku (jednou za souboj).' },
                { rank: 4, description: 'Po prvním útoku strachem získáš bod vůle.' }
            ]
        },
        {
            id: 'obouruky',
            name: 'Obouruký',
            description: 'Ve druhé ruce můžeš bojovat s vedlejší zbraní. Pokud máte DÝKAŘ 2, můžete nyní bodnout nožem nebo dýkou jako volnou akci jednou za kolo.',
            ranks: [
                { rank: 1, description: 'Jeden útok navíc jako krátká akce, musí být LEHKÁ a má postih -2.' },
                { rank: 2, description: 'Viz I., ale zbraň může být normální.' },
                { rank: 3, description: 'Viz. II, ale bez postihu.' },
                { rank: 4, description: 'Pokud zasáhnete stejný cíl dvěma útoky po sobě, nejprve hlavní zbraní a poté vedlejší zbraní, vedlejší útok způsobí +1 poškození.' }
            ]
        },
        {
            id: 'obrance',
            name: 'Obránce',
            description: 'V boji zblízka se umíš bránit štítem a zbraní.',
            ranks: [
                { rank: 1, description: 'Jedna akce ODRAŽENÍ zdarma.' },
                { rank: 2, description: 'Na všechna ODRAŽENÍ +1.' },
                { rank: 3, description: 'Neomezený počet ODRAŽENÍ, ale max jedno na útok. Dohromady jedna akce.' }
            ]
        },
        {
            id: 'odolny_proti_bolesti',
            name: 'Odolný proti bolesti',
            description: 'Dokážeš ustát bolest.',
            ranks: [
                { rank: 1, description: 'Jednou za souboj, pokud je tvoje Síla snížena přesně na nulu, ignoruješ 1 bod zranění a zůstaneš na 1 bodu Síly. Pokud to zabrání zranění z push hodu, nezískáš za to žádné body vůle.' },
                { rank: 2, description: 'Můžeš ho použít víckrát za střetnutí.' },
                { rank: 3, description: 'Za každé zranění síly doplň bod jinde.' }
            ]
        },
        {
            id: 'ostrostrelec',
            name: 'Ostrostřelec',
            description: 'Mistrně ovládáš střelbu lukem a kuší.',
            ranks: [
                { rank: 1, description: 'Při VÝSTŘELU máš bonus +1.' },
                { rank: 2, description: 'Na STŘEDNÍ a DLOUHOU vzdálenost nemáš žádné postihy.' },
                { rank: 3, description: 'Ke každému útoku přičti k8.' }
            ]
        },
        {
            id: 'ostry_jazycek',
            name: 'Ostrý jazýček',
            description: 'Umíš znamenitě urážet při MANIPULACI.',
            ranks: [
                { rank: 1, description: 'Při MANIPULACI se každý ⚔️ navíc počítá jako zranění osobnosti.' },
                { rank: 2, description: 'Při urážení máš +1 k MANIPULACI.' },
                { rank: 3, description: 'Při urážení můžeš přičíst k8.' }
            ]
        },
        {
            id: 'pesi_ztec',
            name: 'Pěší zteč',
            description: 'Vrháš se boje bez ohledu na vlastní nebezpečí.',
            ranks: [
                { rank: 1, description: 'Při přesunu z KRÁTKÉ do DÉLKY PAŽE můžeš v rámci stejné akce zahrát SEKNUTÍ, BODNUTÍ, ÚDĚR PĚSTÍ A POVALENÍ. (Zteč – dlouhá akce).' },
                { rank: 2, description: 'Při zteči přičti bonus +1.' },
                { rank: 3, description: 'Při zteči přičti k8.' }
            ]
        },
        {
            id: 'pevny_postoj',
            name: 'Pevný postoj',
            description: 'Máš dobrou rovnováhu a nedáš se POVALIT.',
            ranks: [
                { rank: 1, description: 'Při POVALENÍ potřebují dva ⚔️.' },
                { rank: 2, description: 'Nedáš se POVALIT.' },
                { rank: 3, description: 'Zvednout se tě nestojí akci.' }
            ]
        },
        {
            id: 'pevny_stisk',
            name: 'Pevný stisk',
            description: 'Nepřátelé ti hůře vyrazí zbraň z ruky.',
            ranks: [
                { rank: 1, description: 'Aby tě někdo mohl ozbrojit potřebuje dva ⚔️ u normální a tři ⚔️ u obouruční.' },
                { rank: 2, description: 'Tři ⚔️ u normální a čtyři ⚔️ u obouruční.' },
                { rank: 3, description: 'Nedáš se ozbrojit.' },
                { rank: 4, description: 'Můžeš v jedné ruce držet obouruční zbraň, můžeš s ní být ale ozbrojen za dva  ⚔️.' }
            ]
        },
        {
            id: 'popravci',
            name: 'Popravčí',
            description: 'Umíš zasadit lépe zasadit kritické zranění.',
            ranks: [
                { rank: 1, description: 'Hoď si na kritické zranění 2x a vyber.' },
                { rank: 2, description: 'Viz. I., ale můžeš čísla i obrátit.' },
                { rank: 3, description: 'Kritické zranění si můžeš vybrat.' }
            ]
        },
        {
            id: 'poutnik',
            name: 'Poutník',
            description: 'Při pochodech nemáš potřebu odpočívat.',
            ranks: [
                { rank: 1, description: 'Při nuceném pochopu máš +1 na výdrž.' },
                { rank: 2, description: 'Při nuceném pochopu vždy uspěješ.' },
                { rank: 3, description: 'Čtvrtden pochopu je pro tebe ODPOČINEK.' },
                { rank: 4, description: 'Tvoji společníci mají při pochodu +1 k VÝDRŽI a OSTRAŽITOSTI.' }
            ]
        },
        {
            id: 'pruzkumnik',
            name: 'Průzkumník',
            description: 'Dokážeš v divočině najít správnou cestu.',
            ranks: [
                { rank: 1, description: 'Při UDÁVÁNÍ SMĚRU máš PŘEŽITÍ +1.' },
                { rank: 2, description: 'Čtvrtden UDÁVÁNÍ SMĚRU je pro tebe ODPOČINEK.' },
                { rank: 3, description: 'Při UDÁVÁNÍ SMĚRU přičti k8.' }
            ]
        },
        {
            id: 'rvac',
            name: 'Rváč',
            description: 'Dokážeš se dobře bít beze zbraně.',
            ranks: [
                { rank: 1, description: 'Tvoje útoky beze zbraně mají bonus +1.' },
                { rank: 2, description: 'Můžeš útočit hlavou. Běžný útok beze zbraně jako krátká akce.' },
                { rank: 3, description: 'K útoku můžeš přičíst k8.' }
            ]
        },
        {
            id: 'rybar',
            name: 'Rybář',
            description: 'Umíš pomocí udice, sítě nebo rybářského vybavení chytat ryby.',
            ranks: [
                { rank: 1, description: 'Hod na PŘEŽITÍ při rybaření +1.' },
                { rank: 2, description: 'Čtvrtden rybaření je ODPOČINEK.' },
                { rank: 3, description: 'Vždy chytíš 2x více ryb.' },
                { rank: 4, description: 'Můžeš použít svou kostku jídla jako další úspěchy.' }
            ]
        },
        {
            id: 'rychle_taseni',
            name: 'Rychlé tasení',
            description: 'Umíš velmi rychle tasit zbraň.',
            ranks: [
                { rank: 1, description: 'Tasíš LEHKOU zbraň bez akce.' },
                { rank: 2, description: 'Tasíš BĚŽNOU zbraň bez akce.' },
                { rank: 3, description: 'Tasíš TĚŽKOU zbraň bez akce.' }
            ]
        },
        {
            id: 'rychlost_blesku',
            name: 'Rychlost blesku',
            description: 'Reaguješ rychleji než nepřátelé.',
            ranks: [
                { rank: 1, description: 'Lížeš si 2 karty iniciativy a vybereš si.' },
                { rank: 2, description: 'Lížeš si 3 karty iniciativy a vybereš si.' },
                { rank: 3, description: 'Lížeš si 4 karty iniciativy a vybereš si.' },
                { rank: 4, description: 'Pokud jsi v prvním kole dříve než nepřátele, máš jednu krátkou akci navíc.' }
            ]
        },
        {
            id: 'rychlostrelec',
            name: 'Rychlostřelec',
            description: 'Dokážeš rychle střílet z luku.',
            ranks: [
                { rank: 1, description: 'Před VÝSTŘELEM se nemusíš PŘIPRAVOVAT – neplatí pro kuš.' },
                { rank: 2, description: 'Můžeš VÝSTŘELEM a u toho BĚŽET.' },
                { rank: 3, description: 'VÝSTŘEL je krátká akce (2x za kolo).' }
            ]
        },
        {
            id: 'sekernik',
            name: 'Sekerník',
            description: 'Umíš velmi dobře bojovat se sekerou.',
            ranks: [
                { rank: 1, description: 'Při bojí máš bonus +1.' },
                { rank: 2, description: 'Při zranění způsobíš i kritické zranění (neplatí na zvířata a nestvůry).' },
                { rank: 3, description: 'Při každému útoku přičti k8.' }
            ]
        },
        {
            id: 'soumar',
            name: 'Soumar',
            description: 'Dokážeš si zabalit a nosit více věcí.',
            ranks: [
                { rank: 1, description: 'Uneseš o 2 předměty více.' },
                { rank: 2, description: 'Uneseš o 5 předmětů více.' },
                { rank: 3, description: 'Uneseš o 5 předmětů více.' },
                { rank: 4, description: 'Každý ze skupiny má talent soumar o 1 více.' }
            ]
        },
        {
            id: 'stavitel',
            name: 'Stavitel',
            description: 'Dokážeš rozšiřovat tvrz.',
            ranks: [
                { rank: 1, description: 'Dokážeš budovat složitější prvky.' },
                { rank: 2, description: 'Při stavbě tvrze máš +1.' },
                { rank: 3, description: 'Při stavbě tvrze máš navíc k8.' }
            ]
        },
        {
            id: 'stopar',
            name: 'Stopař',
            description: 'Dokážeš velmi dobře stopovat kořist.',
            ranks: [
                { rank: 1, description: 'Při LOVU v divočině máš PŘEŽITÍ +1.' },
                { rank: 2, description: 'Čtvrtden lovení je ODPOČINEK.' },
                { rank: 3, description: 'Při LOVU hoď 2x a vybrat zvíře.' },
                { rank: 4, description: 'Úspěchy navíc můžeš proměnit v další nalezená zvířata, jsou ulovena úspěchy navíc v druhém hodu.' }
            ]
        },
        {
            id: 'sermir',
            name: 'Šermíř',
            description: 'Umíš dobře bojovat s mečem.',
            ranks: [
                { rank: 1, description: 'Při boji máš na ÚTOK a ODRAŽENÍ +1.' },
                { rank: 2, description: 'Umíš seknout dva nepřítele naráz.' },
                { rank: 3, description: 'Při boji máš na ÚTOK a ODRAŽENÍ k8.' }
            ]
        },
        {
            id: 'stitonos',
            name: 'Štítonoš',
            description: 'Lépe se kryješ štítem.',
            ranks: [
                { rank: 1, description: 'Při hodu na ODRÁŽENÍ máš +1.' },
                { rank: 2, description: 'Štítem můžeš SEKNOUT, jako krátkou akci – tupá rána, 1 zranění.' },
                { rank: 3, description: 'Při hodu na ODRÁŽENÍ přidej k8.' },
                { rank: 4, description: 'Můžeš seknout štítem jednou za kolo, akcí navíc.' }
            ]
        },
        {
            id: 'stastlivec',
            name: 'Šťastlivec',
            description: 'Díky štěstí se vyhneš zranění, funguje pouze jednou za čtvrtden.',
            ranks: [
                { rank: 1, description: 'Na kritické zranění házíš 2x a vybereš.' },
                { rank: 2, description: 'Můžeš prohodit čísla na kostce.' },
                { rank: 3, description: 'Kritické zranění si libovolně vybereš.' }
            ]
        },
        {
            id: 'sesty_smysl',
            name: 'Šestý smysl',
            description: 'Dokážeš lépe vycítit nebezpečí.',
            ranks: [
                { rank: 1, description: 'Při přepadení máš +1 k OSTRAŽITOSTI.' },
                { rank: 2, description: 'Před přepadením poznáš útočníky.' },
                { rank: 3, description: 'Při přepadení máš k8 k OSTRAŽITOSTI.' }
            ]
        },
        {
            id: 'teplokrevny',
            name: 'Teplokrevný',
            description: '',
            ranks: [
                { rank: 1, description: 'Házíš si pouze na polovinu hodů na PODCHLAZENÍ.' },
                { rank: 2, description: 'Na hody na PODCHLAZENÍ máš bonus +1.' },
                { rank: 3, description: 'Můžeš zahřát jinou osobu svým tělem. Dostává +1 bonus na PODCHALZENÍ, musíte se fyzicky dotýkat.' }
            ]
        },
        {
            id: 'travic',
            name: 'Travič',
            description: 'Víš, jak vyrobit jedy jakéhokoliv typu.',
            ranks: [
                { rank: 1, description: 'Pomocí ŘEMESLA nebo LÉČENÍ můžeš vyrobit jedy (186), každý ⚔️ navíc zvyšuje účinnost jedu o jedna.' },
                { rank: 2, description: 'Viz I., ale na výrobu máš bonus +1.' },
                { rank: 3, description: 'Viz II., ale na výrobu máš bonus k8.' }
            ]
        },
        {
            id: 'vrhac',
            name: 'Vrhač',
            description: 'Dokážeš lépe používat vrhací zbraně (mimo kopí a harpunu - viz. harpunář) a prak.',
            ranks: [
                { rank: 1, description: 'Při boji máš bonus +1.' },
                { rank: 2, description: 'Tvoje útoky mají DLOUHÝ dostřel.' },
                { rank: 3, description: 'Při každém útoku přičti k8.' }
            ]
        },
        {
            id: 'vypravec',
            name: 'Vypravěč',
            description: 'Dokážeš předávat příběhy a číst z nich důležité poznatky.',
            ranks: [
                { rank: 1, description: 'Při hodu na PŘÍBĚHY máš bonus +1, když si vybavuješ detaily o osobnostech, artefaktech, místech nebo nestvůrách.' },
                { rank: 2, description: 'Vždy máš připravenou vhodnou sprostou historku. Přidej VYSTUPOVÁNÍ k jakémukoli hodu na výkon, když se snažíš rozptýlit nebo snížit nepřátelskost situace, proti čemuž se oponuje EMPATIÍ.' },
                { rank: 3, description: 'Přičti k8, vztahuje se i na II. úroveň.' }
            ]
        },
        {
            id: 'zalesak',
            name: 'Zálesák',
            description: 'Umíš se dobře UTÁBOŘIT a postarat o ohniště.',
            ranks: [
                { rank: 1, description: 'Při UTÁBOŘENÍ máš +1 na PŘEŽITÍ.' },
                { rank: 2, description: 'Osoba na hlídce má +2 na OSTRAŽITOST ve tvém táboru.' },
                { rank: 3, description: 'Při UTÁBOŘENÍ přičti k8.' },
                { rank: 4, description: 'Tábor dokážeš postavit téměř okamžitě, takže funguje již tento ČTVRTDEN.' }
            ]
        },
        {
            id: 'zamecnik',
            name: 'Zámečník',
            description: 'Pomocí nářadí umíš odemykat zámky.',
            ranks: [
                { rank: 1, description: 'Při odemykáni máš na ZLODĚJNU +1.' },
                { rank: 2, description: 'ZLODĚJNOU se můžeš dostat z pout.' },
                { rank: 3, description: 'Při odemykáni máš k8 na ZLODĚJNU.' }
            ]
        },
        {
            id: 'zasadovy',
            name: 'Zásadový',
            description: 'Je těžké tě ZMANIPULOVAT.',
            ranks: [
                { rank: 1, description: 'Proti ZMANIPULOVÁNÍ máš +1.' },
                { rank: 2, description: 'Proti ZMANIPULOVÁNÍ máš k8.' },
                { rank: 3, description: 'Není možno tě zmanipulovat.' }
            ]
        },
        {
            id: 'zakernik',
            name: 'Zákeřník',
            description: '',
            ranks: [
                { rank: 1, description: 'Když provedete útok ze zálohy zákeřný útok s lehkou zbraní na blízko, můžete místo dovednosti boj zblízka použít zlodějnu, ignoruješ pak brnění.' },
                { rank: 2, description: 'Vaše útoky pomocí zlodějny, které způsobí alespoň jeden bod zranění, zabrání cíli mluvit nebo utéct během jeho příštího kola.' },
                { rank: 3, description: 'Vaše útoky pomocí zlodějny, které způsobí alespoň jeden bod zranění, se také stávají vzdorovaným hodem proti výdrži cíle. Pokud cíl neuspěje v, je automaticky vyřazen a utrpí kritické zranění. Tento efekt neplatí na nestvůry.' }
            ]
        },
        {
            id: 'kovar',
            name: 'Kovář',
            description: 'Pomocí dovednosti ŘEMESLA vyrobíš jakoukoliv zbraň na blízko, štít nebo kovovou zbroj.',
            ranks: [
                { rank: 1, description: 'V kovárně můžeš ze železné rudy vytvářet železo. Můžete nahradit železo jinými kovy. Můžete vyrábět slabší štíty bez použití kůže. Můžete rozebírat kovové předměty.' },
                { rank: 2, description: 'Při opravě máš +1 k6. Můžeš předmět vyrobit s bonusem +1 (trvá 2x déle, postih -1). Můžete přidávat kovové objímky na mistrovské dřevěné zbraně.' },
                { rank: 3, description: 'Při opravě máš +1 k8. Můžeš předmět vyrobit s bonusem +2 (trvá 4x déle, postih -2). Můžeš vyrábět ocel.' }
            ]
        },
        {
            id: 'kozeluh',
            name: 'Koželuh',
            description: 'Při hodu na ŘEMESLA vytvoříš k6 kožešiny na useň.',
            ranks: [
                { rank: 1, description: 'Umíš vytvářet kožené zbroje. Zpracování kožešin na surovou kůži, jelenici. Výroba tuku, lepidla, mýdla, laku. Výroba praků.' },
                { rank: 2, description: 'Při opravě máš +1 k6. Výroba s bonusem +1 (trvá 2x déle, postih -1). Preparace zvířat.' },
                { rank: 3, description: 'Při opravě máš +1 k8. Výroba s bonusem +2 (trvá 4x déle, postih -2). Skleněná kompozitní kůže. Barvení kůže.' }
            ]
        },
        {
            id: 'krejci',
            name: 'Krejčí',
            description: 'Při hodu na ŘEMESLA vytvoříš k6 látky z vlny.',
            ranks: [
                { rank: 1, description: 'Výroba látkových brnění (gambeson, brigantina). Přeměna lnu na látku. Tvorba uměleckých děl. Tetování.' },
                { rank: 2, description: 'Výroba s 2x cenou (trvá 2x déle, postih -1). Při opravě +1 k6. Látková brnění s +1 obranou. Přeměna hedvábí. Vodoodpudivý olej. Samovznícivé ohně.' },
                { rank: 3, description: 'Výroba s 4x cenou (trvá 4x déle, postih -2). Při opravě +1 k8. Látková brnění s +2 obranou.' }
            ]
        },
        {
            id: 'lukar',
            name: 'Lukař',
            description: 'Pomocí ŘEMESLA můžeš vyrobit střelné zbraně.',
            ranks: [
                { rank: 1, description: 'Výroba zbraní na blízko z kostí (slabé).' },
                { rank: 2, description: 'Při opravě +1 k6. Výroba s bonusem +1 (trvá 2x déle, postih -1). Válečné luky, šípy, zbraně z pazourku.' },
                { rank: 3, description: 'Při opravě +1 k8. Výroba s bonusem +2 (trvá 4x déle, postih -2). Kompozitní luky/kuše, surová kůže jako výztuž.' }
            ]
        }
    ]
};
