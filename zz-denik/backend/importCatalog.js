import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import mammoth from 'mammoth';
import * as cheerio from 'cheerio';
import { recordImportRun } from './catalogHistory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const defaultImportDir = path.join(rootDir, 'import_files');
const outputDir = path.join(__dirname, 'data');
const catalogPath = path.join(outputDir, 'catalog.json');

const goodsTables = [
  { tableIndex: 0, category: 'Zboží', subtype: 'general' },
  { tableIndex: 1, category: 'Zbraně nablízko', subtype: 'weapons_melee' },
  { tableIndex: 2, category: 'Střelné zbraně', subtype: 'weapons_ranged' },
  { tableIndex: 3, category: 'Zbroj', subtype: 'armor' },
  { tableIndex: 4, category: 'Oblečení', subtype: 'clothing' },
  { tableIndex: 5, category: 'Suroviny', subtype: 'materials_basic' },
  { tableIndex: 6, category: 'Suroviny', subtype: 'materials_special' },
  { tableIndex: 7, category: 'Lektvary', subtype: 'potions' },
  { tableIndex: 8, category: 'Služby', subtype: 'services' },
];

const spellSources = [
  { file: 'KouzlaPrintGeneral.docx', school: 'Obecná' },
  { file: 'KouzlaPrintHealing.docx', school: 'Léčení' },
  { file: 'KouzlaPrintDeath.docx', school: 'Smrt' },
  { file: 'KouzlaPrintBlood.docx', school: 'Krev' },
  { file: 'KouzlaPrintShapeshift.docx', school: 'Proměna' },
  { file: 'KouzlaPrintSight.docx', school: 'Jasnovidnost' },
  { file: 'KouzlaPrintStone.docx', school: 'Kámenpěvec' },
  { file: 'KouzlaPrintSymbol.docx', school: 'Symbolismus' },
  { file: 'KouzlaPrintLed.docx', school: 'Led', mode: 'staticFallback' },
  { file: 'KouzlaPrintElement.docx', school: 'Elementalismus', mode: 'disabled' },
];

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+\n/g, '\n')
    .trim();
}

function slugify(value) {
  const slug = normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'item';
}

function emptyToNull(value) {
  const text = normalizeText(value);
  if (!text || text === '-' || text === '–') return null;
  return text;
}

function normalizeHeader(header) {
  const text = normalizeText(header);
  const aliases = {
    Zbraň: 'Předmět',
    Surovina: 'Předmět',
    Oděv: 'Předmět',
    Služba: 'Předmět',
    Vlasnosti: 'Vlastnosti',
    Effekt: 'Efekt',
    'Effekt (Opravy lepších předmětů jsou náročnější, speciální bonusy jsou záporné kostky, pokud nepoužiješ vzácné suroviny)': 'Efekt',
  };
  return aliases[text] || text;
}

function parsePrice(original) {
  const text = normalizeText(original);
  if (!text) return null;

  const clean = text.toLowerCase().replace(',', '.');
  const parsed = Number.parseFloat(clean);
  if (!Number.isFinite(parsed)) {
    return { original: text, value: null, currency: null, copper: null };
  }

  let value = parsed;
  let currency = 'silver';

  if (clean.includes('zlat') || clean.includes('gold')) {
    currency = 'gold';
  } else if (clean.includes('měď') || clean.includes('med') || clean.includes('copper')) {
    currency = 'copper';
  } else if (value > 0 && value < 1) {
    value *= 10;
    currency = 'copper';
  } else if (value >= 10) {
    value /= 10;
    currency = 'gold';
  }

  value = Math.round(value * 100) / 100;
  const copper = Math.round(value * (currency === 'gold' ? 100 : currency === 'silver' ? 10 : 1) * 100) / 100;
  return { original: text, value, currency, copper };
}

function normalizeAvailability(original) {
  const text = emptyToNull(original);
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes('běž') || lower.includes('bež') || lower.includes('bezn')) return 'Běžná';
  if (lower.includes('neobvykl')) return 'Neobvyklá';
  if (lower.includes('vzác') || lower.includes('vzac')) return 'Vzácná';
  if (lower.includes('epick')) return 'Epická';
  return text;
}

