export const SPELLS_DATA = {
  "Obecná": [
    {
      "id": "magicka_pecet",
      "name": "MAGICKÁ PEČEŤ",
      "rank": 1,
      "range": "délka paže",
      "duration": "jeden čtvrtden",
      "ingredient": "kousek křídy",
      "description": "Tímhle kouzlem ochráníš jednu osobu nebo jedno místo (veliké maximálně jako člověk) před magií. Síla všech kouzel, které se na danou osobu nebo místo pokusí někdo během následujícího čtvrtdne seslat, se sníží o sílu kouzla MAGICKÁ PEČEŤ."
    },
    {
      "id": "vyciteni_magie",
      "name": "VYCÍTĚNÍ MAGIE",
      "rank": 1,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "virgule",
      "description": "Jakožto čaroděj nebo druid automaticky cítíš, jestli někdo na STŘEDNÍ vzdálenost od tebe používá magii nebo jestli je nějaký předmět magií nabitý. Pokud se ale chceš dozvědět víc o tom, o jaký druh magie se jedná, musíš seslat VYCÍTĚNÍ MAGIE. Seslání tohohle kouzla je taky nutné k vycítění ZASTŘENÉ magie (ve vedlejším sloupci) – v takovém případě musí být síla tvého kouzla stejná jako síla kouzla ZASTŘENÍ MAGIE nebo vyšší."
    },
    {
      "id": "kouzelnicky_trik",
      "name": "KOUZELNICKÝ TRIK",
      "rank": 1,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "Hrst písku",
      "description": "Dokážeš provést jednoduchý trik dle školy kouzel, které ovládáš. Ve vhodných situacích dokáže poskytnout bonusy. Lze použít i bez bodů vůle, ale neposkytne žádnou herní výhodu. Léčení: Uklidnit bolest, utěšit, vyzařovat přátelství.Tvarozměna: Vydávat zvuky jako zvíře, nechat zpívat ptáky, proměnit část těla ve zvířecí.Jasnozřivost: Vytvořit poletující světélka, zbělání očí, svítivé čelo.Krvavá: Viditelně krvácíš, zrudnutí očí, vydávat teploSymbolika: Silný hlas, zjeví se zpráva ve vzduchuSmrti: Chladný dotyk, vzhled nemrtvého, západ rozkladu, tlumení světel v okolí.Kamenopěvec: Kameny se začnou pohybovat nebo levitovat, kamenná kůže."
    },
    {
      "id": "prekonani_magicke_odolnosti",
      "name": "PŘEKONÁNÍ MAGICKÉ ODOLNOSTI",
      "rank": 1,
      "range": "osobní",
      "duration": "čtvrtden",
      "ingredient": "Obsidián nebo sklo",
      "description": "Můžeš ignorovat hodnotu magické odolnost (např. magická pečeť) dle síly kouzla"
    },
    {
      "id": "magicky_majak",
      "name": "MAGICKÝ MAJÁK",
      "rank": 1,
      "range": "krátká",
      "duration": "směna/čtvrtden",
      "ingredient": "Drahokam 2.zl (nespotřebuje se)",
      "description": "Všechny seslaná kouzla na cíl jsou silnější o 1 úroveň a o 1 kostku. Při použití 2 BV je doba trvání jeden čtvrtden."
    },
    {
      "id": "rozptyleni_magie",
      "name": "ROZPTÝLENÍ MAGIE",
      "rank": 2,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "železné piliny",
      "description": "Můžeš narušovat kouzla seslaná ostatními. Tohle kouzlo je reakce a porušuje běžné pořadí iniciativy (strana 83). Snížíš jím sílu soupeřova kouzla o sílu svého kouzla ROZPTÝLENÍ MAGIE. Pokud ho tímhle způsobem snížíš na nulu, soupeřovo kouzlo se nijak neprojeví. Oba dva si musíte hodit na přepálení a nehody, stejně jako u každého jiného kouzla. O tom, kolik bodů vůle utratíš na ROZPTÝLENÍ, musíš rozhodnout ještě předtím, než si kdokoli z vás hodí."
    },
    {
      "id": "zastreni_magie",
      "name": "ZASTŘENÍ MAGIE",
      "rank": 2,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "kus látky",
      "description": "Jestli chceš kouzlit bez povšimnutí, musíš svou magii ZASTŘÍT. Vyžaduje to o 1 bod vůle navíc, přičemž tenhle bod vůle se nepočítá do síly kouzla. ZASTŘENÍ MAGIE se samo o sobě nepočítá jako akce. Aby si pak jiná postava ovládající magii tvého ZASTŘENÉHO kouzla všimla, bude ho muset aktivně hledat sesláním kouzla VYCÍTĚNÍ MAGIE."
    },
    {
      "id": "zesileni_magie",
      "name": "ZESÍLENÍ MAGIE",
      "rank": 2,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "Přesýpací hodiny (čas), Dalekohled (vzdálenost), nespotřebují se",
      "description": "Dokážeš prodloužit dosah kouzla (musí být minimálně vzdálenosti paže) o jednu vzdálenost za úroveň kouzla nebo zdvojnásob dobu trvání kouzla delšího než okamžitého. Každý úroveň však zvýší i stupeň původního kouzla (ne úroveň)"
    },
    {
      "id": "prenos",
      "name": "PŘENOS",
      "rank": 3,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "kapka tvojí krve",
      "description": "Tímhle kouzlem můžeš krást body vůle ostatním nebo předávat své body vůle někomu jinému. Základní cena za seslání kouzla je jeden bod vůle a potom už můžeš vzít nebo předat libovolný počet dalších bodů vůle. Pokud se cíl PŘENOSU brání, nebude to tak snadné – v takovém případě dokážeš přenést maximálně tolik bodů vůle, kolik je síla kouzla PŘENOS. Bod vůle utracený za seslání PŘENOSU se nepřenáší."
    },
    {
      "id": "pripoutani_magie",
      "name": "PŘIPOUTÁNÍ MAGIE",
      "rank": 3,
      "range": "osobní",
      "duration": "různé",
      "ingredient": "brk nebo dláto",
      "description": "Zkušení čarodějové a druidi dovedou PŘIPOUTAT kouzla k neživým objektům a vytvářet tak magické pasti nebo mocné čarovné artefakty. Takové kouzlo sešleš jako každé jiné, jenom musíš utratit jeden bod vůle navíc za to, že se kouzlo neuvolní hned a místo toho se naváže na předmět. Rituály se PŘIPOUTAT nedají. Během PŘIPOUTÁVÁNÍ si hoď na přepálení a magické nehody. Bod vůle utracený navíc se sice nepočítá do síly kouzla, ale přesto za něj musíš hodit kostkou. Při utracení jednoho bodu vůle navíc vydrží magie po dobu jednoho dne nebo do aktivace kouzla. Při utracení dvou bodů vůle navíc vydrží věčně, ale po aktivaci kouzla se rozptýlí. Utracením pěti bodů vůle navíc PŘIPOUTÁŠ magii k předmětu navěky a kouzlo půjde aktivovat jednou denně (což stojí tolik bodů vůle, jakou má kouzlo sílu). Kouzla můžeš PŘIPOUTAT, jakýmkoli způsobem uznáš za vhodné. Rozhodni, čím se kouzlo aktivuje. K běžným způsobům aktivace patří vyřčení určité fráze, otevření předmětu, jeho rozbití nebo třeba mrštění o zem. Aktivované kouzlo funguje úplně stejně, jako když ho normálně sešleš."
    },
    {
      "id": "priprava_magie",
      "name": "PŘÍPRAVA MAGIE",
      "rank": 3,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "Pergamen",
      "description": "Dokážeš si připravit specifické kouzlo, které při příštím použití sešleš jako kouzelné slůvko. Nemůžeš si připravit rituál. Maximální úroveň připraveného kouzla je rovna síle tohoto kouzla. Nemůžeš mít připraven jedno kouzlo vícekrát."
    },
    {
      "id": "stabilizace_magie",
      "name": "STABILIZACE MAGIE",
      "rank": 3,
      "range": "krátká (celá zóna)",
      "duration": "1 kouzlo nebo čtvrtden",
      "ingredient": "Železný prsten (Nespotřebuje se)",
      "description": "Další kouzlo nebo rituál seslané v zóně v krátké vzdálenosti hází méně kostek dle síly tohoto kouzla."
    },
    {
      "id": "stabilni_magicka_zona",
      "name": "STABILNÍ MAGICKÁ ZÓNA",
      "rank": 3,
      "range": "střední (celá zona)",
      "duration": "permanentní",
      "ingredient": "viz. popis",
      "description": "Snažíš se stabilizovat magii v určité oblasti, takže všechny magické nehody z jednoho magického proudu (kouzelník/druid) jsou ovlivněny stejně jako první úroveň talentu Štěstí. Před sesláním rituálu musíš mít připravené vhodné místo: Kouzelník: Potřebuješ stavbu, kde můžeš vryté runy, pentagramy nebo jiné znaky. Příprava trvá 1 týden, vyžaduje úspěšný hod na ŘEMESLA a různé minerály za minimálně 10 zlatých. Druid: Potřebuješ založit kruh z kamenů nebo jinou přírodní strukturu. Příprava trvá 1 týden, vyžaduje hod na ŘEMESLA a opracovaný přírodní kámen vážící dohromady alespoň 250 jednotek. Síla kouzla zvyšuje počet škol, které můžeš stabilizovat, ale musí to být škola, kterou znáš. Pokud dojde k poškození místa, efekt okamžitě končí."
    }
  ],
  "Léčení": [
    {
      "id": "ocisteni_ducha",
      "name": "OČIŠTĚNÍ DUCHA",
      "rank": 1,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "hořící svíčka",
      "description": "Soustředěním přírodních sil dovedeš očišťovat potemnělé duše. Okamžitě vyléčíš tolik bodů bystrosti nebo osobnosti, kolik je síla kouzla. Nemůžeš léčit sebe."
    },
    {
      "id": "prikladani_rukou",
      "name": "PŘIKLÁDÁNÍ RUKOU",
      "rank": 1,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "jíl",
      "description": "Umíš přiložením ruky na ránu léčit zranění síly a obratnosti. Okamžitě vyléčíš tolik bodů vlastností, kolik je síla kouzla. Kouzlo nemá vliv na kritická zranění. Nemůžeš léčit sebe."
    },
    {
      "id": "prirodni_lecba",
      "name": "PŘÍRODNÍ LÉČBA",
      "rank": 1,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "léčivé byliny",
      "description": "Dokážeš uzdravit nemoc nebo neutralizovat účinky jedu – v někom jiném i v sobě. Síla kouzla musí být stejná nebo vyšší než hodnota nakažlivost nemoci nebo účinnosti jedu (strana 113) vydělená třemi. Zaokrouhluj dolů."
    },
    {
      "id": "zachovani",
      "name": "ZACHOVÁNÍ",
      "rank": 1,
      "range": "délka paže",
      "duration": "týden",
      "ingredient": "sůl",
      "description": "Materiál až o hmotnosti těžkého předmětu bude imunní vůči zkažení. Za další BV můžeš zacílit lidskou osobu, která může podstoupit hibernaci na týden, kde nebude mít postihy za stavy. Síla tři pak umožní zacílit celý vagon nákladu."
    },
    {
      "id": "koseni_nemrtvych",
      "name": "KOSENÍ NEMRTVÝCH",
      "rank": 2,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "svatý symbol Umrlci vylézající z hrobů jsou přečinem vůči přírodnímu řádu a jako takoví musí být zastaveni. Kouzlo způsobuje jednomu nemrtvému cíli tolik bodů zranění síly, kolik je síla kouzla.",
      "description": ""
    },
    {
      "id": "zaceleni_ran",
      "name": "ZACELENÍ RAN",
      "rank": 2,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "bílý mech",
      "description": "Kouzlem umíš léčit zlomené kosti a krvácející rány. Kouzlo okamžitě vyléčí kritické zranění. Na smrtelné zranění je potřeba síla kouzla aspoň 2. Není možné obnovovat ztracené končetiny."
    },
    {
      "id": "zapuzeni_demona",
      "name": "ZAPUZENÍ DÉMONA",
      "rank": 2,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "svatý symbol",
      "description": "Do Zapovězených zemí pronikly zlovolné démonické bytosti z jiných světů. Ovládáš síly, jimiž tyto nepřirozené stvůry dovedeš zapudit tam, kam patří. Kouzlo způsobuje démonickému cíli tolik bodů zranění síly, kolik je síla kouzla. Ovlivňuje i démony, kteří se nedají zranit běžnými fyzickými zbraněmi. Nemá ale žádný účinek na démonicky pokřivené tvory – jen na skutečné démony. Víc o démonech se dočteš v Příručce Vypravěče."
    },
    {
      "id": "samolecba",
      "name": "SAMOLÉČBA",
      "rank": 2,
      "range": "osobní",
      "duration": "čtvrtden/směna/okamžitě",
      "ingredient": "hod na zásobu vody",
      "description": "Vyléčíš si bod SÍLY, OBRATNOSTI, BYSTROSTI     a OSOBNOSTI na konci tohoto čtvrtdne. Můžeš utratit dalčí BV a zrychlit čas na směnu nebo za další se vyléčíš okamžitě."
    },
    {
      "id": "imunita",
      "name": "IMUNITA",
      "rank": 2,
      "range": "délka paže",
      "duration": "čtvrtden",
      "ingredient": "hadí zub",
      "description": "Cíl sníží efektivitu všech nemocí a jedů proti jeho osobě o 3 za úroveň kouzla. Další BV mohou zvýšit počet zasažených osob. Nefunguje pro již infikované.."
    },
    {
      "id": "harmonie",
      "name": "HARMONIE",
      "rank": 3,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "amulet",
      "description": "Tímhle kouzlem kolem sebe šíříš pokoj a harmonii, což ti pomáhá v sociálních konfliktech. Oběť kouzla musí udělat, co chceš – nemusíš házet na MANIPULACI a nemusíš pro ni udělat nic na oplátku. Pořád platí všechna ostatní omezení sociálních konfliktů, například že oběť nikdy nejedná v rozporu se svými zájmy. Kouzlo se dá použít jen proti živým, lidem podobným tvorům."
    },
    {
      "id": "vlada_nad_pocasim",
      "name": "VLÁDA NAD POČASÍM",
      "rank": 3,
      "range": "extrémní",
      "duration": "jeden čtvrtden",
      "ingredient": "pírko Umíš se tak naladit na přírodní síly, že dokážeš přivolat dramatické změny počasí. Změna se projeví v hexu mapy, ve kterém se zrovna nacházíš. Menší změna, třeba, že zatažena na déšť nebo z nehybného větru na lehký vánek, vyžaduje sílu kouzla 1. Neobvyklé projevy počasí, které se přesto nevymykají ročnímu období – vánice v zimě, dusivé vedro v létě nebo vichry a bičující deště na podzim vyžadují sílu kouzla 2. Zcela nepřirozené počasí, jako vánice v létě nebo vlna veder uprostřed zimy, vyžadují sílu 3.",
      "description": ""
    },
    {
      "id": "vzkriseni",
      "name": "VZKŘÍŠENÍ",
      "rank": 3,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "předmět patřící cíli",
      "description": "Umíš napnout přírodní síly k tomu, aby někoho vzkřísily z mrtvých – ne do podoby nemrtvého, ale jako skutečnou živoucí bytost. Čím víc času uplynulo od okamžiku smrti, tím obtížnější to bude. Před uplynutím čtvrtdne ti stačí síla kouzla 1, před uplynutím celého dne potřebuješ sílu kouzla 2 a před uplynutím týdne sílu kouzla 3. Pokud už uplynul víc než týden, je tělo příliš rozložené a nedá se VZKŘÍSIT. Osoba přivedená zpátky k životu trvale ztrácí jeden bod osobnosti, jelikož nahlédnutí do světa za závojem jí navěky změnilo pohled na život."
    },
    {
      "id": "posileni",
      "name": "POSÍLENÍ",
      "rank": 3,
      "range": "délka paže",
      "duration": "čtvrtden",
      "ingredient": "jídlo",
      "description": "Cíl neguje první poškození do atributu až do úrovně kouzla. Zranění z 💀 negeneruje žádné BV. Za další BV můžeš přidat druhý další cíl.."
    },
    {
      "id": "obnoveni",
      "name": "OBNOVENÍ",
      "rank": 3,
      "range": "krátká",
      "duration": "okamžitě",
      "ingredient": "léčivé bylinky",
      "description": "Cíl si rozdělí body mezi libovolné atributy dle síly kouzla. Lze cílit i na vyřazené. Dle síly kouzla můžeš cílit na více osob, ale stále si dohromady doplní dle úrovně kouzla."
    }
  ],
  "Smrt": [
    {
      "id": "mrtvolna_aura",
      "name": "MRTVOLNÁ AURA",
      "rank": 1,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "kápě",
      "description": "Tvé pochmurné vzezření vnáší do srdce oběti neklid a strach. Oběť utrpí tolik bodů zranění osobnosti, kolik je síla kouzla. Kouzlo účinkuje jen proti živým, člověku podobným tvorům."
    },
    {
      "id": "nakaza",
      "name": "NÁKAZA",
      "rank": 1,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "nemocné zvíře",
      "description": "Dokážeš přivolávat hrůzné choroby a trýznit jimi své nepřátele. Obětí musí být člověku podobná bytost. Kouzlo na ni uvrhne chorobu o nakažlivosti odpovídající síle kouzla vynásobené třemi. Neváhej podrobně vylíčit přesnou podobu nemoci."
    },
    {
      "id": "poskvrneni",
      "name": "POSKVRNĚNÍ",
      "rank": 1,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "hnijící jídlo",
      "description": "Dokážeš smrtí a rozkladem znehodnotit jídlo. Za každý stupeň síly kouzla můžeš POSKVRNIT jednu jednotku JÍDLA, aby bylo nepoživatelné. JÍDLO se změní v jed s účinností odpovídající síle kouzla vynásobené třemi."
    },
    {
      "id": "zahrobni_chlad",
      "name": "ZÁHROBNÍ CHLAD",
      "rank": 1,
      "range": "délka paže",
      "duration": "jedno kolo za každý stupeň síly kouzla",
      "ingredient": "úlomek křišťálu Necháš do oběti proniknout neúprosný chlad smrti. Oběť se stane PODCHLAZENOU a kvůli tomu okamžitě utrpí 1 bod zranění síly a bystrosti. V každém dalším kole utrpí oběť další 1 bod zranění v obou vlastnostech, dokud v každé vlastnosti neztratí tolik bodů, kolik je síla kouzla. Na nestvůry kouzlo neúčinkuje.",
      "description": ""
    },
    {
      "id": "mluveni_s_mrtvymi",
      "name": "MLUVENÍ S MRTVÝMI",
      "rank": 2,
      "range": "krátká",
      "duration": "jedna směna (15 minut)",
      "ingredient": "část těla mrtvé osoby",
      "description": "Umíš mluvit s mrtvými. Musíš se nacházet v KRÁTKÉ vzdálenosti od místa, kde dotyčný zemřel nebo je pochován. Musíš znát jeho jméno. Potom s ním můžeš několik minut mluvit a pokládat mu jednoduché otázky. Vypravěč rozhodne, co zesnulý ví a na co odpoví. Pamatuj ale, že mrtví někdy nechtějí spolupracovat. Pokud je tělo zesnulého jakžtakž vcelku, můžeš mluvit přímo s mrtvolou. V opačném případě mrtvého uslyšíš jako přízračný hlas ve své hlavě. Na nemrtvé kouzlo neúčinkuje."
    },
    {
      "id": "ruka_zkazy",
      "name": "RUKA ZKÁZY",
      "rank": 2,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "useknutá ruka",
      "description": "Tvoje kouzlo si magicky vyrve cestu k protivníkově srdci a vymáčkne z něj životní sílu. Kouzlo způsobuje tolik bodů zranění síly, kolik je síla kouzla. Utracením dalšího bodu vůle můžeš dosah prodloužit na STŘEDNÍ vzdálenost (tenhle bod vůle se nepočítá do síly kouzla). Kouzlo účinkuje jen proti živým, člověku podobným tvorům."
    },
    {
      "id": "probuzeni_mrtvych",
      "name": "PROBUZENÍ MRTVÝCH",
      "rank": 2,
      "range": "krátká",
      "duration": "jeden čtvrtden",
      "ingredient": "předmět patřící mrtvému",
      "description": "Hlavním úkolem záhrobní magie je probouzet mrtvé. V nejjednodušší podobě oživí tenhle rituál jedno mrtvé zvíře nebo člověku podobného tvora, z něhož se pak stane nemrtvý 1. stupně. Za každý stupeň síly kouzla nad ten první můžeš oživit jednoho dalšího nemrtvého, nebo zvýšit stupeň všech oživených nemrtvých o 1. Rituál se silou kouzla 2 tak dovede probudit dva nemrtvé 1. stupně, síla kouzla 3 oživí dva nemrtvé 2. stupně a tak dále. Nemrtvý 1. stupně nemá žádné uvažování, dokáže ale poslouchat jednoduché příkazy a používat zbraně nebo nářadí. Má stejnou sílu jako za života, obratnost sníženou o 1 (ale minimálně 1) a žádnou bystrost ani osobnost. Ponechává si dovednosti založené na síle a obratnosti. Nemrtvý 2. stupně se dá vylepšit následujícími možnostmi: ✥ Silnější. Síla se zvyšuje o 1. Při vyšších stupních síly kouzla můžeš tenhle účinek zvolit i opakovaně. ✥ Chytřejší. Nemrtvý si zachová část vlastního uvažování v podobě bystrosti, osobnosti a s nimi souvisejících dovedností. Hodnoty obou vlastností se snižují o 1 (minimum je 1). Nemrtvý dokáže odpovídat na jednoduché otázky o svém životě před smrtí i po ní, má však jen mlhavé pojetí o čase a snadno zapomíná. Poslouchá svého stvořitele a umí provádět lehce složitější úkoly. ✥ Trvanlivější. Doba trvání kouzla se prodlužuje na dvojnásobek. Při vyšších stupních síly kouzla můžeš tenhle účinek zvolit i opakovaně. Nemrtvý 3. stupně získá dva z uvedených účinků. Nemrtvý 4. stupně získá účinky tři, nemrtvý 5. stupně dostane čtyři účinky a tak dále. Všimni si, že účinky Silnější a Trvanlivější můžeš zvolit opakovaně. Pomocí PROBUZENÍ MRTVÝCH můžeš taky ovládnout „neklidné umrlce“ – bytosti, které i po smrti chodí po světě a svou smrt si neuvědomují. Víc se o nich dočteš v Příručce Vypravěče."
    },
    {
      "id": "des",
      "name": "DĚS",
      "rank": 3,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "lebka",
      "description": "Kouzlo zasévá do srdce oběti ukrutný strach. Hlavou se jí míhají výjevy toho, jak stárne a umírá. Oběť utrpí tolik bodů zranění bystrosti a osobnosti, kolik je síla kouzla. Kouzlo účinkuje jen na živé, člověku podobné tvory."
    },
    {
      "id": "tiha_veku",
      "name": "TÍHA VĚKŮ",
      "rank": 3,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "skalp bílých vlasů Můžeš urychlit stárnutí jedné živé bytosti. Oběť okamžitě zestárne o 10 let za jeden stupeň síly kouzla. Pokud se v důsledku toho přenese do jiné věkové kategorie (strana 31), natrvalo ztrácí jeden bod ve vlastnosti podle svého výběru. Jakmile oběť zestárne na dvojnásobek maximálního věku dospělého (například na 100 let u lidí), zchřadne a zemře. Kouzlo neúčinkuje na elfy a nestvůry.",
      "description": ""
    },
    {
      "id": "vysati_zivota",
      "name": "VYSÁTÍ ŽIVOTA",
      "rank": 3,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "živé zvíře",
      "description": "Dokážeš vysávat životní esenci z živých rostlin a zvířat kolem sebe. Získáš tolik bodů vůle, kolik je síla kouzla vynásobená dvěma. Rituál se dá provést jen v prostředí, kde roste dostatek vegetace, nefunguje tedy uvnitř budov ani na skalnatém úbočí hory. Po provedení rituálu zemřou všechna zvířata a rostliny v KRÁTKÉ vzdálenosti, tedy ve stejné zóně jako ty. Týká se to i lidí a dalších jim podobných tvorů."
    }
  ],
  "Krev": [
    {
      "id": "cereni_krve",
      "name": "ČEŘENÍ KRVE",
      "rank": 1,
      "range": "střední",
      "duration": "jedna směna (15 minut)",
      "ingredient": "kalich vína",
      "description": "Tímhle kouzlem rozvíříš oběti krev a podnítíš v ní silné emoce jako chtíč, strach nebo hněv. Oběť musí emocím nějakým způsobem podlehnout – jak přesně, to už záleží na konkrétní osobě a na situaci. O podrobnostech rozhodne Vypravěč. Kouzlo neúčinkuje v boji a nedá se použít proti nestvůrám."
    },
    {
      "id": "chuze_v_plamenech",
      "name": "CHŮZE V PLAMENECH",
      "rank": 1,
      "range": "osobní",
      "duration": "jeden čtvrtden",
      "ingredient": "kapka krve",
      "description": "Získáváš imunitu proti žáru a chladu (strana 111). Oheň ti nezpůsobuje žádné zranění."
    },
    {
      "id": "obet_krve",
      "name": "OBĚŤ KRVE",
      "rank": 1,
      "range": "osobní",
      "duration": "jedno kolo",
      "ingredient": "dýka (nespotřebuje se)",
      "description": "Můžeš odčerpat vlastní krev, aby sis posílil magii. Utrpíš zranění Síly rovné síle kouzla. Získáš tolik bodů vůle, které si přidáš k dalšímu kouzlu, které sešleš během jednoho kola. Pokud kouzlo během kola nesešleš, bonusové Úrovně Moci se ztratí."
    },
    {
      "id": "krevni_prisaha",
      "name": "KREVNÍ PŘÍSAHA",
      "rank": 1,
      "range": "vzdálenost paže",
      "duration": "jeden rok",
      "ingredient": "smlouva (nespotřebuje se)",
      "description": "Tímto kouzlem zavážeš cíl, aby pro tebe něco vykonal. Cíl to však musí dobrovolně přijmout, jinak kouzlo selže, proto se obvykle používá jako součást dohody. Pokud cíl po předem stanovené době neudělá žádný pokrok, nebo pokud provede něco, co dosažený pokrok zruší (např. vydá se opačným směrem), utrpí postih -2 ke všem akcím. Tento postih trvá, dokud neudělá větší pokrok, než dosáhl dříve. Pokud k zrušení pokroku dojde z příčin mimo jeho kontrolu, postih se nespustí — záleží pouze na tom, zda sám aktivně pracuje na splnění úkolu.Sílu kouzla lze použít k zdvojnásobení trvání nebo k přidání dalších cílů ti všichni však musí úkol dobrovolně přijmout.Kouzlo končí, pokud je úkol splněn, vyprší jeho trvání, nebo je smlouva zničena (případně smrt sesílatele za absence smlouvy)."
    },
    {
      "id": "hrdinstvi",
      "name": "HRDINSTVÍ",
      "rank": 1,
      "range": "střední",
      "duration": "jeden čtvrtden",
      "ingredient": "alkohol",
      "description": "Dokážeš ovlivnit hladinu hormonů v krvi cíle, které řídí pocit strachu. Díky tomu může cíl po dobu trvání kouzla ignorovat první zranění BYSTROSTI způsobené útokem strachem. Další úrovně moci lze použít buď k ovlivnění více cílů, nebo k zvýšení množství ignorovaného zranění."
    },
    {
      "id": "pouto_krve",
      "name": "POUTO KRVE",
      "rank": 2,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "tvá krev nebo krev cíle",
      "description": "Umíš přenášet krev – a spolu s ní i moc, která je v ní obsažená – mezi sebou a jinou postavou stejného rodu jako ty. Tímhle způsobem mezi vámi přeneseš až tolik bodů kterékoli vlastnosti, kolik je síla kouzla. Žádnou vlastnost ale nemůžeš navýšit nad její počáteční hodnotu. Ztracené body vlastností se obnovují běžným způsobem. Vzdorující oběť si může hodit na EMPATII se zápornou úpravou odpovídající síle kouzla. Úspěch znamená, že kouzlu odolá. Kouzlem můžeš postavit vyřazenou postavu na nohy, ovšem na kritická zranění nemá kouzlo žádný vliv."
    },
    {
      "id": "pripoutani_demona",
      "name": "PŘIPOUTÁNÍ DÉMONA",
      "rank": 2,
      "range": "střední",
      "duration": "jeden čtvrtden",
      "ingredient": "pentagram",
      "description": "Tímhle kouzlem můžeš poutat démonické bytosti z jiných světů a nutit je, aby tě poslouchaly. Démon kouzlu odolá při úspěšném hodu na EMPATII, na který se vztahuje záporná úprava odpovídající síle kouzla. Mysli na to, že démoni nemají pokusy čarodějů o PŘIPOUTÁNÍ příliš v lásce, a připrav se na případné následky."
    },
    {
      "id": "vzniceni",
      "name": "VZNÍCENÍ",
      "rank": 2,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "pochodeň nebo otevřený plamen",
      "description": "Dovedeš ostatním postavám zahřát krev natolik, že se oběť vznítí plamenem. Kouzlo způsobuje tolik poškození v síle, kolik je síla kouzla, a potom způsobuje další 1 bod zranění za kolo, dokud se oběť neuhasí úspěšným hodem na MRŠTNOST (dlouhá akce). Zbroj před kouzlem nijak nechrání."
    },
    {
      "id": "krvava_ruka",
      "name": "KRVAVÁ RUKA",
      "rank": 2,
      "range": "střední",
      "duration": "jedno kolo",
      "ingredient": "krev (nedává bonus)",
      "description": "Potřeš si ruku krví a z ní vytvoříš krvavý otisk ruky, který se vznáší ve vzduchu. Tento otisk může odletět a být ovládán na dálku. Vyžaduje to tvou plnou pozornost a může vykonávat jen velmi jednoduché úkony, například: otevřít dveře, zvednout předmět, nebo zatáhnout za páku. Otisk zmizí, pokud se dostane mimo dosah. Může nést předmět zabírající maximálně 1 slot váhy podle své SÍLY. Potřebuje-li krátce zatáhnout nebo pohnout něčím těžkým, má hodnotu SÍLY 1,. Na všem, čeho se dotkne, zanechává krvavé stopy. Síla kouzla zvětší o 1 trvání nebo SÍLU ruky."
    },
    {
      "id": "videni_ve_tme",
      "name": "VIDĚNÍ VE TMĚ",
      "rank": 2,
      "range": "osobní",
      "duration": "jedna směna za každý stupeň kouzla",
      "ingredient": "krev tvora co vidí ve tmě",
      "description": "Získáš schopnost bez omezení vidět i v naprosté tmě po dobu jedné směny za každou sílu kouzla."
    },
    {
      "id": "krvava_kletba",
      "name": "KRVAVÁ KLETBA",
      "rank": 3,
      "range": "neomezená",
      "duration": "jeden čtvrtden za každý stupeň síly kouzla",
      "ingredient": "vlas, chlup nebo jiná část těla oběti",
      "description": "Uvrhneš na oběť krvavou kletbu. Obětí musí být živý, člověku podobný tvor. Musíš znát jeho jméno a aspoň přibližně vědět, kde se nachází. Oběť pak utrpí zranění ve vlastnosti podle tvé volby. Celkem ztratí tolik bodů vlastnosti, kolik je síla kouzla, přičemž je ztrácí tempem jednoho bodu za den, dokud kouzlo nedosáhne plného účinku."
    },
    {
      "id": "soustredeni_krve",
      "name": "SOUSTŘEDĚNÍ KRVE",
      "rank": 3,
      "range": "osobní",
      "duration": "jedno kolo",
      "ingredient": "živá oběť",
      "description": "Kouzlo soustředí energii obsaženou v čarodějově krvi. Získáváš tolik bodů vůle, kolik je dvojnásobek síly kouzla. Účinek je ale jen dočasný. Nově nabyté body vůle musíš spotřebovat v příštím kole, jinak o ně přijdeš. Pokud jako pomůcku kouzla používáš živou oběť, musíš ji obětovat ještě před jeho sesláním. Malé zvíře bude stačit."
    },
    {
      "id": "pripoutani_duse",
      "name": "PŘIPOUTÁNÍ DUŠE",
      "rank": 3,
      "range": "délka paže",
      "duration": "různé",
      "ingredient": "obětní nůž",
      "description": "Tímhle rituálem vytáhneš z krve oběti její duši a uvězníš ji v libovolném předmětu (například zrcadle, šperku nebo zbrani). Oběť si musí hodit na EMPATII se zápornou úpravou odpovídající síle kouzla. Když neuspěje, bude po dobu jednoho čtvrtdne uvězněná v předmětu. Prodloužení účinku na celý den vyžaduje sílu kouzla 2 nebo vyšší, a pokud chceš, aby oběť zůstala v předmětu napořád – nebo na libovolně určenou dobu – potřebuješ sílu kouzla 3. Můžeš taky určit podmínku, jejíž splnění oběť vysvobodí. Tak či onak se oběť dá vysvobodit kouzlem ROZPTÝLENÍ MAGIE (strana 121). Dokud je oběť připoutaná, zůstává její tělo v bezvědomí a dá se zabít RÁNOU Z MILOSTI. Anebo se ho může zmocnit jiná zbloudilá duše."
    },
    {
      "id": "spojeni_masa",
      "name": "SPOJENÍ MASA",
      "rank": 3,
      "range": "vzdálenost paže",
      "duration": "permanentní",
      "ingredient": "jehla a nit, mog (podmínka)",
      "description": "Dokážeš spojit tělesné substance dvou různých bytostí v jednu, čímž vytvoříš novou kreaturu. Toto kouzlo vyžaduje 1 jednotku mogu za každou úroveň kouzla. Druhá přísada (jehla a nit) pouze zvyšuje sílu kouzla. Cíl či cíle musí uspět v hodu na EMPATII, aby se zcela nezbláznili; i při úspěchu však trvale ztrácejí 1 bod Empatie. Nový tvor může mít součet vlastností (atributů) nejvýše čtyřnásobek úrovně moci."
    },
    {
      "id": "krvavy_valecnik",
      "name": "KRVAVÝ VÁLEČNÍK",
      "rank": 3,
      "range": "střední",
      "duration": "jedna směna",
      "ingredient": "malba z krve na obličeji oběti",
      "description": "Ty nebo jeden cíl v krátkém dosahu získáte posílení. Po dobu trvání kouzla má cíl +1 k všem hodům souvisejícím s bojem za každou úroveň moci. Během této doby také hází plným počtem kostek pro příslušný atribut, i pokud je zraněný.."
    }
  ],
  "Proměna": [
    {
      "id": "kocici_packa",
      "name": "KOČIČÍ PACKA",
      "rank": 1,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "kočičí drápek",
      "description": "Umíš myšlenkami splynout s duchem kočky a díky tomu se pohybovat neslyšně. Kouzlo můžeš seslat místo házení na PLÍŽENÍ, čímž automaticky uspěješ. Každý stupeň síly kouzla se počítá jako jeden\t."
    },
    {
      "id": "ostrizi_zrak",
      "name": "OSTŘÍŽÍ ZRAK",
      "rank": 1,
      "range": "extrémní",
      "duration": "jedna směna (15 minut)",
      "ingredient": "ptačí pařát",
      "description": "Umíš myšlenkami splynout s duchem ostříže, a tím získat nadlidský zrak. Uvidíš cokoli až na EXTRÉMNÍ vzdálenost, od jednoho horizontu k druhému. Spatříš všechny podrobnosti a dokážeš rozpoznat jednotlivé osoby."
    },
    {
      "id": "rec_zvirat",
      "name": "ŘEČ ZVÍŘAT",
      "rank": 1,
      "range": "krátká",
      "duration": "jedna směna (15 minut)",
      "ingredient": "pařát nebo zub",
      "description": "Tohle kouzlo ti umožňuje mluvit se savci. Zvířeti můžeš položit tolik otázek, kolik je síla kouzla. Zvíře ti pak může povědět, co vidělo, slyšelo nebo ucítilo. Mysli ale na to, že zvířata nevnímají svět stejně jako lidé, takže v jejich odpovědích nebývá snadné se vyznat. Hlavní výhodou je, že nikdy nelžou."
    },
    {
      "id": "bdeni_prirody",
      "name": "BDĚNÍ PŘÍRODY",
      "rank": 1,
      "range": "dlouhá",
      "duration": "čtvrtden",
      "ingredient": "ochočené zvíře (nespotřebuje se)",
      "description": "Budeš upozorněn pokud by se někdo pokusil připlížit do oblasti. Funguje pokud jsou v okolí zvířata, která si vetřelce všimnou. Místo OSTRAŽITOSTI házíš na ZVÍŘATA s automatickým úspěchem proti PLÍŽENÍ. Můžeš definovat nějaké základní podmínky. Úroveň zdvojnásobí trvání nebo dosah."
    },
    {
      "id": "sprateleni_zvirete",
      "name": "SPŘÁTELENÍ ZVÍŘETE",
      "rank": 1,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "jídlo pro zvíře",
      "description": "Kouzlo funguje jako náhrada testu na ZVÍŘATA pro zvířata s maximální silou 2x síle kouzla"
    },
    {
      "id": "jeleni_trysk",
      "name": "JELENÍ TRYSK",
      "rank": 2,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "jelení nebo srnčí paroží Dovedeš na krátké vzdálenosti běhat rychlostí jelena. Kouzlo ti umožní BĚŽET (jednu akci) s pohyblivostí odpovídající síle kouzla plus 1. Seslání tohohle kouzla se samo o sobě nepočítá jako akce. Na přepálení nebo magické nehody si hoď ještě před samotným BĚHEM.",
      "description": ""
    },
    {
      "id": "kroceni_zvirat",
      "name": "KROCENÍ ZVÍŘAT",
      "rank": 2,
      "range": "krátká",
      "duration": "jedna směna (15 minut)",
      "ingredient": "dráp nebo zub",
      "description": "Dokážeš přimět divoká i ochočená zvířata, aby tě poslouchala. Zvíře může třeba přestat útočit, vystopovat nepřítele, doběhnout na určené místo a doručit zprávu, dovolit ti na sebe nasednout, a dokonce i napadnout tvé nepřátele. Nemůžeš ovládnout zvíře se silou vyšší, než je síla kouzla vynásobená dvěma. Pokud je zvíře rozrušené, vystrašené nebo bojuje, potřebuješ sílu kouzla o 1 stupeň vyšší. Jestli chceš zvíře přimět, aby jednalo v rozporu se svou přirozeností, třeba aby provádělo kejklířské kousky, musí být síla kouzla taky o 1 stupeň vyšší. V jednu chvíli dokážeš ovládat jenom jedno zvíře. Kouzlo se nedá použít proti nestvůrám."
    },
    {
      "id": "medvedi_tlapa",
      "name": "MEDVĚDÍ TLAPA",
      "rank": 2,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "medvědí dráp Umíš kosit nepřátele silou obrovitánského medvěda. Zásah je automatický a způsobí tolik zranění, kolik je síla kouzla. Útok se nedá ODRAZIT ani mu nejde UHNOUT, ale zbroj funguje jako obvykle.",
      "description": ""
    },
    {
      "id": "okridleny_pad",
      "name": "OKŘÍDLENÝ PÁD",
      "rank": 2,
      "range": "krátká",
      "duration": "směna, kouzelné slůvko*/reakce*",
      "ingredient": "plášť cíle",
      "description": "Oblečení cíle se natáhne a vytvoří křídla, která zpomalí pád a znegují zranění. Za další BV funguje jako kouzelné slůvko/ za další reakce."
    },
    {
      "id": "probuzeni_pudu",
      "name": "PROBUZENÍ PUDŮ",
      "rank": 3,
      "range": "dlouhá",
      "duration": "jedna směna (15 minut)",
      "ingredient": "dráp nebo zub",
      "description": "Umíš v myslích ostatních probouzet prosté zvířecí pudy. Síla kouzla musí být stejná nebo vyšší než aktuální bystrost oběti. Tímhle způsobem můžeš v někom probudit třeba zuřivost divočáka, lenost kočky nebo plachost vrabčáka. Jak přesně oběť zareaguje, to je na Vypravěči. Jestli chceš obecnějším způsobem proměnit náladu celé skupiny, menší dav bude vyžadovat sílu kouzla 2, větší dav 3 a celá vesnice 4."
    },
    {
      "id": "zvireci_podoba",
      "name": "ZVÍŘECÍ PODOBA",
      "rank": 3,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "pařát nebo zub",
      "description": "Umíš proměnit tvar celého svého těla a vzít na sebe podobu zvířete. Vyber si zvíře z tabulky na straně 126 Příručky Vypravěče. Nemůžeš si vybrat zvíře se silou vyšší, než je dvojnásobek síly kouzla. Dokud na sobě budeš mít zvířecí podobu, máš sílu a obratnost jako vybrané zvíře. Nevýhodou je, že ztrácíš schopnost mluvit a navíc i část své schopnosti uvažovat – projevuje se to tak, že ve zvířecí podobě ti bystrost a osobnost klesají o 1. Samozřejmě můžeš používat přirozené útoky zvířete. Až se budeš chtít proměnit zpátky do běžné podoby, musíš kouzlo seslat znova."
    },
    {
      "id": "privolani_zvirat",
      "name": "PŘIVOLÁNÍ ZVÍŘAT",
      "rank": 3,
      "range": "dlouhá",
      "duration": "směna",
      "ingredient": "roh nebo píšťalka",
      "description": "Přivoláš všechna zvířata z hexu do tvé lokace, můžeš specifikovat typ zvířat, které tě mají poslechnout. Nejbližší zvířata s celkovou silou 4x síla kouzla, přijdou cca za směnu."
    },
    {
      "id": "netopyri_drap",
      "name": "NETOPÝŘÍ DRÁP",
      "rank": 3,
      "range": "krátká",
      "duration": "směna",
      "ingredient": "dráp netopýra",
      "description": "Můžeš bez omezení lézt po zdech/stropu pokud tě materiál dokáže udržet a neklouže. Trvá jednu směnu za úroveň kouzla."
    },
    {
      "id": "vlci_nos",
      "name": "VLČÍ NOS",
      "rank": 3,
      "range": "osobní",
      "duration": "den",
      "ingredient": "vlčí packa",
      "description": "Můžeš stopovat pach vybraný cíl jeden den za úroveň kouzla. Ke stopování potřebuješ znát pach nebo jeho stopu.."
    }
  ],
  "Jasnovidnost": [
    {
      "id": "carovne_svetlo",
      "name": "ČAROVNÉ SVĚTLO",
      "rank": 1,
      "range": "krátká",
      "duration": "jedna směna (za úroveň)",
      "ingredient": "proutek (je možné ho použít opakovaně)",
      "description": "Přivoláš jasné světlo, které zažene všechny stíny v KRÁTKÉ vzdálenosti, tedy ve stejné zóně jako ty."
    },
    {
      "id": "prave_videni",
      "name": "PRAVÉ VIDĚNÍ",
      "rank": 1,
      "range": "extrémní",
      "duration": "jedno kolo (za úroveň)",
      "ingredient": "zvětšovací sklo",
      "description": "Tvůj zrak nadpřirozeně zbystří a ty uvidíš na EXTRÉMNÍ vzdálenost takové podrobnosti, jako by se daný předmět nebo člověk nacházel hned vedle tebe. PRAVÉ VIDĚNÍ taky umožňuje vidět ve tmě, přes kouř nebo v mlze a automaticky prohlédne veškeré převleky nebo tvarozměnu. Musíš však mít ničím nezakrytý výhled."
    },
    {
      "id": "slova_ve_vetru",
      "name": "SLOVA VE VĚTRU",
      "rank": 1,
      "range": "extrémní",
      "duration": "jedna směna (za úroveň)",
      "ingredient": "trychtýř nebo mořská lastura",
      "description": "Dokážeš si magicky zesílit sluch tak, že slyšíš zvuky na EXTRÉMNÍ vzdálenost stejně jasně, jako kdyby zaznívaly hned vedle tebe. Místo, ke kterému chceš svůj sluch zaostřit, ale musíš vidět."
    },
    {
      "id": "presny_uder",
      "name": "PŘESNÝ ÚDER",
      "rank": 1,
      "range": "osobní",
      "duration": "jedno kolo",
      "ingredient": "oko",
      "description": "Můžeš použít toto kouzlo aby si předpověděl svůj další útok. K dalšímu útoku dostaneš +3 za úroveň kouzla."
    },
    {
      "id": "vyvolani_vzpominek",
      "name": "VYVOLÁNÍ VZPOMÍNEK",
      "rank": 1,
      "range": "paže",
      "duration": "jedna směna",
      "ingredient": "bylinkový čaj",
      "description": "Toto kouzlo umožní tobě nebo někomu dalšímu vybavit si perfektní vzpomínky z předchozího dne. Další úroveň na zvýší vzpomínky týden, 3. úroveň na měsíc, 4. rok. Po skončení kouzla se vzpomínky vytratí, je možné však je zapsat/sdělit."
    },
    {
      "id": "daleky_zrak",
      "name": "DALEKÝ ZRAK",
      "rank": 2,
      "range": "různá",
      "duration": "jedna směna (15 minut)",
      "ingredient": "mapa",
      "description": "Vnitřním zrakem se dokážeš vznášet nad dalekými krajinami, překonávat moře i kontinenty, hory i údolí a sledovat, co se tam v tuhle chvíli děje. DALEKÝ ZRAK ti nepomůže najít neznámé místo – můžeš se podívat jen na místa, jejichž polohu už znáš. Síla kouzla 1 ti umožní prohlédnout si místo až na DLOUHOU vzdálenost. Síla kouzla 2 dosáhne všude v rámci hexu na mapě, ve kterém se zrovna nacházíš. Cokoli vzdálenějšího vyžaduje sílu kouzla 3. Jestli chceš nahlédnout na místo, které ještě nemáš navštívené, zvyšuje se potřebná síla kouzla o 2. Vidiny bývají přerývané a mnohoznačné – Vypravěč rozhodne, co přesně spatříš."
    },
    {
      "id": "prava_cesta",
      "name": "PRAVÁ CESTA",
      "rank": 2,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "váhy (dají se používat opakovaně)",
      "description": "Když stojíš před obtížným rozhodnutím, tohle kouzlo tě dokáže navést na správnou cestu. Po jeho seslání ti Vypravěč musí prozradit, které rozhodnutí nebo volbu považuje za nejmoudřejší."
    },
    {
      "id": "vyjevy_z_minulosti",
      "name": "VÝJEVY Z MINULOSTI",
      "rank": 2,
      "range": "střední",
      "duration": "jedna směna (15 minut)",
      "ingredient": "předmět z dané doby",
      "description": "Vidíš události, které se na místě, kde právě stojíš, odehrály v minulosti, i když si je dnes třeba nepamatuje ani živáček. Síla kouzla 1 ti umožní nahlédnout jeden den zpátky v čase, síla kouzla 2 umožňuje nahlédnout až rok do minulosti a síla kouzla 3 přináší vidiny z doby až stovky let nazpět. Výjevy bývají přerývané a mnohoznačné – Vypravěč rozhodne, co přesně spatříš."
    },
    {
      "id": "pravdomluvnost",
      "name": "PRAVDOMLUVNOST",
      "rank": 2,
      "range": "paže",
      "duration": "jedna směna (15 minut)",
      "ingredient": "Halucinogenní jed",
      "description": "Můžeš přinutit cíl mluvit neschopný říct lež. Oběť se stále může vyhýbat nebo mlčet. Kouzlu lze odolat skrytým hodem na empatii s postihem -2 za úroveň kouzla."
    },
    {
      "id": "predzvest",
      "name": "PŘEDZVĚST",
      "rank": 2,
      "range": "paže",
      "duration": "permanentní",
      "ingredient": "Vyrobený předmět zabere 2 dny na výrobu",
      "description": "Když vytvoříte předmět, můžeš ho začarovat, aby se rozbil ve specifický moment (např. při příchodu armády do vesnice). Pro podmínku můžeš použít maximálně 10 slov, další úroveň umožní předmětu dělat něco jiného než se pouze rozpadnout. Lze utratit 1 úroveň, aby byl předmět znovu použitelný, například, aby gong vydal zvuk a šel znovu očarovat bez nutnosti vytvářet předmět znovu."
    },
    {
      "id": "intuice",
      "name": "INTUICE",
      "rank": 3,
      "range": "osobní",
      "duration": "okamžité",
      "ingredient": "související předmět",
      "description": "Můžeš položit stručnou otázku typu ano/ne týkající se čehokoliv ve světě. Vypravěč ti musí odpovědět „ano“, „ne“ nebo „možná“. Nesmí lhát. Vypravěč smí odpovědět „možná“, i když zná odpověď, ale tuší, že by její prozrazení narušilo běh hry. Počítej taky s tím, že odpověď „ano“ i „ne“ není objektivní pravdou, ale záleží na tom, kdo přesně se ptá. Jeho osobní přesvědčení a hodnoty mohou způsobit, že bude považovat za lež něco, co by jiní pokládali za pravdu."
    },
    {
      "id": "telepatie",
      "name": "TELEPATIE",
      "rank": 3,
      "range": "krátká",
      "duration": "jedna směna (15 minut)",
      "ingredient": "předmět patřící oběti",
      "description": "Po dobu pár minut dokážeš číst něčí momentální myšlenky. Hlubší ponoření do vzpomínek je náročnější a vyžaduje sílu kouzla 2, nebo i víc. Záleží na tom, jak je daná vzpomínka čerstvá. Můžeš také přenášet své myšlenky přímo do hlavy někoho jiného. Pokud se s cílem znáš dobře, dosáhne kouzlo až na DLOUHOU vzdálenost. Anebo můžeš posílat bolestivé a útrpné myšlenky, a tím oběti způsobit tolik bodů zranění bystrosti nebo osobnosti, kolik je síla kouzla. Na nestvůry kouzlo neúčinkuje."
    },
    {
      "id": "vesteni",
      "name": "VĚŠTĚNÍ",
      "rank": 3,
      "range": "krátká",
      "duration": "jedna směna (15 minut)",
      "ingredient": "křišťálová koule nebo rybí vnitřnosti",
      "description": "Po provedení věštecké seance dovedeš nahlédnout do budoucnosti. Můžeš se Vypravěče zeptat na něco o sobě nebo o někom jiném, kdo se seance účastní. Vypravěč ti odpoví, jak nejlépe dokáže. Odpověď musí být stručná a často bývá mnohoznačná a nejasná. Může mít i podobu šťastného znamení nebo naopak tísnivé předzvěsti velkého neštěstí."
    },
    {
      "id": "pruvodce",
      "name": "PRŮVODCE",
      "rank": 3,
      "range": "dlouhá",
      "duration": "jedna směna (15 minut)",
      "ingredient": "x",
      "description": "Kouzlo umožní dát mentální pomoc spojencům. Dle úrovně kouzla přidáš +1 k hodu na vybranou dovednost při seslání kouzla po dobu trvání. Funguje jako náhrada pomáhání při hodu. O bonus přijdou pokud ztratíš vědomí."
    },
    {
      "id": "porozumeni_jazykum",
      "name": "POROZUMĚNÍ JAZYKŮM",
      "rank": 3,
      "range": "osobní",
      "duration": "čtvrtden (za úroveň)",
      "ingredient": "jazyk",
      "description": "Dokážeš rozumět a mluvit všemi jazyky po dobu čtvrtdne za úroveň kouzla."
    }
  ],
  "Kámenpěvec": [
    {
      "id": "hlas_hory",
      "name": "HLAS HORY",
      "rank": 1,
      "range": "různá",
      "duration": "jeden čtvrtden",
      "ingredient": "flétna",
      "description": "Umíš mluvit s horou a naslouchat jejím slovům. Hora ti může odpovídat na jednoduché otázky o tom, co se na tomhle místě stalo v minulosti (události z uplynulého dne vyžadují sílu kouzla 1, z uplynulého roku sílu kouzla 2 a z ještě hlubší minulosti sílu kouzla 3) nebo co se tu děje právě teď (STŘEDNÍ vzdálenost vyžaduje sílu kouzla 1, DLOUHÁ vzdálenost sílu kouzla 2, všechno v rámci stejného hexu mapy sílu kouzla 3). Hora bohužel mluví značně pomalu, a proto tohle kouzlo funguje jen jako rituál. Kouzlo se dá použít jen v terénu typu HORy nebo uvnitř JESKYNĚ."
    },
    {
      "id": "nohy_z_kamene",
      "name": "NOHY Z KAMENE",
      "rank": 1,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "roh",
      "description": "Máš tak pronikavý hlas, že omračuje všechny okolo tebe. Tvůj zpěv způsobuje 1 bod zranění obratnosti za každý stupeň síly kouzla. Zranění můžeš libovolně rozdělit mezi jakýkoli počet protivníků. Oběti můžou účinku vzdorovat hodem na EMPATII – každý hozený      vyruší 1 bod zranění. Proti nestvůrám tenhle účinek nefunguje."
    },
    {
      "id": "prach_z_hlubin",
      "name": "PRACH Z HLUBIN",
      "rank": 1,
      "range": "krátká",
      "duration": "jedno kolo",
      "ingredient": "hrst písku",
      "description": "Kouzlo zdvihne ze země hustý oblak kamenného prachu a zaplní jím celou zónu, ve které se nacházíš. Prach brání v celé zóně ve výhledu a umožňuje ti utéct z boje (strana 89) bez házení na MRŠTNOST. Kouzlo se dá použít jen v terénu typu HORY nebo uvnitř JESKYNĚ."
    },
    {
      "id": "kamenna_boure",
      "name": "KAMENNÁ BOUŘE",
      "rank": 2,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "oblázky",
      "description": "Tvá píseň dovede rozpohybovat kameny takovou rychlostí, že je můžeš vrhat po nepřátelích. Způsobuje tolik bodů zranění síly, kolik je síla kouzla. Zbroj funguje jako obvykle. Kouzlo se dá použít jenom na místech, kde je dost uvolněného kamení na házení."
    },
    {
      "id": "tvarovani_kamene",
      "name": "TVAROVÁNÍ KAMENE",
      "rank": 2,
      "range": "různá",
      "duration": "okamžité",
      "ingredient": "loutna",
      "description": "Písní dokážeš tvarovat kámen podle svých představ. Kouzlo ti umožňuje vztyčit zeď, postavit most nebo ze země přivolat schodiště. Každá taková konstrukce bude velmi hrubá. Síla kouzla 1 vytvoří konstrukci v zóně, ve které se nacházíš. Za každý další stupeň síly kouzla můžeš konstrukci protáhnout o jednu zónu dál. Například při síle kouzla 4 můžeš vytvořit konstrukci táhnoucí se přes čtyři zóny."
    },
    {
      "id": "zvetrani",
      "name": "ZVĚTRÁNÍ",
      "rank": 2,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "harfa",
      "description": "Tvá píseň způsobuje, že kámen zvětrává a stěny nebo opevnění v KRÁTKÉ vzdálenosti se drolí a rozpadají. Potřebná síla kouzla se odvíjí od tloušťky překážky – každého půl metru vyžaduje jeden stupeň síly kouzla."
    },
    {
      "id": "privolani_golema",
      "name": "PŘIVOLÁNÍ GOLEMA",
      "rank": 3,
      "range": "krátká",
      "duration": "jeden čtvrtden",
      "ingredient": "kamenná figurka",
      "description": "Písní umíš z kamene vyvolat bytost, která ti bude sloužit. Takový golem poslouchá po dobu jednoho čtvrtdne všechny tvé příkazy a potom se změní v nehybnou sochu. Golem umí vykonávat jen jednoduché činnosti a musíš ho mít neustále v dohledu. Golemovy statistiky závisejí na síle kouzla. Síla kouzla 1 vytvoří pomenšího tvora se silou 2, obratností 1 a kamennou kůží s třídou zbroje 3. Každý další stupeň síly kouzla zvyšuje sílu a třídu zbroje o 1. Případně můžeš vyšší sílu kouzla využít ke stvoření více golemů najednou – každý další stupeň síly kouzla vytvoří jednoho golema navíc. Například při síle kouzla 4 můžeš vytvořit až tři golemy se silou 3 a třídou zbroje 4. Kouzlo se dá použít jen v terénu typu HORY nebo v JESKYNI."
    },
    {
      "id": "zemetreseni",
      "name": "ZEMĚTŘESENÍ",
      "rank": 3,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "bubínek",
      "description": "Tvá píseň v sobě nese takovou sílu, že se kolem tebe otřásá a trhá samotná zem. Tímhle kouzlem dovedeš bořit zdi a opevnění nebo zraňovat oběti. Způsobí tolik zranění síly, kolik je síla kouzla."
    },
    {
      "id": "zelezna_pisen",
      "name": "ŽELEZNÁ PÍSEŇ",
      "rank": 3,
      "range": "různá",
      "duration": "okamžité",
      "ingredient": "kladivo",
      "description": "Tvůj hlas má moc nejen nad kamenem, ale i nad kovy vytěženými z útrob hory. Tímhle rituálem můžeš z kovu vytvářet zbraně a další předměty, a navíc třeba ohýbat mříže cel nebo rozlamovat pouta. Můžeš jím vytvořit libovolnou kovovou zbraň z tabulky zbraní (kapitola 5 – Boj a zranění) s bonusem vybavení odpovídajícím síle kouzla, až do maxima 3. Všechny ostatní statistiky zbraně se řídí tím, co je uvedeno v tabulce. Při používání ŽELEZNÉ PÍSNĚ musíš mít po ruce potřebné suroviny – stejné, jako jsou potřeba k vytvoření předmětu pomocí dovednosti ŘEMESLA."
    }
  ],
  "Symbolismus": [
    {
      "id": "hruza",
      "name": "HRŮZA",
      "rank": 1,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "",
      "description": "Symbol probouzí v oběti hluboce zakořeněné strachy. Oběť utrpí tolik bodů zranění bystrosti, kolik je síla kouzla. Na nestvůry nemá kouzlo žádný účinek."
    },
    {
      "id": "ochromeni",
      "name": "OCHROMENÍ",
      "rank": 1,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "",
      "description": "Hypnotizující síla symbolu zbavuje oběť schopnosti jednat. Při síle kouzla 1 ztratí oběť svou krátkou akci v tomhle kole (nebo v příštím, pokud už ji v tomhle kole využila). Při síle kouzla 2 ztrácí dlouhou akci. Při síle kouzla 3 ztrácí obě akce a při síle kouzla 4 ztrácí i veškeré bonusové akce z talentů. Na nestvůry nemá kouzlo žádný účinek."
    },
    {
      "id": "vabeni",
      "name": "VÁBENÍ",
      "rank": 1,
      "range": "střední",
      "duration": "okamžité",
      "ingredient": "",
      "description": "Symbol vábí oběť k sobě. Oběť si musí hodit na EMPATII s negativní úpravou odpovídající síle kouzla. Když neuspěje, musí BĚŽET až na DÉLKU PAŽE k symbolu a utratit za to všechny své běžné akce (bonusové akce z talentů může používat jako obvykle). Až se oběť dostane k symbolu nebo pokud se symbol přesune, kouzlo přestává působit. Na nestvůry nemá žádný účinek."
    },
    {
      "id": "iluze",
      "name": "ILUZE",
      "rank": 2,
      "range": "střední",
      "duration": "jedna směna (15 minut)",
      "ingredient": "",
      "description": "Způsobíš, že oběť uvidí něco, co ve skutečnosti neexistuje, případně před ní skryješ něco, co by jinak spatřila. Drobný předmět vyžaduje sílu kouzla 1, objekt o velikosti člověka vyžaduje sílu kouzla 2 a iluze o velikosti domu vyžaduje sílu kouzla 3. Kouzlo ovlivní jen jednu osobu. Oběť může iluzi prohlédnout úspěšným hodem na EMPATII, ale k hodu má zápornou úpravu odpovídající síle kouzla. Kouzlo nemá žádný účinek na nestvůry."
    },
    {
      "id": "oslepeni",
      "name": "OSLEPENÍ",
      "rank": 2,
      "range": "střední",
      "duration": "jeden čtvrtden",
      "ingredient": "",
      "description": "Oběť si musí hodit na EMPATII se zápornou úpravou odpovídající síle kouzla. Když neuspěje, symbol ji oslepí. Slepota se projevuje stejně, jako kdyby se postava nacházela v naprosté tmě (strana 112). Na protivníky bez bystrosti, například zvířata, účinkuje kouzlo automaticky, na nestvůry však nemá žádný účinek."
    },
    {
      "id": "roztrzitost",
      "name": "ROZTRŽITOST",
      "rank": 2,
      "range": "střední",
      "duration": "jedno kolo",
      "ingredient": "",
      "description": "Dokážeš nehráčskou postavu donutit, aby neprovedla akci, kterou zamýšlela. Musí se jednat o drobný čin – něco, na co se dá při nepozornosti zapomenout. Například strážný může nechat hráčskou postavu projít, aniž by si ověřil její totožnost, nebo může někdo zapomenout klíč na stole. Kouzlo se nedá použít v boji."
    },
    {
      "id": "carovna_runa",
      "name": "ČAROVNÁ RUNA",
      "rank": 3,
      "range": "délka paže",
      "duration": "okamžité",
      "ingredient": "",
      "description": "Dokážeš do symbolu vložit čarovnou moc. Symbol je nutné nakreslit nebo vyrýt do předmětu. Potom se do něj uloží tolik bodů vůle, kolik je síla kouzla. Pomocí symbolu můžeš později sesílat kouzla, dokud všechny uložené body vůle nevyčerpáš. Při používání tohohle kouzla není nutné magii PŘIPOUTAT. Pokud se k tvým ČAROVNÝM RUNÁM dostane někdo jiný, kdo ovládá umění symbolů, může je používat – radši si je tedy nechej pro sebe."
    },
    {
      "id": "loutka",
      "name": "LOUTKA",
      "rank": 3,
      "range": "krátká",
      "duration": "jedno kolo",
      "ingredient": "",
      "description": "Přebíráš naprostou kontrolu nad jednáním oběti. Oběť si musí hodit na EMPATII se zápornou úpravou odpovídající síle kouzla. Když neuspěje, ztrácí vládu nad svým tělem a stává se tvojí loutkou. Účinek trvá jen do chvíle, než oběť znova přijde na řadu v iniciativě, a vztahuje se na jednu krátkou akci a jednu dlouhou akci. Oběť nesmí provádět reakce ani bonusové akce z talentů, dokud postava, která LOUTKU zakouzlila, neprovede své akce. Nemá účinek na nestvůry."
    },
    {
      "id": "portal",
      "name": "PORTÁL",
      "rank": 3,
      "range": "krátká",
      "duration": "jeden čtvrtden za každý stupeň síly kouzla",
      "ingredient": "",
      "description": "Tenhle mocný rituál vyrve díru do závoje, který odděluje světy, a otevře mezi nimi cestu. Jedná se o mimořádně riskantní počin, protože na druhé straně můžeš narazit na všelijaké démony nebo jiné zlovolné tvory. Možná je dokážeš využít ke svým cílům, ale stejně tak dobře se oni můžou pokusit využít tebe. Anebo tě můžou sežrat. V téhle situaci se může hodit kouzlo PŘIPOUTÁNÍ DÉMONA (patřící do krvavé magie). O dalších podrobnostech rozhodne Vypravěč. Tímhle kouzlem můžeš taky vytvořit nový portál, když budeš na druhé straně. Může vést na libovolné místo v Zapovězených zemích – výběr je na tobě."
    }
  ],
  "Led": [
    {
      "id": "mraziva_vlna",
      "name": "Mrazivá vlna",
      "rank": 1,
      "range": "krátká",
      "duration": "jedna směna (15 minut)",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Přivoláš extrémní chlad v BLÍZKÉ vzdálenosti (stejná zóna). Každý v zóně si musí hodit na VÝDRŽ, jinak získá stav CHLAD. Veškerá voda v dosahu okamžitě zamrzne."
    },
    {
      "id": "chodec_mrazem",
      "name": "Chodec mrazem",
      "rank": 1,
      "range": "osobní",
      "duration": "čtvrtden",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Stáváš se imunním vůči všem účinkům chladu. Za každou další úroveň síly můžeš prodloužit dobu trvání o čtvrtden nebo rozšířit účinek na další osobu v BLÍZKÉ vzdálenosti."
    },
    {
      "id": "ledovy_stit",
      "name": "Ledový štít",
      "rank": 1,
      "range": "osobní",
      "duration": "jedna směna (15 minut)",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Vytvoříš štít z ledu, který funguje jako normální malý štít s artefaktovou kostkou k8. Pokud zvýšíš úroveň síly o jedna, můžeš vytvořit velký štít nebo zvýšit artefaktovou kostku na k10. Štít může používat pouze ty."
    },
    {
      "id": "ledove_srdce",
      "name": "Ledové srdce",
      "rank": 2,
      "range": "blízká",
      "duration": "okamžité",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Proměníš srdce oběti v led. Oběť utrpí 1 bod zranění bystrosti za každou úroveň síly a získá stav CHLAD. Zbroj nemá žádný účinek."
    },
    {
      "id": "snezna_jeskyne",
      "name": "Sněžná jeskyně",
      "rank": 2,
      "range": "blízká",
      "duration": "čtvrtden",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Vytvoříš sněžnou jeskyni, která poskytne přístřeší až pro pět osob na čtvrtden. Jeskyně dává +1 za každou úroveň síly k hodu na TÁBOŘENÍ. Také poskytuje dostatečnou ochranu proti chladu při SPANÍ nebo ODPOČINKU, stejně jako proti vánicím a jehlovým bouřím."
    },
    {
      "id": "ledovy_mec",
      "name": "Ledový meč",
      "rank": 2,
      "range": "délka paže",
      "duration": "jedna směna (15 minut)",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Kouzlo přivolá meč z ledu, který funguje jako normální krátký meč s artefaktovou kostkou k8. Zvýšením úrovně síly o jedna můžeš přivolat dlouhý meč a o dva obouruční meč. Případně můžeš zvýšením úrovně síly o jedna zlepšit artefaktovou kostku na k10."
    },
    {
      "id": "vanice",
      "name": "Vánice",
      "rank": 3,
      "range": "blízká",
      "duration": "jedna směna (15 minut) za každou úroveň síly",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Vytvoříš vířící vánici, přičemž ty jsi v oku bouře. Můžeš rozdělit body zranění obratnosti rovné úrovni síly mezi libovolné oběti v BLÍZKÉ vzdálenosti. Každý, kdo utrpí zranění, získá stav CHLAD a musí si hodit na SVALY, aby zůstal na nohou."
    },
    {
      "id": "salva_rampouchu",
      "name": "Salva rampouchů",
      "rank": 3,
      "range": "krátká",
      "duration": "okamžité",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Přivoláš mrak rampouchů a mrštíš ho na cíl v KRÁTKÉ vzdálenosti. Útok způsobí zranění rovné úrovni síly (bodná rána) a cíl získá stav CHLAD."
    },
    {
      "id": "ledovy_dech",
      "name": "Ledový dech",
      "rank": 3,
      "range": "blízká",
      "duration": "okamžité",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Vydechneš ledově studený oblak sněhu na cíl v BLÍZKÉ vzdálenosti. Oběť si musí okamžitě hodit protihod SVALŮ proti dvojnásobku úrovně síly (hod není akce), jinak je zmrazena na místě na jednu směnu (15 minut). Pokud hod selže, oběť se nemůže vůbec hýbat a získá stav CHLAD."
    },
    {
      "id": "zimni_stisk",
      "name": "Zimní stisk",
      "rank": 1,
      "range": "délka paže",
      "duration": "čtvrtden",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Tvůj cíl může chodit po ledu a sypkém sněhu, jako by to byl pevný povrch, a nemá žádný další postih při šplhání po holém ledu, pokud materiál unese jeho váhu. Každá úroveň síly může přidat jeden cíl nebo zdvojnásobit dobu trvání."
    },
    {
      "id": "ledove_sipy",
      "name": "Ledové šípy",
      "rank": 1,
      "range": "délka paže",
      "duration": "speciální",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Vytvoříš dávku kompaktních ledových šípů nebo šipek. Počítají se jako kostka zdrojů šípů s dřevěným hrotem, s tím, že šípy vydrží neomezeně dlouho jen v teplotách pod nulou. Při jarních/podzimních teplotách se rozpustí za čtvrtden, při letních teplotách za směnu (15 minut). Další úrovně síly mohou vytvořit další kostky zdrojů nebo šípy zpevnit tak, aby se počítaly jako šípy s kovovým hrotem."
    },
    {
      "id": "zona_chladu",
      "name": "Zóna chladu",
      "rank": 2,
      "range": "dlouhá",
      "duration": "čtvrtden",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Teplota v dosahu klesne o jeden stupeň za každou úroveň síly. Z letní na jarní/podzimní, na zimní a ještě chladnější. Při zimních teplotách se na všech površích začne tvořit námraza, pokud není vzduch mimořádně suchý. Při dalším snížení teploty veškerá stojící voda zamrzne během jedné směny (15 minut)."
    },
    {
      "id": "srazeni_vody",
      "name": "Srážení vody",
      "rank": 2,
      "range": "blízká",
      "duration": "okamžité",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Manipulací teploty dokážeš srazit vodní páru ve vzduchu a naplnit tak blízké nádoby – obnovíš 1 kostku zdrojů vody za každou úroveň síly. Kouzlo vyžaduje dvojnásobek úrovně síly v pouštní oblasti, kde normálně nelze hledat vodu."
    },
    {
      "id": "zimni_volani",
      "name": "Zimní volání",
      "rank": 3,
      "range": "aktuální hex",
      "duration": "jeden den",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Rituál. Prudce snížíš teplotu hexu, ve kterém se nacházíš. Letní, jarní a podzimní teploty klesnou na zimní během rituálu a pak trvají 24 hodin. Každý pokles teploty stojí 1 úroveň síly. Když rituál skončí, získáš počet bodů vůle rovný dvojnásobku teplotního rozdílu. Tento rituál nemůže nikdy snížit teplotu pod nulu."
    },
    {
      "id": "ledove_brneni",
      "name": "Ledové brnění",
      "rank": 3,
      "range": "osobní",
      "duration": "jedna směna (15 minut)",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Kouzlo zesiluje tvou zbroj zpevněnou vrstvou ledu. Zbroj získá artefaktovou kostku k8 a její hodnota zbroje se zvýší na minimum 6 po dobu trvání kouzla. Zvýšením úrovně síly o jedna můžeš zlepšit artefaktovou kostku na k10."
    },
    {
      "id": "tvarovani_ledu",
      "name": "Tvarování ledu",
      "rank": 4,
      "range": "osobní",
      "duration": "jedna směna za každou úroveň síly",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Dokážeš tvarovat sníh a led rukama. Tato schopnost je praktická pro rychlou výrobu ledových soch, ale především ti umožňuje prorazit tunel skrz led rychlostí chůze. Schopnost tvarovat sníh a led trvá 1 směnu (15 minut) za každou úroveň síly."
    },
    {
      "id": "ledova_zed",
      "name": "Ledová zeď",
      "rank": 4,
      "range": "krátká",
      "duration": "permanentní",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Ze země v cílové oblasti vyroste zeď z ledu. Všechny bytosti, které jí stojí v cestě, si mohou vybrat, na které straně zůstanou, ale spadnou na zem, pokud neuspějí v hodu na MRŠTNOST s postihem rovným úrovni síly. Nestvůry na zem nespadnou. Zeď zabírá prostor 3 metry na výšku a 10 metrů na délku a může být mírně zakřivená, ale bez ostrých rohů. Část ledu se prolomí tak, aby se prolamovač mohl projít, pokud utrpí 2 body zranění za každou úroveň síly při hodnotě zbroje 5. Úrovně síly mohou zdvojnásobit rozměr zdi. Účinek zdi je permanentní, ale zeď poškozuje vyšší teplota. Extrémní teplota: 1/minutu, letní teplota: 1/směnu, jarní/podzimní teplota: 1/čtvrtden."
    },
    {
      "id": "krystalizace",
      "name": "Krystalizace",
      "rank": 4,
      "range": "délka paže",
      "duration": "permanentní",
      "ingredient": "kus ledu nebo hrst sněhu",
      "description": "Lehký předmět z ledu, kterého se dotkneš, přestane být ovlivněn teplotou a přestane být studený na dotek – vypadá spíše jako křišťál. Předmět používá stejné parametry jako předmět z obsidiánu (sopečného skla). Úrovně síly mohou zpevnit těžší předměty: 2 pro předmět běžné váhy a 3 pro těžký předmět. Pokud se předmět rozbije, změní se zpět na obyčejný led."
    }
  ],
  "Elementalismus": []
};
