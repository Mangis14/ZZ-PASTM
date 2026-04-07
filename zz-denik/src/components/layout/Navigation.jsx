
import React from 'react';
import { Brain, Zap, Sword, Backpack, Flame, Star, Scroll } from 'lucide-react';

export const NavButton = ({ label, onClick, icon: Icon, active }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center min-w-[60px] p-2 rounded transition-colors ${active ? 'text-white bg-fl-surface-hover' : 'text-fl-paper hover:text-white hover:bg-fl-surface-hover'}`}
    >
        <Icon size={18} className="mb-1" />
        <span className="text-[9px] uppercase font-bold tracking-wider">{label}</span>
    </button>
);

const Navigation = ({ scrollToSection }) => {
    return (
        <nav className="max-w-3xl mx-auto px-2 overflow-x-auto flex gap-1 py-2 scrollbar-hide bg-fl-surface border-b border-fl-primary sticky z-30 shadow-md" style={{ top: 'calc(env(safe-area-inset-top) + 136px)' }}>
            <NavButton label="Vlastnosti" onClick={() => scrollToSection('attributes')} icon={Brain} />
            <NavButton label="Dovednosti" onClick={() => scrollToSection('skills')} icon={Zap} />
            <NavButton label="Boj" onClick={() => scrollToSection('combat')} icon={Sword} />
            <NavButton label="Vybavení" onClick={() => scrollToSection('inventory')} icon={Backpack} />
            <NavButton label="Zdroje" onClick={() => scrollToSection('consumables')} icon={Flame} />
            <NavButton label="Talenty" onClick={() => scrollToSection('talents')} icon={Star} />
            <NavButton label="Poznámky" onClick={() => scrollToSection('notes')} icon={Scroll} />
        </nav>
    );
};

export default Navigation;
