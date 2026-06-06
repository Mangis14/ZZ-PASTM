import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { TALENTS_DATA } from '../data/talents_data';
import { SPELLS_DATA } from '../data/spells_data';
import bundledImportedCatalog from '../../backend/data/catalog.json';

const CATEGORY_ORDER = [
  'Zboží',
  'Zbraně nablízko',
  'Střelné zbraně',
  'Zbroj',
  'Oblečení',
  'Suroviny',
  'Lektvary',
  'Služby',
];

const BOOTSTRAP_ENDPOINT = '/api/catalog/bootstrap';
const IMPORT_ENDPOINT = '/api/admin/import';
const GOOGLE_SYNC_ENDPOINT = '/api/admin/sync-google';

function buildAllItems(itemsByCategory) {
  const orderedCategories = [
    ...CATEGORY_ORDER,
    ...Object.keys(itemsByCategory).filter((category) => !CATEGORY_ORDER.includes(category)).sort(),
  ];
  return orderedCategories.flatMap((category) => itemsByCategory[category] || []);
}

function createFallbackCatalog(extra = {}) {
  const importedFallback = createCatalogFromApi(bundledImportedCatalog, {
    source: 'bundled-import',
  });

  return {
    ...importedFallback,
    refreshCatalog: async () => {},
    runImport: async () => {},
    runGoogleSync: async () => {},
    ...extra,
  };
}

function legacyPrice(price, rawPrice) {
  if (!price) return rawPrice || null;
  if (price.value === null || !price.currency) return null;
  return {
    value: price.value,
    currency: price.currency,
    original: price.original,
  };
}

function legacyItemFromApi(item) {
  const raw = item.raw || {};

  return {
    ...raw,
    Category: item.category || raw.Category,
    Předmět: item.name || raw.Předmět,
    Cena: item.price?.original || raw.Cena || '',
    price: legacyPrice(item.price, raw.price),
    Dostupnost: item.availability || raw.Dostupnost || '',
    Váha: item.weight?.label || item.weight?.original || raw.Váha || '–',
    Suroviny: item.craft?.materials || raw.Suroviny || raw.Materiál || '',
    Čas: item.craft?.time || raw.Čas || '',
    Talent: item.craft?.talent || raw.Talent || raw['Talent/nářadí'] || '',
    Nářadí: item.craft?.tools || raw.Nářadí || '',
    Účinek: item.effect || raw.Účinek || raw.Efekt || '',
    Efekt: item.effect || raw.Efekt || '',
    Poznámky: item.notes || raw.Poznámky || '',
    Vlastnosti: item.combat?.properties || raw.Vlastnosti || '',
    Ruce: item.combat?.hands || raw.Ruce || '',
    Bonus: item.combat?.bonus || raw.Bonus || '',
    Zranění: item.combat?.damage || raw.Zranění || '',
    Zbroj: item.combat?.armor || raw.Zbroj || '',
  };
}

function groupApiItems(items = []) {
  const grouped = Object.fromEntries(CATEGORY_ORDER.map((category) => [category, []]));

  for (const item of items) {
    const legacyItem = legacyItemFromApi(item);
    const category = legacyItem.Category || 'Zboží';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(legacyItem);
  }

  return grouped;
}

function createCatalogFromApi(payload, extra = {}) {
  const itemsByCategory = groupApiItems(payload.items);

  return {
    source: 'api',
    isLoading: false,
    isImporting: false,
    error: null,
    actionError: null,
    generatedAt: payload.generatedAt || null,
    itemsByCategory,
    allItems: buildAllItems(itemsByCategory),
    talents: payload.talents || TALENTS_DATA,
    spells: payload.spells || SPELLS_DATA,
    professions: payload.professions || [],
    report: payload.report || null,
    latestRun: payload.latestRun || null,
    importHistory: payload.importHistory || [],
    ...extra,
  };
}

const CatalogContext = createContext(createFallbackCatalog());

export function CatalogProvider({ children }) {
  const [state, setState] = useState(() => createFallbackCatalog({ isLoading: true }));

  const loadCatalog = useCallback(async ({ signal, fallbackOnError = false } = {}) => {
    setState((current) => ({ ...current, isLoading: true, error: null, actionError: null }));

    try {
      const response = await fetch(BOOTSTRAP_ENDPOINT, { signal });
      if (!response.ok) throw new Error(`Catalog API returned ${response.status}`);
      const payload = await response.json();
      const nextState = createCatalogFromApi(payload);
      setState(nextState);
      return nextState;
    } catch (error) {
      if (error.name === 'AbortError') return null;
      if (fallbackOnError) {
        const fallback = createFallbackCatalog({ error: error.message });
        setState(fallback);
        return fallback;
      }
      setState((current) => ({ ...current, isLoading: false, error: error.message }));
      throw error;
    }
  }, []);

  const refreshCatalog = useCallback(() => loadCatalog({ fallbackOnError: false }), [loadCatalog]);

  const runImport = useCallback(async () => {
    setState((current) => ({ ...current, isImporting: true, actionError: null }));

    try {
      const response = await fetch(IMPORT_ENDPOINT, { method: 'POST' });
      if (!response.ok) throw new Error(`Catalog import returned ${response.status}`);
      await response.json();
      return await loadCatalog({ fallbackOnError: false });
    } catch (error) {
      setState((current) => ({ ...current, isImporting: false, actionError: error.message }));
      throw error;
    }
  }, [loadCatalog]);

  const runGoogleSync = useCallback(async () => {
    setState((current) => ({ ...current, isImporting: true, actionError: null }));

    try {
      const response = await fetch(GOOGLE_SYNC_ENDPOINT, { method: 'POST' });
      if (!response.ok) throw new Error(`Google sync returned ${response.status}`);
      await response.json();
      return await loadCatalog({ fallbackOnError: false });
    } catch (error) {
      setState((current) => ({ ...current, isImporting: false, actionError: error.message }));
      throw error;
    }
  }, [loadCatalog]);

  useEffect(() => {
    const controller = new AbortController();

    loadCatalog({ signal: controller.signal, fallbackOnError: true }).catch(() => {});
    return () => controller.abort();
  }, [loadCatalog]);

  const value = useMemo(() => ({
    ...state,
    refreshCatalog,
    runImport,
    runGoogleSync,
  }), [refreshCatalog, runGoogleSync, runImport, state]);

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export { CATEGORY_ORDER };