function parseWeight(original) {
  const text = emptyToNull(original);
  if (!text) return { original: normalizeText(original), label: null, units: 0 };
  const lower = text.toLowerCase();

  if (lower.includes('drobn')) return { original: text, label: 'Drobná', units: 0 };
  if (lower.includes('lehk') || lower.includes('1/2') || lower.includes('½')) return { original: text, label: 'Lehká', units: 0.5 };
  if (lower.includes('norm') || lower.includes('běž')) return { original: text, label: 'Normální', units: 1 };
  if (lower.includes('těž') || lower.includes('tez')) return { original: text, label: 'Těžká', units: 2 };

  const parsed = Number.parseFloat(lower.replace(',', '.'));
  return {
    original: text,
    label: Number.isFinite(parsed) ? null : text,
    units: Number.isFinite(parsed) ? parsed : 0,
  };
}

function getRowCells($, row) {
  const cells = [];
  $(row)
    .find('td, th')
    .each((_, cell) => {
      const text = normalizeText($(cell).text());
      const colspan = Number.parseInt($(cell).attr('colspan') || '1', 10);
      cells.push(text);
      for (let i = 1; i < colspan; i += 1) cells.push('');
    });
  return cells;
}

function compactObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

async function readCatalogFromDisk() {
  try {
    const content = await fs.readFile(catalogPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
}

function normalizeGoodsRow(row, config) {
  const name = emptyToNull(row.Předmět);
  if (!name || name === 'Předmět') return null;

  const raw = compactObject(row);
  return {
    id: slugify(`${config.category}-${config.subtype}-${name}`),
    sourceType: 'goods',
    category: config.category,
    subtype: config.subtype,
    name,
    price: parsePrice(raw.Cena),
    availability: normalizeAvailability(raw.Dostupnost),
    weight: parseWeight(raw.Váha),
    craft: compactObject({
      materials: emptyToNull(raw.Suroviny || raw.Materiál),
      time: emptyToNull(raw.Čas),
      talent: emptyToNull(raw.Talent || raw['Talent/nářadí']),
      tools: emptyToNull(raw.Nářadí),
    }),
    combat: compactObject({
      hands: emptyToNull(raw.Ruce),
      bonus: emptyToNull(raw.Bonus),
      damage: emptyToNull(raw.Zranění),
      armor: emptyToNull(raw.Zbroj),
      properties: emptyToNull(raw.Vlastnosti),
    }),
    effect: emptyToNull(raw.Účinek || raw.Efekt),
    notes: emptyToNull(raw.Poznámky),
    source: compactObject({
      material: emptyToNull(raw.Materiál),
      monsterExample: emptyToNull(raw['Příklad monstra']),
      source: emptyToNull(raw.Zdroj),
      durability: emptyToNull(raw.Trvanlivost),
    }),
    raw,
  };
}

async function parseGoods(report, importRoot) {
  const sourcePath = path.join(importRoot, 'Zboží.docx');
  const result = await mammoth.convertToHtml({ path: sourcePath });
  const $ = cheerio.load(result.value);
  const tables = $('table').toArray();
  const items = [];

  report.sources.goods = {
    file: path.relative(rootDir, sourcePath),
    tables: tables.length,
    tableCounts: [],
  };

  for (const config of goodsTables) {
    const table = tables[config.tableIndex];
    if (!table) {
      report.warnings.push(`Missing goods table ${config.tableIndex} (${config.category}).`);
      continue;
    }

    const rows = $(table).find('tr').toArray();
    const headers = getRowCells($, rows[0] || []).map(normalizeHeader);
    let count = 0;

    for (const row of rows.slice(1)) {
      const cells = getRowCells($, row);
      const rawRow = {};
      headers.forEach((header, index) => {
        if (header) rawRow[header] = cells[index] || '';
      });
      const item = normalizeGoodsRow(rawRow, config);
      if (item) {
        items.push(item);
        count += 1;
      }
    }

    report.sources.goods.tableCounts.push({
      tableIndex: config.tableIndex,
      category: config.category,
      subtype: config.subtype,
      rows: count,
    });
  }

  return items;
}

function isTalentHeading(line) {
  const cleaned = normalizeText(line).replace(/\s*\([^)]*\)\s*$/, '');
  if (cleaned.length < 2 || cleaned.length > 70) return false;
  if (/[.,:;!?]/.test(cleaned)) return false;
  const letters = cleaned.match(/\p{L}/gu) || [];
  if (letters.length < 2) return false;
  return cleaned === cleaned.toLocaleUpperCase('cs-CZ');
}

function titleCaseCzech(value) {
  return normalizeText(value)
    .toLocaleLowerCase('cs-CZ')
    .replace(/(^|[\s-])(\p{L})/gu, (_, prefix, letter) => `${prefix}${letter.toLocaleUpperCase('cs-CZ')}`);
}

function normalizeTalentKey(value) {
  return slugify(value);
}

function appendRankText(rank, text) {
  rank.description = normalizeText([rank.description, `- ${text}`].filter(Boolean).join('\n'));
}

function talentBlocksToDescriptionAndRanks(blocks = []) {
  const descriptionParts = [];
  const ranks = [];
  let activeRank = null;
  let hasSeenList = false;

  for (const block of blocks) {
    if (block.type === 'p' && !hasSeenList) {
      descriptionParts.push(block.text);
      continue;
    }

    if (block.type === 'p') {
      if (activeRank) appendRankText(activeRank, block.text);
      else descriptionParts.push(block.text);
      continue;
    }

    if (block.type === 'ol') {
      hasSeenList = true;
      activeRank = {
        rank: ranks.length + 1,
        description: block.text,
      };
      ranks.push(activeRank);
      continue;
    }

    if (block.type === 'ul') {
      hasSeenList = true;
      if (!activeRank) {
        activeRank = {
          rank: ranks.length + 1,
          description: block.text,
        };
        ranks.push(activeRank);
      } else {
        appendRankText(activeRank, block.text);
      }
    }
  }

  if (ranks.length === 0 && descriptionParts.length > 1) {
    return {
      description: descriptionParts[0],
      ranks: descriptionParts.slice(1).map((descriptionText, index) => ({
        rank: index + 1,
        description: descriptionText,
      })),
    };
  }

  return {
    description: normalizeText(descriptionParts.join(' ')),
    ranks,
  };
}

function splitProfessionTalentName(name) {
  const parts = normalizeText(name).split(/\s*[-–—]\s*/);
  if (parts.length < 2) return null;

  const professionAliases = {
    Kuper: 'Kupec',
  };
  const profession = titleCaseCzech(parts[0]);
  const talentName = titleCaseCzech(parts.slice(1).join(' - '));

  return {
    profession: professionAliases[profession] || profession,
    name: talentName,
  };
}

function isProfessionTalentName(name) {
  return /\bcesta\b/i.test(normalizeText(name));
}

function finalizeTalent(current) {
  if (!current) return null;
  const parsedBlocks = talentBlocksToDescriptionAndRanks(current.blocks);
  const professionInfo = isProfessionTalentName(current.name) ? splitProfessionTalentName(current.name) : null;
  const name = professionInfo?.name || titleCaseCzech(current.name);
  const type = professionInfo ? 'profession' : 'general';

  return compactObject({
    id: slugify(professionInfo ? `${professionInfo.profession}-${name}` : current.name),
    sourceType: 'talent',
    type,
    profession: professionInfo?.profession,
    name,
    sourceCode: current.sourceCode,
    description: parsedBlocks.description,
    ranks: parsedBlocks.ranks,
  });
}

function mergeProfessionTalents(staticProfessionTalents, parsedProfessionTalents) {
  const parsedByKey = new Map(parsedProfessionTalents.map((talent) => [
    normalizeTalentKey(`${talent.profession}-${talent.name}`),
    talent,
  ]));

  const merged = staticProfessionTalents.map((staticTalent) => {
    const key = normalizeTalentKey(`${staticTalent.profession}-${staticTalent.name}`);
    const parsedTalent = parsedByKey.get(key);
    if (!parsedTalent) return staticTalent;
    parsedByKey.delete(key);
    return {
      ...parsedTalent,
      id: staticTalent.id,
    };
  });

  return [
    ...merged,
    ...[...parsedByKey.values()],
  ];
}

async function parseTalents(report, importRoot, staticProfessionTalents) {
  const sourcePath = path.join(importRoot, 'UpdatedGeneralTalentFormatted (2).docx');
  const result = await mammoth.convertToHtml({ path: sourcePath });
  const $ = cheerio.load(result.value);
  const talents = [];
  let current = null;
  let blockCount = 0;

  const finishCurrent = () => {
    const parsed = finalizeTalent(current);
    if (parsed) talents.push(parsed);
  };

  for (const node of $('body').children().toArray()) {
    const tagName = node.tagName?.toLowerCase();
    if (tagName === 'p') {
      const line = normalizeText($(node).text());
      if (!line) continue;
      blockCount += 1;

      if (isTalentHeading(line)) {
        finishCurrent();

        const sourceCodeMatch = line.match(/\(([^)]+)\)\s*$/);
        current = {
          name: normalizeText(line.replace(/\s*\([^)]*\)\s*$/, '')),
          sourceCode: sourceCodeMatch?.[1] || null,
          blocks: [],
        };
      } else if (current) {
        current.blocks.push({ type: 'p', text: line });
      } else {
        report.warnings.push(`Ignored talent paragraph before first heading: ${line}`);
      }
      continue;
    }

    if (tagName === 'ol' || tagName === 'ul') {
      for (const item of $(node).find('li').toArray()) {
        const text = normalizeText($(item).text());
        if (!text) continue;
        blockCount += 1;
        if (current) {
          current.blocks.push({ type: tagName, text });
        } else {
          report.warnings.push(`Ignored talent list item before first heading: ${text}`);
        }
      }
    }
  }

  finishCurrent();

  const generalTalents = talents.filter((talent) => talent.type !== 'profession');
  const parsedProfessionTalents = talents.filter((talent) => talent.type === 'profession');
  const professionTalents = mergeProfessionTalents(staticProfessionTalents, parsedProfessionTalents);

  report.sources.talents = {
    file: path.relative(rootDir, sourcePath),
    blocks: blockCount,
    parsed: talents.length,
    general: generalTalents.length,
    parsedProfession: parsedProfessionTalents.length,
    publishedProfession: professionTalents.length,
  };
  if (parsedProfessionTalents.length > 0) {
    report.warnings.push('Profession talents were parsed from the talent DOCX by the Cesta naming rule.');
  }

  return {
    general: generalTalents,
    profession: professionTalents,
  };
}

