import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

const spellFiles = [
    { file: 'import_files/Kouzla/KouzlaPrintGeneral.docx', school: 'Obecná' },
    { file: 'import_files/Kouzla/KouzlaPrintHealing.docx', school: 'Léčení' },
    // Elementalismus intentionally empty per user request
    { file: 'import_files/Kouzla/KouzlaPrintDeath.docx', school: 'Smrt' },
    { file: 'import_files/Kouzla/KouzlaPrintBlood.docx', school: 'Krev' },
    { file: 'import_files/Kouzla/KouzlaPrintShapeshift.docx', school: 'Proměna' },
    { file: 'import_files/Kouzla/KouzlaPrintSight.docx', school: 'Jasnovidnost' },
    { file: 'import_files/Kouzla/KouzlaPrintStone.docx', school: 'Kámenpěvec' },
    { file: 'import_files/Kouzla/KouzlaPrintSymbol.docx', school: 'Symbolismus' },
];

function toId(name) {
    return name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

// Czech format parser: handles ✥ X. stupeň ✥ Vzdálenost: ... ✥ Trvání: ... [✥ Pomůcka: ...]
function parseCzechSpells(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const spells = [];

    // More flexible regex patterns
    // Full pattern with Pomůcka
    const fullStatsRegex = /✥\s*(\d+)\.\s*stupeň([^✥]*)✥\s*Vzdálenost:\s*([^✥]+)✥\s*Trvání:\s*([^✥]+)✥\s*Pomůcka:\s*(.*)/i;
    // Pattern without Pomůcka (Symbolismus)
    const noIngredientRegex = /✥\s*(\d+)\.\s*stupeň([^✥]*)✥\s*Vzdálenost:\s*([^✥]+)✥\s*Trvání:\s*(.*)/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Try to find a spell stats pattern
        let match = line.match(fullStatsRegex) || line.match(noIngredientRegex);
        if (!match) continue;

        const hasIngredient = !!line.match(fullStatsRegex);

        // Extract the name: everything before ✥ on this line, or previous line
        let nameOnLine = line.split('✥')[0].trim().replace(/^\*/, '').trim();
        let spellName = '';

        if (nameOnLine.length > 0 && nameOnLine.length < 60) {
            spellName = nameOnLine;
        } else {
            // Look at previous line(s) for name
            for (let j = i - 1; j >= 0; j--) {
                const prevLine = lines[j].replace(/^\*/, '').trim();
                if (prevLine.length > 0 && prevLine.length < 60 && !prevLine.includes('✥')) {
                    spellName = prevLine;
                    break;
                }
            }
        }

        if (!spellName) continue;

        const rank = parseInt(match[1]);
        const range = (hasIngredient ? match[3] : match[3]).trim().replace(/\s*✥\s*$/, '').trim();
        let duration, ingredient;

        if (hasIngredient) {
            duration = match[4].trim().replace(/\s*✥\s*$/, '').trim();
            ingredient = match[5].trim();
        } else {
            // Duration might contain the description if on same line
            const durRaw = match[4].trim();
            // Split at first sentence-like boundary after a reasonable duration string
            const durMatch = durRaw.match(/^([\w\sáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ()\/,]+?)(?:\s+[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]|\s*$)/);
            if (durMatch) {
                duration = durMatch[1].trim();
            } else {
                duration = durRaw;
            }
            ingredient = '';
        }

        // Remove trailing description from duration if it leaked in
        // Typical durations: "okamžité", "jeden čtvrtden", "jedna směna (15 minut)", "jedno kolo"
        const knownDurations = [
            'okamžité', 'jeden čtvrtden', 'jedna směna', 'jedno kolo',
            'jeden den', 'různé', 'permanentní', 'okamžitě'
        ];
        let cleanDuration = duration;
        for (const kd of knownDurations) {
            if (duration.toLowerCase().startsWith(kd)) {
                // Take up to the end of the known duration plus any parenthetical
                const afterKd = duration.substring(kd.length).trim();
                if (afterKd.startsWith('(')) {
                    const parenEnd = afterKd.indexOf(')');
                    cleanDuration = kd + ' ' + afterKd.substring(0, parenEnd + 1);
                } else if (afterKd.startsWith('za')) {
                    cleanDuration = duration; // e.g. "jeden čtvrtden za každý stupeň síly kouzla"
                } else {
                    cleanDuration = kd;
                }
                break;
            }
        }

        // Now get description: everything after the stats line on the same line, plus subsequent lines
        let descParts = [];

        // Check if there's description text after the stats on the same line
        const afterStats = hasIngredient
            ? line.split(match[5])[1]
            : line.substring(line.indexOf(duration) + duration.length);

        if (afterStats && afterStats.trim().length > 0) {
            // If we used a known duration, the rest after cleaned duration is description
            if (cleanDuration !== duration) {
                const fullDuration = match[hasIngredient ? 4 : 4].trim();
                const descOnLine = fullDuration.substring(cleanDuration.length).trim();
                if (descOnLine.length > 10) {
                    descParts.push(descOnLine);
                }
            } else {
                const descOnLine = afterStats.trim();
                if (descOnLine.length > 5) {
                    descParts.push(descOnLine);
                }
            }
        }

        // Collect subsequent description lines
        let j = i + 1;
        while (j < lines.length) {
            const nextLine = lines[j];
            // Stop if we hit a new spell stats line
            if (nextLine.includes('✥') && (nextLine.match(fullStatsRegex) || nextLine.match(noIngredientRegex))) break;
            // Stop if line before a stats line (it's a spell name)
            if (j + 1 < lines.length && lines[j + 1].includes('✥') &&
                (lines[j + 1].match(fullStatsRegex) || lines[j + 1].match(noIngredientRegex))) {
                // But only if this line looks like a name (short, uppercase)
                if (nextLine.length < 50) break;
            }
            // Stop if line is uppercase and short (likely next spell name)
            if (nextLine === nextLine.toUpperCase() && nextLine.length < 50 && nextLine.length > 2 && descParts.length > 0) {
                break;
            }
            if (nextLine.startsWith('*') && nextLine.length < 50 && descParts.length > 0) {
                break;
            }
            descParts.push(nextLine);
            j++;
        }

        duration = cleanDuration;

        spells.push({
            id: toId(spellName),
            name: spellName,
            rank,
            range,
            duration,
            ingredient,
            description: descParts.join(' ').trim()
        });
    }

    return spells;
}

