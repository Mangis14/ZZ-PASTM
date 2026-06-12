import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { X, Download, Upload, Share2, Copy, Database, User, ClipboardCheck } from 'lucide-react';
import useDialog from '../hooks/useDialog';
import { confirmAction } from './common/ConfirmDialog';

export default function DataManagementModal({
    char,
    savedChars,
    onClose,
    onImportAll,
    onImportSingle,
    showToast
}) {
    const panelRef = useDialog(onClose);
    const [activeTab, setActiveTab] = useState('single'); // 'single' | 'bulk'
    const [importText, setImportText] = useState('');
    const [canShare, setCanShare] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);
    const [copiedSingle, setCopiedSingle] = useState(false);
    const isNativeApp = Capacitor.isNativePlatform();

    useEffect(() => {
        if (isNativeApp || navigator.share) {
            setCanShare(true);
        }
    }, [isNativeApp]);

    const handleCopyText = async (text, setCopiedFlag) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedFlag(true);
            showToast("Zkopírováno do schránky!");
            setTimeout(() => setCopiedFlag(false), 2000);
        } catch (err) {
            showToast("Kopírování selhalo!");
        }
    };

    const handleShare = async (title, text, filename) => {
        try {
            if (isNativeApp) {
                await Share.share({
                    title,
                    text,
                    dialogTitle: 'Sdílet zálohu'
                });

                showToast("Zdieľanie dokončené");
                return;
            }

            // We can share either plain text or try to construct a Shareable File if supported
            const file = new File([text], filename, { type: 'application/json' });
            
            // Web Share API file sharing check
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: title,
                    text: 'Záloha dat deníku Zapovězené Země'
                });
            } else {
                // Fallback to text sharing if file sharing is not supported by device
                await navigator.share({
                    title: title,
                    text: text
                });
            }
            showToast("Zdieľanie dokončené");
        } catch (err) {
            if (err.name !== 'AbortError') {
                showToast("Sdílení selhalo!");
                console.error(err);
            }
        }
    };

    const handleDownloadFile = async (text, filename) => {
        try {
            if (isNativeApp) {
                await Share.share({
                    title: filename,
                    text,
                    dialogTitle: `Uložit nebo sdílet ${filename}`
                });
                return;
            }

            const blob = new Blob([text], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Soubor stažen");
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error(err);
                try {
                    await navigator.clipboard.writeText(text);
                    showToast("Sdílení selhalo, záloha je zkopírovaná.");
                } catch {
                    showToast("Export selhal. Zkuste Kopírovat text.");
                }
            }
        }
    };

    const processImportText = (text, type) => {
        if (!text.trim()) {
            showToast("Vložte text zálohy!", 'error');
            return;
        }

        try {
            const parsed = JSON.parse(text);
            if (type === 'all') {
                // Validate that it looks like a database of characters (object key-value or array)
                if (typeof parsed !== 'object' || parsed === null) {
                    throw new Error("Neplatný formát databáze");
                }
                onImportAll(parsed);
            } else {
                // Validate single character structure
                if (!parsed.name) {
                    showToast("Neplatný formát postavy (chybí jméno)!", 'error');
                    return;
                }
                onImportSingle(parsed);
            }
            setImportText('');
        } catch (err) {
            showToast("Chyba při zpracování JSON dat: " + err.message, 'error');
        }
    };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            processImportText(event.target.result, type);
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    };

    // Prepare JSON strings
    const allDataStr = JSON.stringify(savedChars, null, 2);
    const singleDataStr = JSON.stringify(char, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-end justify-center animate-in fade-in duration-200 sm:items-center sm:p-4"
            style={{ paddingTop: 'calc(var(--safe-top) + 0.75rem)' }}
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Správa dat postavy"
                className="relative bg-fl-card w-full max-w-lg rounded-t-3xl border-2 border-b-0 border-fl-primary shadow-2xl flex flex-col overflow-hidden outline-none animate-in fade-in slide-in-from-bottom-8 duration-300 sm:rounded-2xl sm:border-b-2 sm:slide-in-from-bottom-0 sm:zoom-in-95 sm:duration-200"
                style={{ maxHeight: 'calc(100dvh - var(--safe-top) - 1.5rem)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-fl-border sm:hidden" aria-hidden="true" />
                {/* Header */}
                <div className="p-4 pt-5 sm:pt-4 border-b border-fl-border bg-fl-card flex justify-between items-center">
                    <h3 className="min-w-0 text-lg sm:text-xl font-serif font-bold text-fl-primary flex items-center gap-2 leading-tight">
                        <Database size={20} aria-hidden="true" /> Správa dat postavy
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Zavřít"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fl-primary transition-colors hover:bg-fl-paper hover:text-fl-primary-hover active:bg-fl-paper"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-fl-border bg-fl-paper-light">
                    <button
                        onClick={() => setActiveTab('single')}
                        className={`min-w-0 flex-1 px-2 py-3 text-[11px] sm:text-xs uppercase font-bold tracking-wider leading-tight whitespace-normal transition-colors border-b-2 flex items-center justify-center gap-2 ${
                            activeTab === 'single'
                                ? 'border-fl-primary text-fl-primary bg-fl-paper'
                                : 'border-transparent text-fl-text-muted hover:text-fl-primary'
                        }`}
                    >
                        <User size={14} /> Aktuální postava ({char.name || 'Bezejmenný'})
                    </button>
                    <button
                        onClick={() => setActiveTab('bulk')}
                        className={`min-w-0 flex-1 px-2 py-3 text-[11px] sm:text-xs uppercase font-bold tracking-wider leading-tight whitespace-normal transition-colors border-b-2 flex items-center justify-center gap-2 ${
                            activeTab === 'bulk'
                                ? 'border-fl-primary text-fl-primary bg-fl-paper'
                                : 'border-transparent text-fl-text-muted hover:text-fl-primary'
                        }`}
                    >
                        <Database size={14} /> Celá záloha ({Object.keys(savedChars).length} postav)
                    </button>
                </div>

                {/* Content */}
                <div
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain space-y-6 p-4 pb-6 sm:p-5"
                    style={{ paddingBottom: 'max(1.5rem, var(--safe-bottom))' }}
                >
                    {activeTab === 'single' ? (
                        /* SINGLE CHARACTER ACTIONS */
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-fl-primary">
                                    Exportovat postavu "{char.name || 'Bezejmenný'}"
                                </h4>
                                <p className="text-xs text-fl-text-muted">
                                    Uložte nebo nasdílejte data pouze této vybrané postavy. Vhodné pro přenos k vypravěči (GM).
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                                    <button
                                        onClick={() => handleDownloadFile(singleDataStr, `fl_char_${(char.name || 'bezejmenny').toLowerCase().replace(/\s+/g, '_')}_${dateStr}.json`)}
                                        className="flex items-center justify-center gap-2 p-2.5 bg-fl-paper border border-fl-border rounded hover:border-fl-primary text-fl-primary hover:text-white transition-colors text-xs font-bold uppercase"
                                    >
                                        <Download size={16} /> Stáhnout soubor
                                    </button>
                                    
                                    {canShare && (
                                        <button
                                            onClick={() => handleShare(`Postava ${char.name}`, singleDataStr, `fl_char_${(char.name || 'bezejmenny').toLowerCase().replace(/\s+/g, '_')}.json`)}
                                            className="flex items-center justify-center gap-2 p-2.5 bg-fl-primary text-fl-bg rounded hover:bg-fl-primary-hover transition-colors text-xs font-bold uppercase"
                                        >
                                            <Share2 size={16} /> Zdieľať / Odeslat
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleCopyText(singleDataStr, setCopiedSingle)}
                                        className="flex items-center justify-center gap-2 p-2.5 bg-fl-paper border border-fl-border rounded hover:border-fl-primary text-fl-primary hover:text-white transition-colors text-xs font-bold uppercase"
                                    >
                                        {copiedSingle ? <ClipboardCheck size={16} /> : <Copy size={16} />}
                                        {copiedSingle ? 'Zkopírováno' : 'Kopírovat text'}
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-fl-border/40" />

                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-fl-primary">
                                    Importovat novou postavu
                                </h4>
                                <p className="text-xs text-fl-text-muted font-bold text-amber-800 dark:text-amber-400">
                                    Tato akce postavu PŘIDÁ do vašeho seznamu. Žádné stávající postavy nebudou smazány.
                                </p>
                                
                                <div className="space-y-3 pt-2">
                                    {/* File upload */}
                                    <label className="flex items-center justify-center gap-2 p-3 bg-fl-paper-light border border-dashed border-fl-primary/50 rounded hover:border-fl-primary cursor-pointer transition-colors text-xs font-bold uppercase text-fl-primary hover:text-white">
                                        <Upload size={16} /> Vybrat JSON soubor postavy
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".json"
                                            onChange={(e) => handleFileUpload(e, 'single')}
                                        />
                                    </label>

                                    {/* Textarea paste */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase text-fl-text-muted">
                                            Nebo vložte text JSON zálohy postavy:
                                        </label>
                                        <textarea
                                            value={importText}
                                            onChange={(e) => setImportText(e.target.value)}
                                            placeholder='Vložte sem kód začínající na {"id": ...}'
                                            rows={4}
                                            className="w-full p-2 text-xs font-mono rounded border border-fl-border bg-fl-paper-bright text-fl-surface focus:outline-none focus:border-fl-primary"
                                        />
                                        <button
                                            onClick={() => processImportText(importText, 'single')}
                                            className="w-full py-2 bg-fl-primary text-fl-bg font-bold rounded hover:bg-fl-primary-hover transition-colors text-xs uppercase"
                                        >
                                            Naimportovat ze schránky
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* BULK DATABASE ACTIONS */
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-fl-primary">
                                    Kompletní záloha (Všechny postavy)
                                </h4>
                                <p className="text-xs text-fl-text-muted">
                                    Vygeneruje soubor obsahující kompletní databázi všech vašich uložených postav.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                                    <button
                                        onClick={() => handleDownloadFile(allDataStr, `fl_backup_all_${dateStr}.json`)}
                                        className="flex items-center justify-center gap-2 p-2.5 bg-fl-paper border border-fl-border rounded hover:border-fl-primary text-fl-primary hover:text-white transition-colors text-xs font-bold uppercase"
                                    >
                                        <Download size={16} /> Stáhnout soubor
                                    </button>

                                    {canShare && (
                                        <button
                                            onClick={() => handleShare('Záloha všech postav', allDataStr, `fl_backup_all_${dateStr}.json`)}
                                            className="flex items-center justify-center gap-2 p-2.5 bg-fl-primary text-fl-bg rounded hover:bg-fl-primary-hover transition-colors text-xs font-bold uppercase"
                                        >
                                            <Share2 size={16} /> Zdieľať / Odeslat
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleCopyText(allDataStr, setCopiedAll)}
                                        className="flex items-center justify-center gap-2 p-2.5 bg-fl-paper border border-fl-border rounded hover:border-fl-primary text-fl-primary hover:text-white transition-colors text-xs font-bold uppercase"
                                    >
                                        {copiedAll ? <ClipboardCheck size={16} /> : <Copy size={16} />}
                                        {copiedAll ? 'Zkopírováno' : 'Kopírovat text'}
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-fl-border/40" />

                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-red-800 dark:text-red-400">
                                    Kompletní obnova (Přepsat vše)
                                </h4>
                                <p className="text-xs text-fl-text-muted">
                                    <span className="font-bold text-red-700 dark:text-red-400 uppercase">Varování:</span> Tato akce smazat všechny stávající postavy v zařízení a nahradí je daty z importu.
                                </p>

                                <div className="space-y-3 pt-2">
                                    {/* File upload */}
                                    <label className="flex items-center justify-center gap-2 p-3 bg-red-900/10 border border-dashed border-red-700/50 rounded hover:border-red-700 cursor-pointer transition-colors text-xs font-bold uppercase text-red-800 dark:text-red-400 hover:bg-red-900/20">
                                        <Upload size={16} /> Nahrát soubor zálohy a přepsat vše
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".json"
                                            onChange={(e) => handleFileUpload(e, 'all')}
                                        />
                                    </label>

                                    {/* Textarea paste */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase text-fl-text-muted">
                                            Nebo vložte kompletní JSON text zálohy:
                                        </label>
                                        <textarea
                                            value={importText}
                                            onChange={(e) => setImportText(e.target.value)}
                                            placeholder='Vložte sem kód kompletní zálohy...'
                                            rows={4}
                                            className="w-full p-2 text-xs font-mono rounded border border-fl-border bg-fl-paper-bright text-fl-surface focus:outline-none focus:border-fl-primary"
                                        />
                                        <button
                                            onClick={async () => {
                                                const confirmed = await confirmAction({
                                                    title: 'Přepsat všechny postavy?',
                                                    message: 'Všechny stávající postavy v tomto zařízení budou nahrazeny daty ze zálohy. Tato akce je nevratná.',
                                                    confirmLabel: 'Přepsat vše',
                                                    danger: true
                                                });
                                                if (confirmed) processImportText(importText, 'all');
                                            }}
                                            className="w-full min-h-12 bg-red-900 text-white font-bold rounded-lg hover:bg-red-800 active:scale-[0.99] transition-all text-xs uppercase"
                                        >
                                            Obnovit celou zálohu (Přepsat)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
