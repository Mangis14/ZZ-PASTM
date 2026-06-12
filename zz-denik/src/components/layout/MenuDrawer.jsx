import React from 'react';
import { BookOpen, CloudRain, Dices, Download, Moon, Plus, Skull, Sun, Trash2, Upload, UserRound, X } from 'lucide-react';
import useDialog from '../../hooks/useDialog';

const MenuAction = ({ icon: Icon, label, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex min-h-14 w-full items-center gap-3 rounded-lg p-4 font-bold shadow-lg transition-all active:scale-[0.98] ${className}`}
    >
        <Icon size={20} className="shrink-0" /> {label}
    </button>
);

const MenuDrawer = ({
    onClose,
    isDarkMode,
    onToggleTheme,
    savedChars,
    currentCharId,
    onCreateNew,
    onLoadChar,
    onDeleteChar,
    onOpenCrit,
    onOpenDice,
    onOpenWeather,
    onOpenRules,
    onOpenData
}) => {
    const panelRef = useDialog(onClose);
    const characters = Object.values(savedChars).sort((a, b) => b.lastSaved - a.lastSaved);

    return (
        <div
            className="fixed inset-0 z-[9998] flex items-start justify-start bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Hlavní menu"
                className="h-full w-[min(22rem,calc(100vw-3.5rem))] overflow-y-auto overscroll-contain border-r border-fl-primary/40 bg-fl-nav px-5 shadow-2xl outline-none animate-in slide-in-from-left duration-300"
                style={{
                    paddingTop: 'calc(var(--safe-top) + 1.25rem)',
                    paddingBottom: 'calc(var(--safe-bottom) + 1.25rem)',
                    paddingLeft: 'max(1.25rem, var(--safe-left))'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between border-b border-fl-nav-hover pb-4">
                    <h2 className="font-serif text-2xl font-bold text-fl-paper-bright dark:text-fl-surface">Deník</h2>
                    <button
                        onClick={onClose}
                        aria-label="Zavřít menu"
                        className="flex h-12 w-12 items-center justify-center rounded-full text-fl-primary transition-colors hover:bg-fl-nav-hover hover:text-white active:bg-fl-nav-hover"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="space-y-3">
                    <MenuAction icon={Plus} label="Nová postava" onClick={onCreateNew} className="bg-fl-primary text-fl-bg hover:bg-fl-primary-hover" />
                    <MenuAction icon={Skull} label="Kritické zranění" onClick={onOpenCrit} className="border border-red-700 bg-red-900 text-fl-paper-light hover:bg-red-800" />
                    <MenuAction icon={Dices} label="Hod kostkami" onClick={onOpenDice} className="border border-fl-primary bg-fl-paper text-fl-surface hover:bg-fl-card" />
                    <MenuAction icon={CloudRain} label="Počasí" onClick={onOpenWeather} className="border border-blue-700 bg-blue-900 text-fl-paper-light hover:bg-blue-800" />
                    <MenuAction icon={BookOpen} label="Pravidla & Tahák" onClick={onOpenRules} className="border border-amber-700 bg-amber-900 text-fl-paper-light hover:bg-amber-800" />
                    <MenuAction
                        icon={isDarkMode ? Sun : Moon}
                        label={isDarkMode ? 'Světlý režim' : 'Temný režim (Dungeon)'}
                        onClick={onToggleTheme}
                        className="border border-fl-border bg-fl-bg text-fl-primary hover:bg-fl-nav-hover"
                    />
                </div>

                <div className="mb-6 mt-8 space-y-2">
                    <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-fl-text-muted">
                        Uložené postavy
                    </h3>
                    {characters.length === 0 && (
                        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-fl-nav-hover px-4 py-6 text-center">
                            <UserRound size={28} className="text-fl-nav-hover" />
                            <p className="text-sm text-fl-text-muted">Zatím žádné uložené postavy.</p>
                        </div>
                    )}
                    {characters.map(c => (
                        <div
                            key={c.id}
                            className={`flex items-center justify-between rounded-lg border transition-all ${
                                currentCharId === c.id
                                    ? 'border-fl-primary bg-fl-nav-hover text-white'
                                    : 'border-fl-nav-hover text-fl-border hover:bg-fl-nav-hover hover:text-white'
                            }`}
                        >
                            <button
                                onClick={() => onLoadChar(c.id)}
                                className="min-w-0 flex-1 p-3 text-left active:opacity-70"
                                aria-current={currentCharId === c.id ? 'true' : undefined}
                            >
                                <div className="truncate font-bold">{c.name || 'Bezejmenný'}</div>
                                <div className="truncate text-xs opacity-60">{c.kin} {c.profession}</div>
                            </button>
                            <button
                                onClick={(e) => onDeleteChar(c.id, e)}
                                aria-label={`Smazat postavu ${c.name || 'Bezejmenný'}`}
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-red-400/70 transition-colors hover:bg-red-900/40 hover:text-red-400 active:bg-red-900/40"
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-fl-nav-hover pt-6">
                    <button
                        onClick={onOpenData}
                        className="flex min-h-16 flex-col items-center justify-center gap-2 rounded-lg border border-fl-border bg-fl-bg p-3 text-fl-primary transition-colors hover:border-fl-primary hover:text-white active:scale-[0.98]"
                    >
                        <Download size={20} /> <span className="text-[11px] font-bold uppercase">Export</span>
                    </button>
                    <button
                        onClick={onOpenData}
                        className="flex min-h-16 flex-col items-center justify-center gap-2 rounded-lg border border-fl-border bg-fl-bg p-3 text-fl-primary transition-colors hover:border-fl-primary hover:text-white active:scale-[0.98]"
                    >
                        <Upload size={20} /> <span className="text-[11px] font-bold uppercase">Import</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuDrawer;
