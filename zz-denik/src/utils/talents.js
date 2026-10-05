import { effectiveWillpower, hasPsychicPower } from './kin';

// Půlelf (Duševní síla) – rozpoznání rodu i talentu sdílí utils/kin.
export const isHalfElf = hasPsychicPower;

// Průvodce hráče: první utracený bod vůle se půlelfovi počítá za dva (2 za tři…).
export const getEffectiveWillpower = (char, spent) => {
    const safeSpent = Math.max(0, Number(spent) || 0);
    return effectiveWillpower(safeSpent, hasPsychicPower(char));
};

const normalizeTalentId = (talentId) => String(talentId || '')
    .toLocaleLowerCase('cs-CZ')
    .replace(/[-\s]+/g, '_');

export const getTalentRank = (char, talentId) => {
    const normalizedId = normalizeTalentId(talentId);
    const talent = (Array.isArray(char?.talents) ? char.talents : [])
        .find(item => normalizeTalentId(item?.id) === normalizedId);
    return Math.max(0, Number(talent?.rank) || 0);
};

const TALENT_ACTIONS = {
    travic: [
        {
            id: 'poisoner-craft',
            minRank: 1,
            type: 'poison-roll',
            title: 'Vyrobit jed',
            description: 'Zvol typ jedu a vyrob ho hodem na Řemesla nebo Léčení. První úspěch jed vyrobí, další úspěchy zvýší jeho účinnost.',
            requiresWillpower: false
        }
    ],
    path_of_poison: [
        {
            id: 'poison-path-craft',
            minRank: 1,
            type: 'poison',
            title: 'Vytvořit jed z vůle',
            description: 'Za každý účinný bod vůle vytvoříš jed s účinností 3. Od druhé úrovně můžeš zvolit libovolný typ jedu.',
            resultLabel: 'účinnost jedu',
            resultMultiplier: 3
        }
    ],
    path_of_praise: [
        {
            id: 'praise-heal',
            minRank: 1,
            type: 'heal',
            title: 'Chvalozpěv',
            description: 'Rozděl účinek mezi poškozené vlastnosti postavy.',
            resultLabel: 'bodů vlastnosti'
        },
        {
            id: 'praise-transfer',
            minRank: 3,
            type: 'effect',
            title: 'Předat vůli',
            description: 'Předá skutečně utracené body vůle společníkovi.',
            resultLabel: 'předané vůle',
            useEffectiveWillpower: false
        }
    ],
    path_of_song: [
        {
            id: 'song-money',
            minRank: 2,
            type: 'money',
            title: 'Zpěv o peníze',
            description: 'Získáš stříbrňáky podle účinku utracené vůle.',
            resultLabel: 'stříbrných',
            currency: 'silver'
        },
        {
            id: 'song-damage',
            minRank: 3,
            type: 'effect',
            title: 'Trýznivá píseň',
            description: 'Způsobí zranění Síly, které lze rozdělit mezi nepřátele.',
            resultLabel: 'zranění Síly'
        }
    ],
    path_of_war_cry: [
        {
            id: 'war-cry-damage',
            minRank: 3,
            type: 'effect',
            title: 'Děsivý řev',
            description: 'Způsobí zranění Bystrosti nepřátelům.',
            resultLabel: 'zranění Bystrosti'
        }
    ],
    path_of_the_blade: [
        {
            id: 'blade-damage',
            minRank: 3,
            type: 'effect',
            title: 'Posílit útok zblízka',
            description: 'Přidá bonusové zranění k útoku zblízka.',
            resultLabel: 'bonusového zranění'
        }
    ],
    path_of_the_shield: [
        {
            id: 'shield-reduction',
            minRank: 3,
            type: 'effect',
            title: 'Zmírnit zranění po odražení',
            description: 'Sníží příchozí zranění po úspěšném odražení.',
            resultLabel: 'sníženého zranění'
        }
    ],
    path_of_the_knight: [
        {
            id: 'knight-damage',
            minRank: 3,
            type: 'effect',
            title: 'Posílit útok ze sedla',
            description: 'Přidá bonusové zranění k útoku zblízka ze sedla.',
            resultLabel: 'bonusového zranění'
        }
    ],
    path_of_the_companion: [
        {
            id: 'companion-heal',
            minRank: 2,
            type: 'heal',
            title: 'Pomoc společníka',
            description: 'Zvíře obnoví vlastnosti, když je postava vyřazena.',
            resultLabel: 'bodů vlastnosti',
            requireBroken: true
        }
    ],
    path_of_the_beast: [
        {
            id: 'beast-heal',
            minRank: 2,
            type: 'heal',
            title: 'Pomoc šelmy',
            description: 'Šelma obnoví vlastnosti, když je postava vyřazena.',
            resultLabel: 'bodů vlastnosti',
            requireBroken: true
        }
    ],
    path_of_the_arrow: [
        {
            id: 'arrow-damage',
            minRank: 3,
            type: 'effect',
            title: 'Posílit zásah šípem',
            description: 'Přidá bonusové zranění k úspěšnému zásahu střelnou zbraní.',
            resultLabel: 'bonusového zranění'
        }
    ],
    path_of_dexterity: [
        {
            id: 'dexterity-damage',
            minRank: 2,
            type: 'effect',
            title: 'Posílit lehkou zbraň',
            description: 'Přidá bonusové zranění při použití Zlodějiny v boji.',
            resultLabel: 'bonusového zranění'
        }
    ],
    path_of_shadows: [
        {
            id: 'shadows-damage',
            minRank: 1,
            type: 'effect',
            title: 'Posílit útok ze zálohy',
            description: 'Přidá bonusové zranění k útoku ze zálohy.',
            resultLabel: 'bonusového zranění'
        }
    ],
    path_of_destruction: [
        {
            id: 'destruction-damage',
            minRank: 2,
            type: 'effect',
            title: 'Posílit ničení předmětu',
            description: 'Přidá bonusové poškození ničenému předmětu.',
            resultLabel: 'bonusového poškození předmětu'
        }
    ],
    path_of_fate: [
        {
            id: 'fate-reduction',
            minRank: 2,
            type: 'effect',
            title: 'Zázračné vyhnutí',
            description: 'Sníží utržené zranění po hodu na zbroj.',
            resultLabel: 'sníženého zranění'
        },
        {
            id: 'fate-actions',
            minRank: 3,
            type: 'effect',
            title: 'Zpomalení času',
            description: 'Získáš bojové akce navíc v tomto kole.',
            resultLabel: 'akcí navíc',
            maxSpent: 3
        }
    ],
    path_of_the_hound: [
        {
            id: 'hound-damage',
            minRank: 3,
            type: 'effect',
            title: 'Posílit útok psa',
            description: 'Přidá bonusové zranění k útoku psa.',
            resultLabel: 'bonusového zranění'
        }
    ],
    path_of_the_commander: [
        {
            id: 'commander-protection',
            minRank: 2,
            type: 'effect',
            title: 'Ochraň společníky',
            description: 'Zabrání kritickému zranění strachem u společníků.',
            resultLabel: 'ochráněných společníků'
        }
    ],
    path_of_the_killer: [
        {
            id: 'killer-damage',
            minRank: 1,
            type: 'effect',
            title: 'Posílit útok zabijáka',
            description: 'Přidá bonusové zranění k útoku ze zálohy lehkou zbraní.',
            resultLabel: 'bonusového zranění'
        }
    ],
    path_of_many_things: [
        {
            id: 'many-things-item',
            minRank: 1,
            type: 'item',
            title: 'Najít předmět',
            description: 'Vyber předmět, který odpovídá úrovni talentu a utracené vůli.',
            resultLabel: 'předmět'
        }
    ]
};

export const getTalentActions = (talent) => {
    if (!talent?.id) return [];
    const rank = Math.max(0, Number(talent.rank) || 0);
    return (TALENT_ACTIONS[normalizeTalentId(talent.id)] || []).filter(action => rank >= action.minRank);
};
