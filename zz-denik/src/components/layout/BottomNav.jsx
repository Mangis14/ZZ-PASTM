import React, { useEffect, useRef, useState } from 'react';
import { User, ShoppingBag, Sparkles, Wand2 } from 'lucide-react';

const ITEMS = [
    { key: 'sheet', label: 'Denník', icon: User },
    { key: 'zbozi', label: 'Zboží', icon: ShoppingBag },
    { key: 'talents', label: 'Talenty', icon: Sparkles },
    { key: 'spells', label: 'Kouzla', icon: Wand2 }
];

/* Pri písaní na dotykovom zariadení softvérová klávesnica zmenší
   viewport — spodná navigácia by sa lepila nad ňu a kradla miesto.
   Kým je fokus v textovom poli, lišta sa schová. */
const useKeyboardOpen = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!window.matchMedia?.('(pointer: coarse)').matches) return undefined;

        const isTextField = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
        let blurTimer;
        const onFocusIn = (event) => {
            if (!isTextField(event.target)) return;
            clearTimeout(blurTimer);
            setOpen(true);
        };
        const onFocusOut = () => {
            blurTimer = setTimeout(() => setOpen(false), 120);
        };

        document.addEventListener('focusin', onFocusIn);
        document.addEventListener('focusout', onFocusOut);
        return () => {
            document.removeEventListener('focusin', onFocusIn);
            document.removeEventListener('focusout', onFocusOut);
            clearTimeout(blurTimer);
        };
    }, []);

    return open;
};

const NavItem = ({ item, isActive, onSelect, rail = false }) => {
    const Icon = item.icon;

    return (
        <button
            type="button"
            onClick={() => onSelect?.(item.key)}
            aria-current={isActive ? 'page' : undefined}
            className={`group flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-colors active:opacity-80 ${
                rail ? 'w-full' : ''
            } ${isActive ? 'text-fl-primary' : 'text-slate-400 hover:text-fl-paper-bright'}`}
        >
            {/* M3 aktívny indikátor: pill za ikonou */}
            <span
                className={`flex h-8 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                    isActive
                        ? 'bg-fl-primary/20 shadow-[inset_0_0_0_1px_rgba(193,154,107,0.3)]'
                        : 'bg-transparent group-hover:bg-white/5 group-active:bg-white/10'
                }`}
                aria-hidden="true"
            >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            </span>
            <span className={`text-[11px] uppercase tracking-[0.14em] ${isActive ? 'font-extrabold' : 'font-bold'}`}>
                {item.label}
            </span>
        </button>
    );
};

const BottomNav = ({ activeSection, onSectionChange, hidden = false }) => {
    const keyboardOpen = useKeyboardOpen();
    const barRef = useRef(null);
    const isHidden = hidden || keyboardOpen;

    // Skutočná výška lišty → --app-bottom-nav-height (odsadenie obsahu, košíka, toastov)
    useEffect(() => {
        const element = barRef.current;
        if (!element) return undefined;

        const updateHeight = () => {
            if (element.offsetHeight > 0) {
                document.documentElement.style.setProperty('--app-bottom-nav-height', `${element.offsetHeight}px`);
            }
        };
        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Telefóny: spodná navigačná lišta */}
            <nav
                ref={barRef}
                aria-label="Hlavní navigace"
                className={`fixed inset-x-0 bottom-0 z-50 border-t border-fl-primary/30 bg-fl-nav/95 backdrop-blur-md transition-transform duration-200 ease-out md:hidden ${
                    isHidden ? 'translate-y-full' : 'translate-y-0'
                }`}
                style={{
                    paddingBottom: 'var(--safe-bottom)',
                    paddingLeft: 'var(--safe-left)',
                    paddingRight: 'var(--safe-right)'
                }}
            >
                <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1 px-2 pt-1.5 pb-1">
                    {ITEMS.map(item => (
                        <NavItem
                            key={item.key}
                            item={item}
                            isActive={activeSection === item.key}
                            onSelect={onSectionChange}
                        />
                    ))}
                </div>
            </nav>

            {/* Tablety / na šírku / foldables: navigation rail (M3) */}
            <nav
                aria-label="Hlavní navigace"
                className="fixed bottom-0 left-0 z-30 hidden w-20 flex-col items-stretch justify-center gap-2 border-r border-fl-primary/30 bg-fl-nav px-1.5 md:flex"
                style={{
                    top: 'var(--app-header-height)',
                    paddingLeft: 'max(0.375rem, var(--safe-left))',
                    paddingBottom: 'var(--safe-bottom)'
                }}
            >
                {ITEMS.map(item => (
                    <NavItem
                        key={item.key}
                        item={item}
                        isActive={activeSection === item.key}
                        onSelect={onSectionChange}
                        rail
                    />
                ))}
            </nav>
        </>
    );
};

export default BottomNav;