// Hard-coded translated Ice spells (from English KouzlaPrintLed.docx)
function getIceSpells() {
    return [
        {
            id: 'mraziva_vlna',
            name: 'Mrazivá vlna',
            rank: 1,
            range: 'krátká',
            duration: 'jedna směna (15 minut)',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Přivoláš extrémní chlad v BLÍZKÉ vzdálenosti (stejná zóna). Každý v zóně si musí hodit na VÝDRŽ, jinak získá stav CHLAD. Veškerá voda v dosahu okamžitě zamrzne.'
        },
        {
            id: 'chodec_mrazem',
            name: 'Chodec mrazem',
            rank: 1,
            range: 'osobní',
            duration: 'čtvrtden',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Stáváš se imunním vůči všem účinkům chladu. Za každou další úroveň síly můžeš prodloužit dobu trvání o čtvrtden nebo rozšířit účinek na další osobu v BLÍZKÉ vzdálenosti.'
        },
        {
            id: 'ledovy_stit',
            name: 'Ledový štít',
            rank: 1,
            range: 'osobní',
            duration: 'jedna směna (15 minut)',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Vytvoříš štít z ledu, který funguje jako normální malý štít s artefaktovou kostkou k8. Pokud zvýšíš úroveň síly o jedna, můžeš vytvořit velký štít nebo zvýšit artefaktovou kostku na k10. Štít může používat pouze ty.'
        },
        {
            id: 'ledove_srdce',
            name: 'Ledové srdce',
            rank: 2,
            range: 'blízká',
            duration: 'okamžité',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Proměníš srdce oběti v led. Oběť utrpí 1 bod zranění bystrosti za každou úroveň síly a získá stav CHLAD. Zbroj nemá žádný účinek.'
        },
        {
            id: 'snezna_jeskyne',
            name: 'Sněžná jeskyně',
            rank: 2,
            range: 'blízká',
            duration: 'čtvrtden',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Vytvoříš sněžnou jeskyni, která poskytne přístřeší až pro pět osob na čtvrtden. Jeskyně dává +1 za každou úroveň síly k hodu na TÁBOŘENÍ. Také poskytuje dostatečnou ochranu proti chladu při SPANÍ nebo ODPOČINKU, stejně jako proti vánicím a jehlovým bouřím.'
        },
        {
            id: 'ledovy_mec',
            name: 'Ledový meč',
            rank: 2,
            range: 'délka paže',
            duration: 'jedna směna (15 minut)',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Kouzlo přivolá meč z ledu, který funguje jako normální krátký meč s artefaktovou kostkou k8. Zvýšením úrovně síly o jedna můžeš přivolat dlouhý meč a o dva obouruční meč. Případně můžeš zvýšením úrovně síly o jedna zlepšit artefaktovou kostku na k10.'
        },
        {
            id: 'vanice',
            name: 'Vánice',
            rank: 3,
            range: 'blízká',
            duration: 'jedna směna (15 minut) za každou úroveň síly',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Vytvoříš vířící vánici, přičemž ty jsi v oku bouře. Můžeš rozdělit body zranění obratnosti rovné úrovni síly mezi libovolné oběti v BLÍZKÉ vzdálenosti. Každý, kdo utrpí zranění, získá stav CHLAD a musí si hodit na SVALY, aby zůstal na nohou.'
        },
        {
            id: 'salva_rampouchu',
            name: 'Salva rampouchů',
            rank: 3,
            range: 'krátká',
            duration: 'okamžité',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Přivoláš mrak rampouchů a mrštíš ho na cíl v KRÁTKÉ vzdálenosti. Útok způsobí zranění rovné úrovni síly (bodná rána) a cíl získá stav CHLAD.'
        },
        {
            id: 'ledovy_dech',
            name: 'Ledový dech',
            rank: 3,
            range: 'blízká',
            duration: 'okamžité',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Vydechneš ledově studený oblak sněhu na cíl v BLÍZKÉ vzdálenosti. Oběť si musí okamžitě hodit protihod SVALŮ proti dvojnásobku úrovně síly (hod není akce), jinak je zmrazena na místě na jednu směnu (15 minut). Pokud hod selže, oběť se nemůže vůbec hýbat a získá stav CHLAD.'
        },
        {
            id: 'zimni_stisk',
            name: 'Zimní stisk',
            rank: 1,
            range: 'délka paže',
            duration: 'čtvrtden',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Tvůj cíl může chodit po ledu a sypkém sněhu, jako by to byl pevný povrch, a nemá žádný další postih při šplhání po holém ledu, pokud materiál unese jeho váhu. Každá úroveň síly může přidat jeden cíl nebo zdvojnásobit dobu trvání.'
        },
        {
            id: 'ledove_sipy',
            name: 'Ledové šípy',
            rank: 1,
            range: 'délka paže',
            duration: 'speciální',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Vytvoříš dávku kompaktních ledových šípů nebo šipek. Počítají se jako kostka zdrojů šípů s dřevěným hrotem, s tím, že šípy vydrží neomezeně dlouho jen v teplotách pod nulou. Při jarních/podzimních teplotách se rozpustí za čtvrtden, při letních teplotách za směnu (15 minut). Další úrovně síly mohou vytvořit další kostky zdrojů nebo šípy zpevnit tak, aby se počítaly jako šípy s kovovým hrotem.'
        },
        {
            id: 'zona_chladu',
            name: 'Zóna chladu',
            rank: 2,
            range: 'dlouhá',
            duration: 'čtvrtden',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Teplota v dosahu klesne o jeden stupeň za každou úroveň síly. Z letní na jarní/podzimní, na zimní a ještě chladnější. Při zimních teplotách se na všech površích začne tvořit námraza, pokud není vzduch mimořádně suchý. Při dalším snížení teploty veškerá stojící voda zamrzne během jedné směny (15 minut).'
        },
        {
            id: 'srazeni_vody',
            name: 'Srážení vody',
            rank: 2,
            range: 'blízká',
            duration: 'okamžité',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Manipulací teploty dokážeš srazit vodní páru ve vzduchu a naplnit tak blízké nádoby – obnovíš 1 kostku zdrojů vody za každou úroveň síly. Kouzlo vyžaduje dvojnásobek úrovně síly v pouštní oblasti, kde normálně nelze hledat vodu.'
        },
        {
            id: 'zimni_volani',
            name: 'Zimní volání',
            rank: 3,
            range: 'aktuální hex',
            duration: 'jeden den',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Rituál. Prudce snížíš teplotu hexu, ve kterém se nacházíš. Letní, jarní a podzimní teploty klesnou na zimní během rituálu a pak trvají 24 hodin. Každý pokles teploty stojí 1 úroveň síly. Když rituál skončí, získáš počet bodů vůle rovný dvojnásobku teplotního rozdílu. Tento rituál nemůže nikdy snížit teplotu pod nulu.'
        },
        {
            id: 'ledove_brneni',
            name: 'Ledové brnění',
            rank: 3,
            range: 'osobní',
            duration: 'jedna směna (15 minut)',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Kouzlo zesiluje tvou zbroj zpevněnou vrstvou ledu. Zbroj získá artefaktovou kostku k8 a její hodnota zbroje se zvýší na minimum 6 po dobu trvání kouzla. Zvýšením úrovně síly o jedna můžeš zlepšit artefaktovou kostku na k10.'
        },
        {
            id: 'tvarovani_ledu',
            name: 'Tvarování ledu',
            rank: 4,
            range: 'osobní',
            duration: 'jedna směna za každou úroveň síly',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Dokážeš tvarovat sníh a led rukama. Tato schopnost je praktická pro rychlou výrobu ledových soch, ale především ti umožňuje prorazit tunel skrz led rychlostí chůze. Schopnost tvarovat sníh a led trvá 1 směnu (15 minut) za každou úroveň síly.'
        },
        {
            id: 'ledova_zed',
            name: 'Ledová zeď',
            rank: 4,
            range: 'krátká',
            duration: 'permanentní',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Ze země v cílové oblasti vyroste zeď z ledu. Všechny bytosti, které jí stojí v cestě, si mohou vybrat, na které straně zůstanou, ale spadnou na zem, pokud neuspějí v hodu na MRŠTNOST s postihem rovným úrovni síly. Nestvůry na zem nespadnou. Zeď zabírá prostor 3 metry na výšku a 10 metrů na délku a může být mírně zakřivená, ale bez ostrých rohů. Část ledu se prolomí tak, aby se prolamovač mohl projít, pokud utrpí 2 body zranění za každou úroveň síly při hodnotě zbroje 5. Úrovně síly mohou zdvojnásobit rozměr zdi. Účinek zdi je permanentní, ale zeď poškozuje vyšší teplota. Extrémní teplota: 1/minutu, letní teplota: 1/směnu, jarní/podzimní teplota: 1/čtvrtden.'
        },
        {
            id: 'krystalizace',
            name: 'Krystalizace',
            rank: 4,
            range: 'délka paže',
            duration: 'permanentní',
            ingredient: 'kus ledu nebo hrst sněhu',
            description: 'Lehký předmět z ledu, kterého se dotkneš, přestane být ovlivněn teplotou a přestane být studený na dotek – vypadá spíše jako křišťál. Předmět používá stejné parametry jako předmět z obsidiánu (sopečného skla). Úrovně síly mohou zpevnit těžší předměty: 2 pro předmět běžné váhy a 3 pro těžký předmět. Pokud se předmět rozbije, změní se zpět na obyčejný led.'
        }
    ];
}

