import React, { useState } from 'react';
import { Backpack, Plus, X, ArrowUpRight } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import ItemAutocomplete, { allItems } from '../common/ItemAutocomplete';
import WeightSelect from '../common/WeightSelect';
import EquipSwapModal from '../common/EquipSwapModal';
import { parseWeight } from '../../ZboziSection';

const SheetInventory = ({ char, updateDeep, updateField, innerRef, handleAddInventorySlot }) => {
    const [swapRequest, setSwapRequest] = useState(null);

    const handleClearItem = (index) => {
        updateDeep('inventory', index, 'name', '');
        updateDeep('inventory', index, 'weight', 1);
    };

    const doEquipWeapon = (dbItem, invIdx, targetIdx) => {
        const nameFallback = dbItem.Předmět || '';
        const rangeStr = dbItem.Dosah || dbItem.Ruce?.match(/\((.*?)\)/)?.[1] || dbItem.Ruce || '';
        
        updateDeep('weapons', targetIdx, 'name', nameFallback);
        updateDeep('weapons', targetIdx, 'bonus', dbItem.Bonus || '');
        updateDeep('weapons', targetIdx, 'damage', dbItem.Zranění || '');
        updateDeep('weapons', targetIdx, 'range', rangeStr);
        updateDeep('weapons', targetIdx, 'note', dbItem.Vlastnosti || '');
        if (dbItem.Váha !== undefined) updateDeep('weapons', targetIdx, 'weight', parseWeight(dbItem.Váha));
    };

    const doEquipArmor = (dbItem, invIdx, targetSlot) => {
        const nameFallback = dbItem.Předmět || '';
        updateDeep(targetSlot, null, 'name', nameFallback);
        updateDeep(targetSlot, null, 'rating', dbItem.Zbroj || '');
        if (dbItem.Váha !== undefined) updateDeep(targetSlot, null, 'weight', parseWeight(dbItem.Váha));
    };

    const handleEquip = (dbItem, invIdx) => {
        if (!dbItem) return;
        
        if (dbItem.Category === 'Zbraně nablízko' || dbItem.Category === 'Zbraně na dálku') {
            const emptyIdx = char.weapons.findIndex(w => !w.name || w.name.trim() === '');
            
            if (emptyIdx >= 0) {
                // Free spot exists -> Just equip and remove from inv
                doEquipWeapon(dbItem, invIdx, emptyIdx);
                handleClearItem(invIdx);
            } else {
                // All full -> Prompt swap
                const options = char.weapons.map((w, idx) => ({ idx, current: w, type: 'weapon' }));
                setSwapRequest({ dbItem, invIdx, options });
            }
        } else if (dbItem.Category === 'Zbroj') {
            const nameLower = (dbItem.Předmět || '').toLowerCase();
            let targetSlot = 'armor';
            if (nameLower.includes('štít')) targetSlot = 'shield';
            else if (nameLower.includes('helma') || nameLower.includes('čapka') || nameLower.includes('přilbice') || nameLower.includes('přilba') || nameLower.includes('klobouk')) targetSlot = 'helmet';

            const currentInSlot = char[targetSlot];
            if (!currentInSlot.name || currentInSlot.name.trim() === '') {
                // Free spot
                doEquipArmor(dbItem, invIdx, targetSlot);
                handleClearItem(invIdx);
            } else {
                // Full spot -> Swap
                const options = [{ key: targetSlot, current: currentInSlot, type: 'armor' }];
                setSwapRequest({ dbItem, invIdx, options });
            }
        }
    };

    const confirmSwap = (opt) => {
        const { dbItem, invIdx } = swapRequest;
        
        // 1. Move current equipped item back to the exact inventory slot
        updateDeep('inventory', invIdx, 'name', opt.current.name);
        updateDeep('inventory', invIdx, 'weight', opt.current.weight !== undefined ? opt.current.weight : 1);

        // 2. Equip new item
        if (opt.type === 'weapon') {
            doEquipWeapon(dbItem, invIdx, opt.idx);
        } else {
            doEquipArmor(dbItem, invIdx, opt.key);
        }

        setSwapRequest(null);
    };

    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Vybavení" icon={Backpack} />
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-1.5 text-[9px] font-bold uppercase text-fl-primary mb-2 px-1">
                <span>Předmět</span>
                <span className="text-center w-14">Váha</span>
                <span className="w-7"></span>
                <span className="w-6"></span>
            </div>
            <div className="space-y-2">
                {char.inventory.map((item, i) => {
                    const dbItem = item.name ? allItems.find(x => x.Předmět === item.name) : null;
                    const isEquipable = dbItem && (dbItem.Category === 'Zbraně nablízko' || dbItem.Category === 'Zbraně na dálku' || dbItem.Category === 'Zbroj');

                    return (
                        <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-1.5 items-center bg-fl-paper-bright p-1 rounded border border-fl-paper hover:border-fl-primary/50 transition-colors group">
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
                            
                            <div className="w-7 flex justify-center">
                                {isEquipable && (
                                    <button 
                                        onClick={() => handleEquip(dbItem, i)}
                                        className="w-6 h-6 flex items-center justify-center text-fl-primary hover:text-fl-surface bg-fl-primary/10 hover:bg-fl-primary transition-all rounded shadow-sm"
                                        title="Nasadiť do boja"
                                    >
                                        <ArrowUpRight size={14} strokeWidth={2.5} />
                                    </button>
                                )}
                            </div>

                            <button 
                                onClick={() => handleClearItem(i)}
                                className="w-6 h-6 flex items-center justify-center text-fl-border hover:text-red-700 opacity-50 group-hover:opacity-100 transition-all rounded hover:bg-red-900/30"
                                title="Odstranit předmět"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={handleAddInventorySlot}
                className="w-full mt-3 py-2 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-xs tracking-widest rounded transition-colors flex items-center justify-center gap-2 border border-fl-primary/30"
            >
                <Plus size={16} /> Přidat slot
            </button>

            {swapRequest && (
                <EquipSwapModal
                    itemData={swapRequest.dbItem}
                    slotType={swapRequest.options[0].type}
                    options={swapRequest.options}
                    onConfirm={confirmSwap}
                    onCancel={() => setSwapRequest(null)}
                />
            )}
        </Card>
    );
};

export default SheetInventory;
