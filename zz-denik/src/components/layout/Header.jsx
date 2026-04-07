
import React from 'react';
import { Menu, Scroll, ShoppingBag, Star, Flame, Sunrise, Sun, Sunset, Moon } from 'lucide-react';

export const TabButton = ({ label, onClick, icon: Icon, active }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-4 transition-colors ${active ? 'border-fl-primary text-fl-primary bg-fl-paper-light' : 'border-transparent text-fl-text-muted hover:text-fl-primary hover:bg-fl-paper/20'}`}
    >
        <Icon size={18} />
        <span className="font-bold uppercase tracking-widest text-xs">{label}</span>
    </button>
);

const Header = ({
    char,
    updateField,
    toggleMenu,
    isSaving,
    totalWeight,
    encumbranceLimit,
    isOverencumbered,
    currentView,
    setCurrentView
}) => {
    const timeOfDayIndex = char.timeOfDay || 0;
    const timeIcons = [Sunrise, Sun, Sunset, Moon];
    const CurrentTimeIcon = timeIcons[timeOfDayIndex];
    
    const cycleTime = () => {
        updateField('timeOfDay', (timeOfDayIndex + 1) % 4);
    };

    return (
        <header
            className="fixed top-0 left-0 right-0 bg-[var(--fl-card)] text-[var(--fl-surface)] z-40 shadow-xl border-b border-fl-primary transition-all duration-200"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}
        >
            <div className="max-w-3xl mx-auto px-4 min-h-16 h-auto py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={toggleMenu} className="p-2 hover:bg-fl-paper/20 rounded transition-colors text-fl-text-muted hover:text-fl-primary">
                        <Menu size={24} />
                    </button>

                    <div>
                        <h1 className="font-serif text-xl font-bold tracking-widest text-[var(--fl-surface)] uppercase leading-none">{char.name || 'Bezejmenný'}</h1>
                        <div className="flex items-center gap-2 text-xs text-fl-primary font-mono mt-1">
                            <span>{char.kin || 'Rasa'}</span>
                            <span>•</span>
                            <span>{char.profession || 'Povolání'}</span>
                            {isSaving && <span className="animate-pulse ml-2 text-green-500">Ukládám...</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end">
                    {/* Time Tracker */}
                    <button 
                        onClick={cycleTime}
                        className="flex flex-col items-center justify-center p-1 w-12 h-10 border rounded bg-fl-bg hover:bg-fl-surface-hover border-fl-surface-hover text-fl-primary transition-colors"
                        title="Kliknutím posunete část dne"
                    >
                        <CurrentTimeIcon size={18} />
                        <span className="text-[8px] font-bold uppercase mt-0.5 tracking-wider">
                            {['Ráno', 'Den', 'Večer', 'Noc'][timeOfDayIndex]}
                        </span>
                    </button>

                    {/* Weight Tracker */}
                    <div className={`flex flex-col items-end text-xs font-mono px-3 py-1 rounded border min-w-[70px] ${isOverencumbered ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-fl-bg border-fl-surface-hover text-fl-primary'}`}>
                        <span className="uppercase text-[9px] font-bold opacity-70">Zátěž</span>
                        <span className="font-bold text-sm tracking-wider">{totalWeight} / {encumbranceLimit}</span>
                    </div>
                </div>
            </div>

            {/* TOP NAVIGATION */}
            <div className="max-w-3xl mx-auto flex border-t border-fl-surface-hover bg-fl-bg">
                <TabButton label="Deník" icon={Scroll} active={currentView === 'sheet'} onClick={() => setCurrentView('sheet')} />
                <TabButton label="Zboží" icon={ShoppingBag} active={currentView === 'zbozi'} onClick={() => setCurrentView('zbozi')} />
                <TabButton label="Talenty" icon={Star} active={currentView === 'talents'} onClick={() => setCurrentView('talents')} />
                <TabButton label="Kouzla" icon={Flame} active={currentView === 'spells'} onClick={() => setCurrentView('spells')} />
            </div>
        </header>
    );
};

export default Header;