async function extractAllSpells() {
    const allSchools = {};

    for (const { file, school } of spellFiles) {
        console.log(`Processing: ${file} -> ${school}`);
        try {
            const result = await mammoth.extractRawText({ path: file });
            const spells = parseCzechSpells(result.value);

            // Deduplicate by id
            const seen = new Set();
            const deduped = [];
            for (const s of spells) {
                if (!seen.has(s.id)) {
                    seen.add(s.id);
                    deduped.push(s);
                } else {
                    console.log(`  Skipping duplicate: ${s.name}`);
                }
            }

            allSchools[school] = deduped;
            console.log(`  Found ${deduped.length} spells`);
            deduped.forEach(s => console.log(`    - ${s.name} (stupeň ${s.rank})`));
        } catch (err) {
            console.error(`  Error: ${err.message}`);
        }
    }

    // Add Ice spells (translated from English)
    allSchools['Led'] = getIceSpells();
    console.log(`\nLed (translated): ${allSchools['Led'].length} spells`);
    allSchools['Led'].forEach(s => console.log(`    - ${s.name} (stupeň ${s.rank})`));

    // Add empty Elementalismus
    allSchools['Elementalismus'] = [];
    console.log(`Elementalismus: empty (per user request)`);

    // Write output
    const output = `export const SPELLS_DATA = ${JSON.stringify(allSchools, null, 2)};\n`;
    fs.writeFileSync('src/data/spells_data.js', output);
    console.log(`\nWritten to src/data/spells_data.js`);

    // Summary
    let total = 0;
    for (const [school, spells] of Object.entries(allSchools)) {
        console.log(`${school}: ${spells.length} spells`);
        total += spells.length;
    }
    console.log(`Total: ${total} spells`);
}

extractAllSpells();