function isSpellStatsLine(line) {
  return /✥\s*\d+\.\s*stupeň/i.test(line) && /✥\s*Vzdálenost:/i.test(line) && /✥\s*Trvání:/i.test(line);
}

function isSpellNameLine(line) {
  const cleaned = normalizeText(line.replace(/^\*/, ''));
  if (cleaned.length < 2 || cleaned.length > 80) return false;
  if (cleaned.includes('✥')) return false;
  const letters = cleaned.match(/\p{L}/gu) || [];
  if (letters.length < 2) return false;
  return cleaned === cleaned.toLocaleUpperCase('cs-CZ');
}

function splitDurationAndDescription(durationText) {
  const text = normalizeText(durationText);
  const knownDurations = [
    'jeden čtvrtden za každý stupeň síly kouzla',
    'jedna směna (15 minut) za každou úroveň síly',
    'jedno kolo za každý stupeň síly kouzla',
    'jeden čtvrtden',
    'jedna směna (15 minut)',
    'jedna směna',
    'jeden den',
    'jedno kolo',
    'okamžité',
    'permanentní',
    'speciální',
    'různé',
    'čtvrtden',
  ];
  const lower = text.toLowerCase();
  const match = knownDurations.find((duration) => lower.startsWith(duration));
  if (!match) return { duration: text, description: '' };

  return {
    duration: text.slice(0, match.length),
    description: normalizeText(text.slice(match.length)),
  };
}

