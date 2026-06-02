import http from 'node:http';
import { readImportRuns, readLatestImportRun } from './catalogHistory.js';
import { importCatalog, readCatalog } from './importCatalog.js';
import { syncAndImportGoogleSources } from './syncGoogleSources.js';

const port = Number.parseInt(process.env.PORT || '8787', 10);
let importInProgress = null;
let syncInProgress = null;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload, null, 2));
}

async function routeCatalog(catalog, pathname) {
  if (pathname === '/api/catalog/bootstrap') {
    return {
      ...catalog,
      latestRun: await readLatestImportRun(),
      importHistory: await readImportRuns({ limit: 5 }),
    };
  }
  if (pathname === '/api/catalog/items') return { generatedAt: catalog.generatedAt, items: catalog.items };
  if (pathname === '/api/catalog/talents') return { generatedAt: catalog.generatedAt, talents: catalog.talents };
  if (pathname === '/api/catalog/professions') return { generatedAt: catalog.generatedAt, professions: catalog.professions };
  if (pathname === '/api/catalog/spells') return { generatedAt: catalog.generatedAt, spells: catalog.spells };
  if (pathname === '/api/catalog/report') {
    return {
      generatedAt: catalog.generatedAt,
      report: catalog.report,
      latestRun: await readLatestImportRun(),
    };
  }
  if (pathname === '/api/catalog/history') {
    return {
      generatedAt: catalog.generatedAt,
      runs: await readImportRuns({ limit: 20 }),
    };
  }
  return null;
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { ok: true, service: 'zz-denik-backend' });
      return;
    }

    if (request.method === 'GET' && url.pathname.startsWith('/api/catalog/')) {
      const catalog = await readCatalog();
      const payload = await routeCatalog(catalog, url.pathname);
      if (!payload) {
        sendJson(response, 404, { error: 'Unknown catalog route.' });
        return;
      }
      sendJson(response, 200, payload);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/import') {
      if (!importInProgress) {
        importInProgress = importCatalog({ trigger: 'manual-import' }).finally(() => {
          importInProgress = null;
        });
      }
      const { catalog, run } = await importInProgress;
      sendJson(response, 200, {
        generatedAt: catalog.generatedAt,
        report: catalog.report,
        run,
      });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/sync-google') {
      if (!syncInProgress) {
        syncInProgress = syncAndImportGoogleSources().finally(() => {
          syncInProgress = null;
        });
      }
      const { catalog, syncReport, run } = await syncInProgress;
      sendJson(response, 200, {
        generatedAt: catalog.generatedAt,
        syncReport,
        report: catalog.report,
        run,
      });
      return;
    }

    sendJson(response, 404, { error: 'Not found.' });
  } catch (error) {
    sendJson(response, 500, {
      error: 'Backend request failed.',
      message: error.message,
    });
  }
});

server.listen(port, () => {
  console.log(`ZZ Denik backend listening on http://localhost:${port}`);
});
