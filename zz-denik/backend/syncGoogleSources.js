import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { googleSources, expectedSpellFiles } from './sourceConfig.js';
import { importCatalog } from './importCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const cacheImportDir = path.join(__dirname, 'source-cache', 'import_files');

function documentExportUrl(documentId) {
  return `https://docs.google.com/document/d/${documentId}/export?format=docx`;
}

function driveDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

async function ensureDocx(buffer, label) {
  const signature = [...buffer.subarray(0, 4)].map((byte) => byte.toString(16).padStart(2, '0')).join(' ');
  if (signature !== '50 4b 03 04') {
    const preview = buffer.toString('utf8', 0, Math.min(buffer.length, 160));
    throw new Error(`${label} did not download as DOCX. Signature: ${signature}. Preview: ${preview}`);
  }
}

async function fetchBuffer(url, label) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`${label} download failed with HTTP ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await ensureDocx(buffer, label);
  return buffer;
}

async function downloadDocSource(source, targetPath) {
  const buffer = await fetchBuffer(documentExportUrl(source.documentId), source.label);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, buffer);
  return {
    label: source.label,
    file: path.relative(rootDir, targetPath),
    bytes: buffer.length,
  };
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export async function discoverDriveFolderFiles(folderId = googleSources.spellsFolder.folderId) {
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  const response = await fetch(folderUrl, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Drive folder discovery failed with HTTP ${response.status}`);
  const html = await response.text();
  const files = new Map();
  const regex = /data-id="([^"]+)"[^>]*data-tooltip="([^"]+?\.docx) Microsoft Word"/g;

  for (const match of html.matchAll(regex)) {
    const id = decodeHtmlEntities(match[1]);
    const name = decodeHtmlEntities(match[2]);
    if (expectedSpellFiles.includes(name)) files.set(name, { id, name });
  }

  return [...files.values()].sort((a, b) => a.name.localeCompare(b.name, 'cs'));
}

async function downloadSpellFile(file, targetDir) {
  const buffer = await fetchBuffer(driveDownloadUrl(file.id), file.name);
  const targetPath = path.join(targetDir, file.name);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, buffer);
  return {
    name: file.name,
    id: file.id,
    file: path.relative(rootDir, targetPath),
    bytes: buffer.length,
  };
}

export async function syncGoogleSources() {
  const startedAt = new Date().toISOString();
  const downloads = [];
  const warnings = [];
  const errors = [];

  await fs.mkdir(cacheImportDir, { recursive: true });

  downloads.push(await downloadDocSource(googleSources.goods, path.join(cacheImportDir, googleSources.goods.fileName)));
  downloads.push(await downloadDocSource(googleSources.talents, path.join(cacheImportDir, googleSources.talents.fileName)));

  const spellDir = path.join(cacheImportDir, 'Kouzla');
  const discoveredSpellFiles = await discoverDriveFolderFiles();
  const discoveredNames = new Set(discoveredSpellFiles.map((file) => file.name));

  for (const expectedName of expectedSpellFiles) {
    if (!discoveredNames.has(expectedName)) warnings.push(`Missing expected spell file in Drive folder: ${expectedName}`);
  }

  for (const file of discoveredSpellFiles) {
    try {
      downloads.push(await downloadSpellFile(file, spellDir));
    } catch (error) {
      errors.push(`${file.name}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Google source sync failed: ${errors.join('; ')}`);
  }

  return {
    startedAt,
    finishedAt: new Date().toISOString(),
    source: 'google',
    importDir: cacheImportDir,
    downloads,
    discoveredSpellFiles: discoveredSpellFiles.length,
    warnings,
    errors,
  };
}

export async function syncAndImportGoogleSources() {
  const syncReport = await syncGoogleSources();
  const { catalog, run } = await importCatalog({
    importRoot: syncReport.importDir,
    trigger: 'google-sync',
    syncReport,
    sourceInfo: {
      type: 'google',
      syncReport,
    },
  });
  return { catalog, syncReport, run };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const shouldImport = process.argv.includes('--import');
  const result = shouldImport ? await syncAndImportGoogleSources() : { syncReport: await syncGoogleSources() };
  console.log(JSON.stringify({
    syncReport: result.syncReport,
    catalog: result.catalog ? {
      generatedAt: result.catalog.generatedAt,
      counts: result.catalog.report.counts,
      warnings: result.catalog.report.warnings,
      errors: result.catalog.report.errors,
      diff: result.run?.diff?.summary,
    } : null,
  }, null, 2));
}