function parseSpellLine(line) {
  const rank = Number.parseInt(line.match(/✥\s*(\d+)\.\s*stupeň/i)?.[1] || '', 10);
  const range = line.match(/✥\s*Vzdálenost:\s*([^✥]+)/i)?.[1];
  const durationRaw = line.match(/✥\s*Trvání:\s*([^✥]+)/i)?.[1];
  const ingredient = line.match(/✥\s*Pomůcka:\s*(.*)$/i)?.[1];
  const tags = line.match(/✥\s*\d+\.\s*stupeň\s*,?\s*([^✥]*)/i)?.[1];
  const splitDuration = splitDurationAndDescription(durationRaw || '');

  if (!Number.isFinite(rank) || !range || !durationRaw) return null;

  return {
    rank,
    tags: emptyToNull(tags),
    range: normalizeText(range),
    duration: splitDuration.duration,
    ingredient: emptyToNull(ingredient),
    inlineDescription: splitDuration.description,
  };
}

function parseSpellsFromText(rawText, school) {
  const lines = rawText.split(/\r?\n/).map(normalizeText).filter(Boolean);
  const spells = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!isSpellStatsLine(line)) continue;

    const beforeStats = normalizeText(line.split('✥')[0].replace(/^\*/, ''));
    let name = beforeStats;
    if (!name) {
      for (let lookback = index - 1; lookback >= 0; lookback -= 1) {
        if (isSpellNameLine(lines[lookback])) {
          name = normalizeText(lines[lookback].replace(/^\*/, ''));
          break;
        }
      }
    }
    if (!name) continue;

    const stats = parseSpellLine(line);
    if (!stats) continue;

    const descriptionParts = [];
    if (stats.inlineDescription) descriptionParts.push(stats.inlineDescription);

    for (let next = index + 1; next < lines.length; next += 1) {
      const nextLine = lines[next];
      if (isSpellStatsLine(nextLine)) break;
      if (next + 1 < lines.length && isSpellNameLine(nextLine) && isSpellStatsLine(lines[next + 1])) break;
      descriptionParts.push(nextLine);
    }

    spells.push({
      id: slugify(name),
      sourceType: 'spell',
      school,
      name,
      rank: stats.rank,
      tags: stats.tags,
      range: stats.range,
      duration: stats.duration,
      ingredient: stats.ingredient,
      description: normalizeText(descriptionParts.join(' ')),
    });
  }

  const seen = new Set();
  return spells.filter((spell) => {
    if (seen.has(spell.id)) return false;
    seen.add(spell.id);
    return true;
  });
}

