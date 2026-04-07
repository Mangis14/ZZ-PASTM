import React from 'react';
import { Backpack, Plus, X } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import ItemAutocomplete from '../common/ItemAutocomplete';
import WeightSelect from '../common/WeightSelect';
import { parseWeight } from '../../ZboziSection';

const SheetInventory = ({ char, updateDeep, updateField, innerRef, handleAddInventorySlot }) => {
    
    const handleClearItem = (index) => {
        updateDeep('inventory', index, 'name', '');
        updateDeep('inventory', index, 'weight', 1);
    };

    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Vybavení" icon={Backpack} />
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[9px] font-bold uppercase text-fl-primary mb-2 px-1">
                <span>Předmět</span>
                <span className="text-center w-14">Váha</span>
                <span className="w-6"></span>
            </div>
            <div className="space-y-2">
                {char.inventory.map((item, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center bg-fl-paper-bright p-1 rounded border border-fl-paper hover:border-fl-primary/50 transition-colors group">
                        <ItemAutocomplete
                            className="bg-transparent font-bold text-fl-surface w-full focus:outline-none placeholder:text-fl-border px-1"
                            placeholder="Předmět..."
                            value={item.name}
                            onChange={val => updateDeep('inventory', i, 'name', val)}
                            onSelect={selected => {
                                updateDeep('inventory', i, 'name', selected.Předmět);
                                if (selected.Váha !== undefined) {
                                    updateDeep('inventory', i, 'weight', parseWeight(selected.Váha));
                                }
                            }}
                        />
                        <WeightSelect value={item.weight} onChange={(v) => updateDeep('inventory', i, 'weight', v)} />
                        
                        <button 
                            onClick={() => handleClearItem(i)}
                            className="w-6 h-6 flex items-center justify-center text-fl-border hover:text-red-700 opacity-50 group-hover:opacity-100 transition-all rounded hover:bg-red-900/30"
                            title="Odstranit předmět"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={handleAddInventorySlot}
                className="w-full mt-3 py-2 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-xs tracking-widest rounded transition-colors flex items-center justify-center gap-2 border border-fl-primary/30"
            >
                <Plus size={16} /> Přidat slot
            </button>
        </Card>
    );
};

export default SheetInventory;
