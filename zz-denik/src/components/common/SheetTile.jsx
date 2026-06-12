import React, { createContext, useContext } from 'react';
import { ChevronDown, GripVertical } from 'lucide-react';

const SheetTileContext = createContext(false);

export const useSheetTile = () => useContext(SheetTileContext);

const SheetTile = ({ tileId, order, title, icon: Icon, summary, collapsed, onToggle, innerRef, children, tone = 'default', customizing = false, isDragging = false, dragHandleProps = {} }) => {
    const toneClasses = {
        default: 'border-fl-paper',
        warning: 'border-amber-700/40',
        danger: 'border-red-900/50'
    };
    const iconToneClasses = {
        default: 'bg-fl-paper text-fl-primary',
        warning: 'bg-amber-900/10 text-amber-700 dark:text-amber-400',
        danger: 'bg-red-900/10 text-red-700 dark:text-red-400'
    };

    return (
        <section
            ref={innerRef}
            data-sheet-tile-id={tileId}
            style={{ order }}
            className={`overflow-hidden rounded-lg border bg-fl-card shadow-[2px_2px_0px_0px_rgba(139,115,85,0.15)] transition-all ${toneClasses[tone] || toneClasses.default} ${isDragging ? 'scale-[0.98] opacity-60 ring-2 ring-fl-primary' : ''}`}
        >
            <div className="flex items-center">
                {customizing && (
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label={`Přesunout dlaždici ${title}`}
                        className="ml-2 flex h-12 w-8 shrink-0 touch-none cursor-grab items-center justify-center rounded-md text-fl-primary active:cursor-grabbing active:bg-fl-paper"
                        {...dragHandleProps}
                    >
                        <GripVertical size={19} />
                    </div>
                )}
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex min-h-14 min-w-0 flex-1 items-center gap-3 p-4 text-left transition-colors hover:bg-fl-paper/40 active:bg-fl-paper/60"
                    aria-expanded={!collapsed}
                >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconToneClasses[tone] || iconToneClasses.default}`} aria-hidden="true">
                    {Icon && <Icon size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-base font-bold uppercase tracking-wider text-fl-surface">{title}</h2>
                    {summary && (
                        <div className="mt-1 text-xs font-medium leading-tight text-fl-text-muted">{summary}</div>
                    )}
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-fl-border text-fl-primary" aria-hidden="true">
                    <ChevronDown size={16} className={`transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
                </div>
                </button>
            </div>

            {!collapsed && (
                <div className="sheet-tile-content border-t border-fl-primary/20 p-4 animate-in fade-in duration-200">
                    <SheetTileContext.Provider value>
                        {children}
                    </SheetTileContext.Provider>
                </div>
            )}
        </section>
    );
};

export default SheetTile;
