import React, { useState } from 'react';
import { X, BookOpen, Swords, Activity, Map, Award, AlertTriangle, Shield, Clock } from 'lucide-react';
import useDialog from '../hooks/useDialog';

const TABS = [
    { id: 'combat', label: 'Boj', icon: Swords },
    { id: 'conditions', label: 'Stavy', icon: Activity },
    { id: 'journey', label: 'Cesta', icon: Map },
    { id: 'skills', label: 'Dovednosti', icon: Award }
];

export default function RulesReferenceModal({ onClose }) {
    const panelRef = useDialog(onClose);
    const [activeTab, setActiveTab] = useState('combat'); // 'combat' | 'conditions' | 'journey' | 'skills'

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-200 sm:items-center sm:p-4"
            style={{ paddingTop: 'calc(var(--safe-top) + 1rem)' }}
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Pravidla a tahák"
                className="relative bg-fl-card w-full max-w-lg rounded-t-3xl border-2 border-b-0 border-fl-primary shadow-2xl flex flex-col h-[92dvh] max-h-full overflow-hidden outline-none animate-in fade-in slide-in-from-bottom-8 duration-300 sm:h-[85dvh] sm:rounded-2xl sm:border-b-2 sm:slide-in-from-bottom-0 sm:zoom-in-95 sm:duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-fl-border sm:hidden" aria-hidden="true" />
                {/* Header */}
                <div className="p-4 pt-5 sm:pt-4 border-b border-fl-border bg-fl-card flex justify-between items-center">
                    <h3 className="text-xl font-serif font-bold text-fl-primary flex items-center gap-2">
                        <BookOpen size={20} aria-hidden="true" /> Pravidla & Tahák
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Zavřít"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fl-primary transition-colors hover:bg-fl-paper active:bg-fl-paper"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-fl-border bg-fl-paper-light overflow-x-auto scrollbar-hide" role="tablist" aria-label="Kapitoly pravidel">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            role="tab"
                            aria-selected={activeTab === id}
                            className={`min-h-12 flex-1 min-w-[80px] py-2.5 text-[11px] uppercase font-bold tracking-wider transition-colors border-b-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 active:bg-fl-paper ${
                                activeTab === id
                                    ? 'border-fl-primary text-fl-primary bg-fl-paper'
                                    : 'border-transparent text-fl-text-muted hover:text-fl-primary'
                            }`}
                        >
                            <Icon size={14} aria-hidden="true" /> {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 overflow-y-auto overscroll-contain space-y-6">
                    {activeTab === 'combat' && (
                        /* COMBAT RULES */
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-fl-primary flex items-center gap-2">
                                    <Swords size={16} /> Akce v kole
                                </h4>
                                <p className="text-xs text-fl-text-muted">
                                    V každém kole boje máš k dispozici **1 Pomalou akci** a **1 Rychlou akci** (nebo 2 Rychlé).
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-2">
                                    <h5 className="text-xs font-bold uppercase tracking-wide text-red-800 dark:text-red-400">
                                        Pomalé akce (1 AP)
                                    </h5>
                                    <ul className="text-xs space-y-1.5 list-disc list-inside text-fl-surface">
                                        <li><span className="font-bold">Plný útok:</span> Útok zblízka (Melee).</li>
                                        <li><span className="font-bold">Střela:</span> Útok na dálku (Marksmanship).</li>
                                        <li><span className="font-bold">Kouzlení:</span> Seslání kouzla (Spell).</li>
                                        <li><span className="font-bold">První pomoc:</span> Ošetření (Healing).</li>
                                        <li><span className="font-bold">Útěk z boje:</span> Vyžaduje hod na Pohyb.</li>
                                        <li><span className="font-bold">Aktivní obrana:</span> Příprava na kryt/úskok.</li>
                                    </ul>
                                </div>

                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-2">
                                    <h5 className="text-xs font-bold uppercase tracking-wide text-green-800 dark:text-green-400">
                                        Rychlé akce (1 AP)
                                    </h5>
                                    <ul className="text-xs space-y-1.5 list-disc list-inside text-fl-surface">
                                        <li><span className="font-bold">Pohyb:</span> V zóně nebo mezi zónami.</li>
                                        <li><span className="font-bold">Tasení/výměna:</span> Zbraně či štítu.</li>
                                        <li><span className="font-bold">Kryt (Parry):</span> Reakce na útok zblízka.</li>
                                        <li><span className="font-bold">Úskok (Dodge):</span> Reakce na útok.</li>
                                        <li><span className="font-bold">Zacílení:</span> +1 k příštímu hodu na Střelu.</li>
                                        <li><span className="font-bold">Vstání ze země:</span> Z polohy vleže.</li>
                                        <li><span className="font-bold">Aktivace talentu:</span> Dle popisu talentu.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="h-px bg-fl-border/40" />

                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-fl-primary flex items-center gap-2">
                                    <Shield size={16} /> Vzdálenostní zóny
                                </h4>
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between border-b border-fl-border/30 pb-1">
                                        <span className="font-bold text-fl-surface">Rvačka (Arm's Length)</span>
                                        <span className="text-fl-text-muted">Bezprostřední dotyk (0-2 m)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-fl-border/30 pb-1">
                                        <span className="font-bold text-fl-surface">Blízká (Near)</span>
                                        <span className="text-fl-text-muted">Pár kroků, pohyb jako rychlá akce (2-5 m)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-fl-border/30 pb-1">
                                        <span className="font-bold text-fl-surface">Krátká (Short)</span>
                                        <span className="text-fl-text-muted">Dosah hodu zbraní, pohyb jako pomalá akce</span>
                                    </div>
                                    <div className="flex justify-between border-b border-fl-border/30 pb-1">
                                        <span className="font-bold text-fl-surface">Dlouhá (Long)</span>
                                        <span className="text-fl-text-muted">Dosah luku/střelby (do 100 m)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-fl-border/30 pb-1">
                                        <span className="font-bold text-fl-surface">Extrémní (Extreme)</span>
                                        <span className="text-fl-text-muted">Dohled (více než 100 m)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'conditions' && (
                        /* CONDITIONS RULES */
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-fl-primary flex items-center gap-2">
                                    <Activity size={16} /> Stavy a jejich penalizace
                                </h4>
                                <p className="text-xs text-fl-text-muted">
                                    Stavy brání přirozené regeneraci a mohou vést k poškození vlastností.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {/* Hungry */}
                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded flex gap-3">
                                    <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-bold uppercase text-fl-surface">Hladový (Hungry)</h5>
                                        <p className="text-[11px] text-fl-text-muted leading-relaxed">
                                            Nemůžeš regenerovat **Sílu** (ani odpočinkem). Každý den o půlnoci utržíš **1 poškození Síly**. K odstranění stavu musíš sníst 1 porci jídla.
                                        </p>
                                    </div>
                                </div>

                                {/* Thirsty */}
                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded flex gap-3">
                                    <AlertTriangle className="text-blue-600 dark:text-blue-400 shrink-0" size={18} />
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-bold uppercase text-fl-surface">Žíznivý (Thirsty)</h5>
                                        <p className="text-[11px] text-fl-text-muted leading-relaxed">
                                            Nemůžeš regenerovat **Sílu ani Obratnost**. Každý den o půlnoci utržíš **1 poškození Síly**. Pokud Síla klesne na 0, umíráš. K odstranění musíš vypít 1 porci vody.
                                        </p>
                                    </div>
                                </div>

                                {/* Sleepy */}
                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded flex gap-3">
                                    <AlertTriangle className="text-purple-600 dark:text-purple-400 shrink-0" size={18} />
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-bold uppercase text-fl-surface">Nevyspalý (Sleepy)</h5>
                                        <p className="text-[11px] text-fl-text-muted leading-relaxed">
                                            Nemůžeš regenerovat **Rozum ani Empatii**. Každý den o půlnoci utržíš **1 poškození Rozumu**. Pokud Rozum klesne na 0, staneš se zlomeným. K odstranění musíš nepřerušeně spát aspoň čtvrtinu dne.
                                        </p>
                                    </div>
                                </div>

                                {/* Cold */}
                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded flex gap-3">
                                    <AlertTriangle className="text-cyan-600 dark:text-cyan-400 shrink-0" size={18} />
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-bold uppercase text-fl-surface">Prochladlý (Cold)</h5>
                                        <p className="text-[11px] text-fl-text-muted leading-relaxed">
                                            Nemůžeš regenerovat **žádné vlastnosti**. Každou čtvrtinu dne si musíš hodit na **Přežití (Survival)**. Při neúspěchu utržíš **1 poškození Síly a 1 poškození Rozumu**. K odstranění se musíš zahřát u ohně/v přístřešku.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'journey' && (
                        /* JOURNEY RULES */
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-fl-primary flex items-center gap-2">
                                    <Map size={16} /> Aktivity na cestách
                                </h4>
                                <p className="text-xs text-fl-text-muted">
                                    Den se dělí na **4 čtvrtiny dne** (Ráno, Den, Večer, Noc). V každé z nich může postava vykonat jednu aktivitu.
                                </p>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-1">
                                    <div className="font-bold text-fl-surface uppercase text-[11px]">Pochod (March)</div>
                                    <p className="text-fl-text-muted text-[11px] leading-relaxed">
                                        Přesun na mapě do nového hexu. Navigátor hází na **Navigování (Přežití)**. Neúspěch = družina zabloudí nebo se zdrží. Pochod dvě čtvrtiny za sebou vede k únavě.
                                    </p>
                                </div>

                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-1">
                                    <div className="font-bold text-fl-surface uppercase text-[11px]">Stavba tábora (Make Camp)</div>
                                    <p className="text-fl-text-muted text-[11px] leading-relaxed">
                                        Provádí se před nocováním. Hod na **Přežití (Survival)**. Neúspěch = tábor je chladný a vlhký, postavy nemohou bezpečně odpočívat a prochladnou.
                                    </p>
                                </div>

                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-1">
                                    <div className="font-bold text-fl-surface uppercase text-[11px]">Hlídka (Camp Security)</div>
                                    <p className="text-fl-text-muted text-[11px] leading-relaxed">
                                        Zajištění bezpečí v táboře během spánku ostatních. Hod na **Ostražitost (Scouting)** k detekování případného nočního přepadení.
                                    </p>
                                </div>

                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-1">
                                    <div className="font-bold text-fl-surface uppercase text-[11px]">Lov / Sběr (Hunt / Forage)</div>
                                    <p className="text-fl-text-muted text-[11px] leading-relaxed">
                                        Získávání jídla, vody či léčivých bylin v divočině. Hod na **Přežití (Survival)**.
                                    </p>
                                </div>

                                <div className="h-px bg-fl-border/40 my-2" />

                                <div className="p-3 bg-fl-paper/40 border border-fl-border rounded flex gap-3">
                                    <Clock className="text-fl-primary shrink-0" size={18} />
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-bold uppercase text-fl-surface">Odpočinek a Spánek</h5>
                                        <p className="text-[11px] text-fl-text-muted leading-relaxed">
                                            **Odpočinek (Rest)** trvá 1 čtvrtinu dne, regeneruje všechny vlastnosti (pokud postava není hladová/žíznivá/prochladlá). **Spánek (Sleep)** je nutný 1x za 24 hodin, jinak postava získá stav *Nevyspalý*.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        /* SKILLS AND ATTRIBUTES MAP */
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-fl-primary flex items-center gap-2">
                                    <Award size={16} /> Dovednosti a Vlastnosti
                                </h4>
                                <p className="text-xs text-fl-text-muted">
                                    Každá dovednost je spjata s jednou z hlavních vlastností postavy.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-1">
                                        <div className="font-bold text-red-800 dark:text-red-400 uppercase text-[11px]">Síla (Strength)</div>
                                        <ul className="list-disc list-inside text-fl-text-muted space-y-1">
                                            <li>Vytrvalost (Endurance)</li>
                                            <li>Síla (Might)</li>
                                            <li>Boj zblízka (Melee)</li>
                                            <li>Řemeslo (Crafting)</li>
                                        </ul>
                                    </div>

                                    <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-1">
                                        <div className="font-bold text-green-800 dark:text-green-400 uppercase text-[11px]">Obratnost (Agility)</div>
                                        <ul className="list-disc list-inside text-fl-text-muted space-y-1">
                                            <li>Plížení (Stealth)</li>
                                            <li>Obratnost rukou (Sleight of H.)</li>
                                            <li>Pohyb (Move)</li>
                                            <li>Střelba (Marksmanship)</li>
                                        </ul>
                                    </div>

                                    <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-1">
                                        <div className="font-bold text-blue-800 dark:text-blue-400 uppercase text-[11px]">Rozum (Wits)</div>
                                        <ul className="list-disc list-inside text-fl-text-muted space-y-1">
                                            <li>Ostražitost (Scouting)</li>
                                            <li>Historie (Lore)</li>
                                            <li>Přežití (Survival)</li>
                                            <li>Vhled (Insight)</li>
                                        </ul>
                                    </div>

                                    <div className="p-3 bg-fl-paper/40 border border-fl-border rounded space-y-1">
                                        <div className="font-bold text-purple-800 dark:text-purple-400 uppercase text-[11px]">Empatie (Empathy)</div>
                                        <ul className="list-disc list-inside text-fl-text-muted space-y-1">
                                            <li>Manipulace (Manipulation)</li>
                                            <li>Vystupování (Performance)</li>
                                            <li>Léčení (Healing)</li>
                                            <li>Práce se zvířaty (Animal H.)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="p-3 border-t border-fl-border bg-fl-paper flex justify-end"
                    style={{ paddingBottom: 'max(0.75rem, var(--safe-bottom))' }}
                >
                    <button
                        onClick={onClose}
                        className="min-h-12 px-6 bg-fl-primary text-fl-bg font-bold rounded-full hover:bg-fl-primary-hover active:scale-[0.97] transition-all text-xs uppercase"
                    >
                        Zavřít tahák
                    </button>
                </div>
            </div>
        </div>
    );
}
