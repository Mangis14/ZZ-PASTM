import React from 'react';
import { User, ShoppingBag, Sparkles, Wand2 } from 'lucide-react';

const ITEMS = [
    { key: 'sheet', label: 'Denník', icon: User },
    { key: 'zbozi', label: 'Zboží', icon: ShoppingBag },
    { key: 'talents', label: 'Talenty', icon: Sparkles },
    { key: 'spells', label: 'Kouzla', icon: Wand2 }
];

const BottomNav = ({ activeSection, onSectionChange }) => {
    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t border-fl-primary/30 bg-slate-950/85 backdrop-blur-md"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1 px-2 pt-2">
                {ITEMS.map(({ key, label, icon: Icon }) => {
                    const isActive = activeSection === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSectionChange?.(key)}
                            className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition-all ${
                                isActive
                                    ? 'bg-fl-primary/18 text-fl-primary shadow-[inset_0_0_0_1px_rgba(193,154,107,0.35)]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-fl-paper-bright'
                            }`}
                            aria-pressed={isActive}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
