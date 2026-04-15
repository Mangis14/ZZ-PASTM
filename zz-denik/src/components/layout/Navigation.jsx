import React, { useState, useEffect } from 'react';
import { Brain, Zap, Sword, Backpack, Flame, Star, Scroll } from 'lucide-react';

export const NavButton = ({ label, onClick, icon: Icon, active, compact }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center rounded transition-all duration-300 ease-out flex-shrink-0 min-w-[64px] overflow-hidden ${compact ? 'py-1.5 px-1' : 'py-2 px-1'} ${active ? 'text-white bg-fl-nav-hover shadow-md' : 'text-fl-border dark:text-fl-text-muted hover:text-white hover:bg-fl-nav-hover'}`}
    >
        <div className="flex h-6 w-full items-center justify-center">
            <Icon className={`transition-all duration-300 ease-out ${compact ? 'w-5 h-5 opacity-90' : 'w-5 h-5 opacity-100'}`} />
        </div>
        <div className={`transition-all duration-300 ease-out overflow-hidden flex items-center justify-center ${compact ? 'max-h-0 opacity-0' : 'max-h-4 opacity-100 mt-1'}`}>
            <span className={`uppercase font-bold tracking-widest whitespace-nowrap text-[9px] leading-none`}>
                {label}
            </span>
        </div>
    </button>
);

const Navigation = ({ scrollToSection }) => {
    const [isCompact, setIsCompact] = useState(false);
    const stopSwipePropagation = (e) => e.stopPropagation();

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentY = window.scrollY;
                    if (currentY < 20) {
                        setIsCompact(false);
                    } else if (currentY > lastScrollY + 15) {
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
        <div
            data-sheet-nav
            className={`sticky z-40 -mx-4 px-4 bg-fl-nav border-b border-fl-primary transition-all duration-300 ease-out shadow-lg`}
            style={{ top: 'calc(env(safe-area-inset-top, 0px) + 86px)' }}
        >
            <nav
                className={`max-w-3xl mx-auto overflow-x-auto flex gap-1 ${isCompact ? 'py-1' : 'py-1.5'} scrollbar-hide transition-all duration-300 ease-out`}
                onTouchStart={stopSwipePropagation}
                onTouchMove={stopSwipePropagation}
            >
                <NavButton compact={isCompact} label="Vlastnosti" onClick={() => scrollToSection('attributes')} icon={Brain} />
                <NavButton compact={isCompact} label="Dovednosti" onClick={() => scrollToSection('skills')} icon={Zap} />
                <NavButton compact={isCompact} label="Boj" onClick={() => scrollToSection('combat')} icon={Sword} />
                <NavButton compact={isCompact} label="Vybavení" onClick={() => scrollToSection('inventory')} icon={Backpack} />
                <NavButton compact={isCompact} label="Zdroje" onClick={() => scrollToSection('consumables')} icon={Flame} />
                <NavButton compact={isCompact} label="Talenty" onClick={() => scrollToSection('talents')} icon={Star} />
                <NavButton compact={isCompact} label="Poznámky" onClick={() => scrollToSection('notes')} icon={Scroll} />
            </nav>
        </div>
    );
};

export default Navigation;
