import React, { useState, useEffect } from 'react';
import { Brain, Zap, Sword, Backpack, Flame, Star, Scroll } from 'lucide-react';

export const NavButton = ({ label, onClick, icon: Icon, active, compact }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-1.5 rounded transition-all flex-shrink-0 ${compact ? 'flex-row py-1.5 px-3 min-w-0' : 'flex-col py-2 px-1 min-w-[60px]'} ${active ? 'text-white bg-fl-nav-hover shadow-sm' : 'text-fl-border dark:text-fl-text-muted hover:text-white hover:bg-fl-nav-hover'}`}
    >
        <Icon size={compact ? 14 : 18} className={compact ? "" : "mb-1"} />
        <span className={`${compact ? 'text-[10px]' : 'text-[9px]'} uppercase font-bold tracking-wider whitespace-nowrap`}>{label}</span>
    </button>
);

const Navigation = ({ scrollToSection }) => {
    const [isCompact, setIsCompact] = useState(false);
    const stopSwipePropagation = (e) => e.stopPropagation();

    useEffect(() => {
        const handleScroll = () => {
            setIsCompact(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="sticky z-40 -mx-4 px-4 bg-fl-nav border-b border-fl-primary shadow-md transition-all duration-300" style={{ top: 'calc(env(safe-area-inset-top) + 144px)' }}>
            <nav
                className={`max-w-3xl mx-auto overflow-x-auto flex gap-1 ${isCompact ? 'py-1' : 'py-2'} scrollbar-hide`}
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
