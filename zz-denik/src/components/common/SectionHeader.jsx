import React from 'react';
import { useSheetTile } from './SheetTile';

const SectionHeader = ({ title, icon: Icon }) => {
    const embedded = useSheetTile();
    if (embedded) return null;

    return (
        <div className="flex items-center gap-3 mb-4 border-b-2 border-fl-primary/30 pb-2">
            <div className="p-1.5 bg-fl-paper rounded text-fl-primary">
                {Icon && <Icon size={18} />}
            </div>
            <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-fl-surface">{title}</h2>
        </div>
    );
};

export default SectionHeader;
