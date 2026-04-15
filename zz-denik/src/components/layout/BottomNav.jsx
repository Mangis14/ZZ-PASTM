import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Sparkles, Wand2 } from 'lucide-react';

const ITEMS = [
    { key: 'sheet', label: 'Denník', icon: User },
    { key: 'zbozi', label: 'Zboží', icon: ShoppingBag },
    { key: 'talents', label: 'Talenty', icon: Sparkles },
    { key: 'spells', label: 'Kouzla', icon: Wand2 }
];

const BottomNav = ({ activeSection, onSectionChange }) => {
    const [isCompact, setIsCompact] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentY = window.scrollY;
                    if (currentY > lastScrollY + 15) {
                        setIsCompact(true);
                    } else if (currentY < lastScrollY - 20) {
                        setIsCompact(false);
                    }
                    lastScrollY = currentY > 0 ? currentY : 0;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t border-fl-primary/30 bg-slate-950/85 backdrop-blur-md sm:hidden transition-all duration-300"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className={`mx-auto grid max-w-3xl grid-cols-4 gap-1 px-2 pt-2 pb-2 transition-all duration-300 ${isCompact ? 'min-h-[50px]' : 'min-h-[68px]'}`}>
                {ITEMS.map(({ key, label, icon: Icon }) => {
                    const isActive = activeSection === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSectionChange?.(key)}
                            className={`flex flex-col items-center justify-center rounded-2xl px-2 transition-all duration-300 overflow-hidden ${
                                isActive
                                    ? 'bg-fl-primary/18 text-fl-primary shadow-[inset_0_0_0_1px_rgba(193,154,107,0.35)]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-fl-paper-bright'
                            }`}
                            aria-pressed={isActive}
                        >
                            <div className="flex h-10 w-full items-center justify-center">
                                <Icon size={isActive && isCompact ? 24 : 20} strokeWidth={isActive ? 2.4 : 2} className="transition-all duration-300" />
                            </div>
                            <div className={`transition-all duration-300 ease-out overflow-hidden flex items-center justify-center ${isCompact ? 'max-h-0 opacity-0 mb-0' : 'max-h-5 opacity-100 mb-1'}`}>
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] leading-none whitespace-nowrap">
                                    {label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