async function loadStaticData() {
  const talentsModule = await import(pathToFileURL(path.join(rootDir, 'src/data/talents_data.js')).href);
  const spellsModule = await import(pathToFileURL(path.join(rootDir, 'src/data/spells_data.js')).href);
  return {
    talents: talentsModule.TALENTS_DATA || { profession: [], general: [] },
    spells: spellsModule.SPELLS_DATA || {},
  };
}

async function parseSpells(report, staticSpells, importRoot) {
  const spellsBySchool = {};
  report.sources.spells = [];

  for (const source of spellSources) {
    const sourcePath = path.join(importRoot, 'Kouzla', source.file);
    const fallback = staticSpells[source.school] || [];

    if (source.mode === 'disabled') {
      spellsBySchool[source.school] = fallback;
      report.sources.spells.push({
        file: path.relative(rootDir, sourcePath),
        school: source.school,
        mode: 'disabled',
        parsed: 0,
        published: fallback.length,
      });
      report.warnings.push(`${source.school} import is disabled until the source file is confirmed.`);
      continue;
    }

    if (source.mode === 'staticFallback') {
      spellsBySchool[source.school] = fallback;
      report.sources.spells.push({
        file: path.relative(rootDir, sourcePath),
        school: source.school,
        mode: 'staticFallback',
        parsed: 0,
        published: fallback.length,
      });
      report.warnings.push(`${source.school} uses static fallback data.`);
      continue;
    }

    try {
      const rawText = (await mammoth.extractRawText({ path: sourcePath })).value;
      const parsed = parseSpellsFromText(rawText, source.school);
      const published = parsed.length > 0 ? parsed : fallback;
      spellsBySchool[source.school] = published;
      report.sources.spells.push({
        file: path.relative(rootDir, sourcePath),
        school: source.school,
        mode: parsed.length > 0 ? 'parsed' : 'fallback',
        parsed: parsed.length,
        published: published.length,
      });
      if (parsed.length === 0 && fallback.length > 0) {
        report.warnings.push(`${source.school} parser returned no spells, static fallback was used.`);
      }
    } catch (error) {
      spellsBySchool[source.school] = fallback;
      report.errors.push(`Failed to parse ${source.file}: ${error.message}`);
    }
  }

  return spellsBySchool;
}

