import React, { useState, useEffect } from 'react';
import { X, Download, Upload, Share2, Copy, Database, User, ClipboardCheck } from 'lucide-react';

export default function DataManagementModal({
    char,
    savedChars,
    onClose,
    onImportAll,
    onImportSingle,
    showToast
}) {
    const [activeTab, setActiveTab] = useState('single'); // 'single' | 'bulk'
    const [importText, setImportText] = useState('');
    const [canShare, setCanShare] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);
    const [copiedSingle, setCopiedSingle] = useState(false);

    useEffect(() => {
        if (navigator.share) {
            setCanShare(true);
        }
    }, []);

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

    const handleDownloadFile = (text, filename) => {
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Soubor stažen");
    };

    const processImportText = (text, type) => {
        if (!text.trim()) {
            alert("Vložte text zálohy!");
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
                    alert("Neplatný formát postavy (chybí jméno)!");
                    return;
                }
                onImportSingle(parsed);
            }
            setImportText('');
        } catch (err) {
            alert("Chyba při zpracování JSON dat: " + err.message);
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4"
            style={{
                paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)'
            }}
        >
            <div
                className="bg-fl-card w-full max-w-lg rounded-lg border-2 border-fl-primary shadow-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 1.5rem)' }}
            >
                {/* Header */}
                <div className="p-4 border-b border-fl-border bg-fl-card flex justify-between items-center">
                    <h3 className="min-w-0 text-lg sm:text-xl font-serif font-bold text-fl-primary flex items-center gap-2 leading-tight">
                        <Database size={20} /> Správa dat postavy
                    </h3>
                    <button onClick={onClose} className="text-fl-primary hover:text-white p-1">
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
                <div className="min-h-0 flex-1 overflow-y-auto space-y-6 p-4 pb-6 sm:p-5">
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
                                            onClick={() => {
                                                if (window.confirm("Opravdu chcete PŘEPSAT VŠECHNY postavy v tomto zařízení? Tato akce je nevratná!")) {
                                                    processImportText(importText, 'all');
                                                }
                                            }}
                                            className="w-full py-2 bg-red-900 text-white font-bold rounded hover:bg-red-800 transition-colors text-xs uppercase"
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
