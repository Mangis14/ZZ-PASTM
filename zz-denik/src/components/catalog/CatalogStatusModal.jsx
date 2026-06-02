import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Database, History, Minus, Plus, RefreshCw, Server, X } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

const formatDate = (value) => {
    if (!value) return 'Statická data';
    return new Intl.DateTimeFormat('cs-CZ', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
};

const CountTile = ({ label, value }) => (
    <div className="bg-fl-paper-bright border border-fl-paper rounded p-2">
        <div className="text-[9px] uppercase tracking-wider text-fl-text-muted font-bold">{label}</div>
        <div className="text-lg font-serif font-bold text-fl-surface">{value}</div>
    </div>
);

const changeGroups = [
    { key: 'items', label: 'Zboží' },
    { key: 'talents', label: 'Talenty' },
    { key: 'professions', label: 'Povolání' },
    { key: 'spells', label: 'Kouzla' },
];

const detailGroups = [
    { key: 'items', label: 'Zboží' },
    { key: 'generalTalents', label: 'General talenty' },
    { key: 'professionTalents', label: 'Profession talenty' },
    { key: 'professions', label: 'Povolání' },
    { key: 'spells', label: 'Kouzla' },
];

const changeTypeMeta = {
    added: { label: 'Pridané', className: 'text-green-800 bg-green-950/10 border-green-900/30', icon: Plus },
    changed: { label: 'Zmenené', className: 'text-fl-surface-hover bg-fl-paper-bright border-fl-paper', icon: RefreshCw },
    removed: { label: 'Odstránené', className: 'text-red-800 bg-red-950/10 border-red-900/30', icon: Minus },
};

const triggerLabels = {
    'google-sync': 'Google Sync',
    'manual-import': 'Ručný import',
    'local-import': 'Lokálny import',
    'auto-bootstrap': 'Auto import',
};

const collectChangeExamples = (diff) => {
    if (!diff?.details) return [];
    const examples = [];

    for (const group of detailGroups) {
        const details = diff.details[group.key];
        if (!details) continue;

        for (const type of ['added', 'changed', 'removed']) {
            for (const entry of details[type] || []) {
                examples.push({
                    ...entry,
                    type,
                    area: group.label,
                });
            }
        }
    }

    return examples.slice(0, 6);
};

const DiffSummaryTile = ({ label, summary }) => (
    <div className="border border-fl-paper bg-fl-paper-bright rounded p-2 min-w-0">
        <div className="text-[9px] uppercase tracking-wider text-fl-text-muted font-bold truncate">{label}</div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-fl-surface">
            <span className="font-bold text-green-800">+{summary?.added || 0}</span>
            <span className="font-bold text-fl-surface-hover">~{summary?.changed || 0}</span>
            <span className="font-bold text-red-800">-{summary?.removed || 0}</span>
        </div>
    </div>
);

const ChangePreviewRow = ({ change }) => {
    const meta = changeTypeMeta[change.type];
    const Icon = meta.icon;
    const fieldText = change.fields?.length ? ` - ${change.fields.join(', ')}` : '';

    return (
        <div className={`flex items-start gap-2 rounded border p-2 text-xs ${meta.className}`}>
            <Icon size={14} className="shrink-0 mt-0.5" />
            <div className="min-w-0">
                <div className="font-bold uppercase text-[9px] tracking-wider">{meta.label} - {change.area}</div>
                <div className="truncate">
                    {change.name}
                    {change.group ? ` (${change.group})` : ''}
                    {fieldText}
                </div>
            </div>
        </div>
    );
};

const CatalogStatusModal = ({ onClose }) => {
    const catalog = useCatalog();

    const spellCount = useMemo(
        () => Object.values(catalog.spells || {}).reduce((sum, spells) => sum + spells.length, 0),
        [catalog.spells]
    );
    const sourceInfo = catalog.report?.sourceInfo;
    const warnings = catalog.report?.warnings || [];
    const errors = catalog.report?.errors || [];
    const isBusy = catalog.isLoading || catalog.isImporting;
    const latestRun = catalog.latestRun;
    const changeExamples = useMemo(() => collectChangeExamples(latestRun?.diff), [latestRun]);
    const totalChanges = latestRun?.diff?.totalChanges || 0;

    const handleRefresh = async () => {
        try {
            await catalog.refreshCatalog();
        } catch {
            // Error state is stored in the catalog provider.
        }
    };

    const handleImport = async () => {
        try {
            await catalog.runImport();
        } catch {
            // Error state is stored in the catalog provider.
        }
    };

    const handleGoogleSync = async () => {
        try {
            await catalog.runGoogleSync();
        } catch {
            // Error state is stored in the catalog provider.
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-fl-card w-full max-w-lg max-h-[86vh] overflow-hidden rounded-lg shadow-2xl border border-fl-primary" onClick={event => event.stopPropagation()}>
                <div className="p-4 bg-fl-nav border-b border-fl-primary flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-fl-primary text-white flex items-center justify-center">
                            <Database size={20} />
                        </div>
                        <div>
                            <h2 className="font-serif text-xl font-bold text-white">Katalog dat</h2>
                            <div className="text-[10px] uppercase tracking-wider text-fl-primary">
                                {catalog.source === 'api' ? 'Backend API' : 'Statický fallback'}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-fl-primary hover:text-fl-paper-light transition-colors">
                        <X size={22} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[calc(86vh-74px)] space-y-4">
                    <div className="flex items-center justify-between gap-3 bg-fl-paper-bright border border-fl-paper rounded p-3">
                        <div className="flex items-center gap-2 min-w-0">
                            {catalog.source === 'api' ? (
                                <CheckCircle2 size={18} className="text-green-700 shrink-0" />
                            ) : (
                                <Server size={18} className="text-fl-primary shrink-0" />
                            )}
                            <div className="min-w-0">
                                <div className="text-xs font-bold uppercase text-fl-surface">
                                    {catalog.source === 'api' ? 'Online katalog' : 'Offline katalog'}
                                </div>
                                <div className="text-[11px] text-fl-text-muted truncate">{formatDate(catalog.generatedAt)}</div>
                                {sourceInfo?.type && (
                                    <div className="text-[10px] uppercase tracking-wider text-fl-primary">
                                        Zdroj: {sourceInfo.type === 'google' ? 'Google Drive' : 'Lokálne súbory'}
                                    </div>
                                )}
                            </div>
                        </div>
                        {(catalog.error || catalog.actionError) && (
                            <div className="text-[10px] text-red-700 text-right max-w-[45%]">
                                {catalog.actionError || catalog.error}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <CountTile label="Zboží" value={catalog.allItems.length} />
                        <CountTile label="Talenty" value={(catalog.talents.general || []).length + (catalog.talents.profession || []).length} />
                        <CountTile label="Povolání" value={catalog.professions.length || '–'} />
                        <CountTile label="Kouzla" value={spellCount} />
                    </div>

                    {latestRun && (
                        <div className="space-y-3 bg-fl-paper-bright border border-fl-paper rounded p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2 min-w-0">
                                    <History size={17} className="text-fl-primary shrink-0 mt-0.5" />
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold uppercase text-fl-surface">Posledný import</div>
                                        <div className="text-[11px] text-fl-text-muted truncate">
                                            {triggerLabels[latestRun.trigger] || latestRun.trigger} - {formatDate(latestRun.generatedAt)}
                                        </div>
                                        {latestRun.syncSummary && (
                                            <div className="text-[10px] uppercase tracking-wider text-fl-primary">
                                                {latestRun.syncSummary.downloadCount} súborov z Google Drive
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="font-serif text-lg font-bold text-fl-surface">{totalChanges}</div>
                                    <div className="text-[9px] uppercase tracking-wider text-fl-text-muted font-bold">
                                        {totalChanges === 1 ? 'zmena' : 'zmien'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {changeGroups.map((group) => (
                                    <DiffSummaryTile
                                        key={group.key}
                                        label={group.label}
                                        summary={latestRun.diff?.summary?.[group.key]}
                                    />
                                ))}
                            </div>

                            {changeExamples.length > 0 ? (
                                <div className="space-y-2">
                                    {changeExamples.map((change) => (
                                        <ChangePreviewRow key={`${change.type}-${change.area}-${change.key}`} change={change} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-fl-text-muted border border-fl-paper rounded p-2">
                                    Žiadne zmeny oproti predchádzajúcemu snapshotu.
                                </div>
                            )}
                        </div>
                    )}

                    {(warnings.length > 0 || errors.length > 0) && (
                        <div className="space-y-2">
                            {errors.map((error, index) => (
                                <div key={`error-${index}`} className="flex gap-2 text-xs bg-red-950/10 border border-red-900/30 text-red-800 rounded p-2">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            ))}
                            {warnings.map((warning, index) => (
                                <div key={`warning-${index}`} className="flex gap-2 text-xs bg-fl-paper-bright border border-fl-paper text-fl-surface-hover rounded p-2">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5 text-fl-primary" />
                                    <span>{warning}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isBusy}
                            className="py-3 rounded bg-fl-paper text-fl-primary hover:bg-fl-border disabled:opacity-50 disabled:cursor-not-allowed border border-fl-border font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors"
                        >
                            <RefreshCw size={15} className={catalog.isLoading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <button
                            type="button"
                            onClick={handleImport}
                            disabled={isBusy}
                            className="py-3 rounded bg-fl-primary text-white hover:bg-fl-primary-hover disabled:opacity-50 disabled:cursor-not-allowed border border-fl-primary-hover font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors"
                        >
                            <Database size={15} className={catalog.isImporting ? 'animate-pulse' : ''} />
                            Import
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleSync}
                            disabled={isBusy}
                            className="py-3 rounded bg-fl-nav text-white hover:bg-fl-nav-hover disabled:opacity-50 disabled:cursor-not-allowed border border-fl-nav-hover font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors"
                        >
                            <Server size={15} className={catalog.isImporting ? 'animate-pulse' : ''} />
                            Google Sync
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogStatusModal;