function deriveProfessions(professionTalents) {
  const byProfession = new Map();
  for (const talent of professionTalents) {
    if (!talent.profession) continue;
    if (!byProfession.has(talent.profession)) {
      byProfession.set(talent.profession, {
        id: slugify(talent.profession),
        name: talent.profession,
        talentIds: [],
      });
    }
    byProfession.get(talent.profession).talentIds.push(talent.id);
  }
  return [...byProfession.values()];
}

function validateCatalog(catalog, report) {
  const ids = new Set();
  for (const item of catalog.items) {
    if (ids.has(`item:${item.id}`)) report.warnings.push(`Duplicate item id: ${item.id}`);
    ids.add(`item:${item.id}`);
    if (!item.name) report.warnings.push(`Item without name: ${item.id}`);
  }

  for (const talent of [...catalog.talents.general, ...catalog.talents.profession]) {
    if (!talent.id) report.warnings.push(`Talent without id: ${talent.name}`);
    if (!Array.isArray(talent.ranks)) report.warnings.push(`Talent without ranks array: ${talent.name}`);
  }

  for (const [school, spells] of Object.entries(catalog.spells)) {
    for (const spell of spells) {
      if (!spell.id || !spell.name) report.warnings.push(`Invalid spell in ${school}.`);
    }
  }
}

export async function importCatalog(options = {}) {
  const importRoot = options.importRoot || defaultImportDir;
  const previousCatalog = options.recordHistory === false ? null : await readCatalogFromDisk();
  const report = {
    startedAt: new Date().toISOString(),
    finishedAt: null,
    sources: {},
    counts: {},
    warnings: [],
    errors: [],
    sourceInfo: options.sourceInfo || {
      type: 'local',
      importDir: path.relative(rootDir, importRoot),
    },
  };

  await fs.mkdir(outputDir, { recursive: true });
  const staticData = await loadStaticData();
  const items = await parseGoods(report, importRoot);
  const parsedTalents = await parseTalents(report, importRoot, staticData.talents.profession || []);
  const generalTalents = parsedTalents.general;
  const professionTalents = parsedTalents.profession;
  const spells = await parseSpells(report, staticData.spells, importRoot);
  const professions = deriveProfessions(professionTalents);

  const catalog = {
    generatedAt: new Date().toISOString(),
    schemaVersion: 1,
    items,
    talents: {
      general: generalTalents,
      profession: professionTalents,
    },
    professions,
    spells,
    report,
  };

  report.counts = {
    items: items.length,
    generalTalents: generalTalents.length,
    professionTalents: professionTalents.length,
    professions: professions.length,
    spells: Object.values(spells).reduce((sum, list) => sum + list.length, 0),
  };
  validateCatalog(catalog, report);
  report.finishedAt = new Date().toISOString();

  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  const run = options.recordHistory === false ? null : await recordImportRun({
    catalog,
    previousCatalog,
    trigger: options.trigger || 'local-import',
    syncReport: options.syncReport || options.sourceInfo?.syncReport || null,
  });

  return { catalog, catalogPath, run };
}

export async function readCatalog() {
  try {
    const content = await fs.readFile(catalogPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const { catalog } = await importCatalog({ trigger: 'auto-bootstrap' });
    return catalog;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { catalog, run } = await importCatalog();
  console.log(JSON.stringify({
    generatedAt: catalog.generatedAt,
    counts: catalog.report.counts,
    warnings: catalog.report.warnings,
    errors: catalog.report.errors,
    diff: run?.diff?.summary,
    output: path.relative(rootDir, catalogPath),
  }, null, 2));
}
