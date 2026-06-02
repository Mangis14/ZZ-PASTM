import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(__dirname, 'data');
const snapshotsDir = path.join(dataDir, 'snapshots');
const runsPath = path.join(dataDir, 'import-runs.json');

const maxRuns = 50;
const maxStoredChanges = 25;

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
}

function hashEntity(entity) {
  return crypto.createHash('sha256').update(stableStringify(entity)).digest('hex');
}

function makeRunId(generatedAt) {
  const timestamp = new Date(generatedAt || Date.now()).toISOString().replace(/[:.]/g, '-');
  return `${timestamp}-${crypto.randomUUID().slice(0, 8)}`;
}

function compactEntity({ key, entity, group }) {
  return {
    key,
    id: entity.id || key,
    name: entity.name || key,
    group: group || entity.category || entity.school || entity.profession || null,
  };
}

function getChangedFields(before, after) {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  return [...keys]
    .sort()
    .filter((key) => stableStringify(before?.[key]) !== stableStringify(after?.[key]))
    .slice(0, 10);
}

function entityMap(entries) {
  const map = new Map();
  for (const entry of entries) {
    map.set(entry.key, {
      ...entry,
      hash: hashEntity(entry.entity),
    });
  }
  return map;
}

function compareEntries(previousEntries, nextEntries) {
  const previous = entityMap(previousEntries);
  const next = entityMap(nextEntries);
  const added = [];
  const removed = [];
  const changed = [];

  for (const [key, entry] of next.entries()) {
    if (!previous.has(key)) {
      added.push(compactEntity(entry));
      continue;
    }

    const previousEntry = previous.get(key);
    if (previousEntry.hash !== entry.hash) {
      changed.push({
        ...compactEntity(entry),
        fields: getChangedFields(previousEntry.entity, entry.entity),
      });
    }
  }

  for (const [key, entry] of previous.entries()) {
    if (!next.has(key)) removed.push(compactEntity(entry));
  }

  const sortByName = (left, right) => left.name.localeCompare(right.name, 'cs');
  added.sort(sortByName);
  removed.sort(sortByName);
  changed.sort(sortByName);

  return {
    summary: {
      added: added.length,
      changed: changed.length,
      removed: removed.length,
    },
    added: added.slice(0, maxStoredChanges),
    changed: changed.slice(0, maxStoredChanges),
    removed: removed.slice(0, maxStoredChanges),
    truncated: {
      added: Math.max(0, added.length - maxStoredChanges),
      changed: Math.max(0, changed.length - maxStoredChanges),
      removed: Math.max(0, removed.length - maxStoredChanges),
    },
  };
}

function flattenSpells(spells = {}) {
  return Object.entries(spells).flatMap(([school, spellList]) => (
    (spellList || []).map((spell) => ({
      key: `${school}:${spell.id || spell.name}`,
      group: school,
      entity: {
        ...spell,
        school,
      },
    }))
  ));
}

function catalogCollections(catalog) {
  return {
    items: (catalog?.items || []).map((item) => ({
      key: item.id || item.name,
      group: item.category,
      entity: item,
    })),
    generalTalents: (catalog?.talents?.general || []).map((talent) => ({
      key: talent.id || talent.name,
      group: 'General',
      entity: talent,
    })),
    professionTalents: (catalog?.talents?.profession || []).map((talent) => ({
      key: talent.id || talent.name,
      group: talent.profession || 'Profession',
      entity: talent,
    })),
    professions: (catalog?.professions || []).map((profession) => ({
      key: profession.id || profession.name,
      group: 'Profession',
      entity: profession,
    })),
    spells: flattenSpells(catalog?.spells),
  };
}

function addSummaries(...summaries) {
  return summaries.reduce((total, summary) => ({
    added: total.added + (summary?.added || 0),
    changed: total.changed + (summary?.changed || 0),
    removed: total.removed + (summary?.removed || 0),
  }), { added: 0, changed: 0, removed: 0 });
}

function totalSummary(summary) {
  return Object.values(summary).reduce((total, current) => total + current.added + current.changed + current.removed, 0);
}

export function createCatalogDiff(previousCatalog, nextCatalog) {
  const previous = catalogCollections(previousCatalog);
  const next = catalogCollections(nextCatalog);

  const details = {
    items: compareEntries(previous.items, next.items),
    generalTalents: compareEntries(previous.generalTalents, next.generalTalents),
    professionTalents: compareEntries(previous.professionTalents, next.professionTalents),
    professions: compareEntries(previous.professions, next.professions),
    spells: compareEntries(previous.spells, next.spells),
  };

  const summary = {
    items: details.items.summary,
    talents: addSummaries(details.generalTalents.summary, details.professionTalents.summary),
    professions: details.professions.summary,
    spells: details.spells.summary,
  };

  return {
    baselineGeneratedAt: previousCatalog?.generatedAt || null,
    generatedAt: nextCatalog?.generatedAt || null,
    totalChanges: totalSummary(summary),
    summary,
    details,
  };
}

async function readRunsFile() {
  try {
    const content = await fs.readFile(runsPath, 'utf8');
    const runs = JSON.parse(content);
    return Array.isArray(runs) ? runs : [];
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return [];
  }
}

function summarizeSync(syncReport) {
  if (!syncReport) return null;

  return {
    startedAt: syncReport.startedAt,
    finishedAt: syncReport.finishedAt,
    source: syncReport.source,
    downloadCount: syncReport.downloads?.length || 0,
    discoveredSpellFiles: syncReport.discoveredSpellFiles || 0,
    warnings: syncReport.warnings || [],
    errors: syncReport.errors || [],
  };
}

export async function recordImportRun({
  catalog,
  previousCatalog = null,
  trigger = 'import',
  syncReport = null,
} = {}) {
  if (!catalog) throw new Error('Cannot record import run without catalog.');

  await fs.mkdir(snapshotsDir, { recursive: true });
  const runId = makeRunId(catalog.generatedAt);
  const snapshotPath = path.join(snapshotsDir, `${runId}.json`);
  await fs.writeFile(snapshotPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

  const diff = createCatalogDiff(previousCatalog, catalog);
  const run = {
    id: runId,
    trigger,
    sourceType: catalog.report?.sourceInfo?.type || 'local',
    generatedAt: catalog.generatedAt,
    startedAt: catalog.report?.startedAt || null,
    finishedAt: catalog.report?.finishedAt || null,
    counts: catalog.report?.counts || {},
    warningCount: catalog.report?.warnings?.length || 0,
    errorCount: catalog.report?.errors?.length || 0,
    diff,
    snapshotFile: path.relative(rootDir, snapshotPath),
    syncSummary: summarizeSync(syncReport),
  };

  const runs = await readRunsFile();
  const nextRuns = [run, ...runs.filter((existingRun) => existingRun.id !== run.id)].slice(0, maxRuns);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(runsPath, `${JSON.stringify(nextRuns, null, 2)}\n`, 'utf8');

  return run;
}

export async function readImportRuns({ limit = 10 } = {}) {
  const runs = await readRunsFile();
  return runs.slice(0, limit);
}

export async function readLatestImportRun() {
  const [latestRun] = await readImportRuns({ limit: 1 });
  return latestRun || null;
}
