/* Rodové talenty podle Průvodce hráče (str. 62–63). Každý rod má jeden talent
   s jediným stupněm; id zůstávají kvůli už uloženým postavám. */
export const KIN_TALENTS = [
    {
        id: 'prizpusobivy',
        name: 'Přizpůsobivý',
        kin: 'Člověk',
        ranks: [{ rank: 1, description: 'Když před hodem na jakoukoli dovednost utratíš bod vůle, můžeš si místo ní hodit na kteroukoli jinou dovednost a dosáhnout stejného cíle. Stačí vysvětlit, jak druhou dovednost používáš.' }]
    },
    {
        id: 'vnitrni_klid',
        name: 'Vnitřní klid',
        kin: 'Elf',
        ranks: [{ rank: 1, description: 'Utracením bodu vůle si přivodíš hlubokou meditaci na celý čtvrtden (nikdo tě nesmí rušit). Poté se ti vyléčí všechna zranění, i kritická, kromě ztracených končetin.' }]
    },
    {
        id: 'houzevnatost',
        name: 'Hlava žulová',
        kin: 'Trpaslík',
        ranks: [{ rank: 1, description: 'Utrácením bodů vůle můžeš zkusit štěstí i vícekrát za sebou. Každé zkoušení štěstí kromě prvního stojí jeden bod vůle.' }]
    },
    {
        id: 'magicka_sila',
        name: 'Duševní síla',
        kin: 'Půlelf',
        ranks: [{ rank: 1, description: 'Pokaždé když utracením bodů vůle aktivuješ talent nebo sešleš kouzlo, počítá se první bod vůle za dva (dva utracené body jako tři atd.). Zároveň stoupá riziko magických nehod.' }]
    },
    {
        id: 'tezko_polapitelny',
        name: 'Nepolapitelný',
        kin: 'Půlčík',
        ranks: [{ rank: 1, description: 'V boji se můžeš utracením bodu vůle vyhnout fyzickému útoku. Každý utracený bod vyruší jeden útočníkův úspěch.' }]
    },
    {
        id: 'divoky_lov',
        name: 'Instinkt lovce',
        kin: 'Vlken',
        ranks: [{ rank: 1, description: 'Utracením bodů vůle označíš osobu nebo bytost za kořist (musíš ji vidět nebo cítit její stopu). Počet bodů určuje, kolik dní ji dokážeš stopovat; v boji máš proti ní +1 k útokům za každý bod.' }]
    },
    {
        id: 'nesmiritelny',
        name: 'Nezlomný',
        kin: 'Ork',
        ranks: [{ rank: 1, description: 'Když tě vyřadí jakýkoli typ zranění, můžeš utratit bod vůle a okamžitě se postavit. Za každý bod si obnovíš 1 bod ve vlastnosti, která klesla na nulu. Na kritická zranění nemá vliv.' }]
    },
    {
        id: 'nocni_tvor',
        name: 'Noční tvor',
        kin: 'Skřet',
        ranks: [{ rank: 1, description: 'Vidíš ve tmě, takže tě tma nijak neomezuje. Při plížení ve tmě nebo šeru můžeš utrácet body vůle – každý se počítá jako další úspěch, i dodatečně po hodu.' }]
    }
];

export const KIN_TALENT_BY_KIN = Object.fromEntries(KIN_TALENTS.map(talent => [talent.kin, talent]));
