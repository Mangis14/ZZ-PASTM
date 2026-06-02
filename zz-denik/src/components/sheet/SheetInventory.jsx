import React, { useState } from 'react';
import { ArrowUpRight, Backpack, Plus, X } from 'lucide-react';
import Card from '../common/Card';
import EquipSwapModal from '../common/EquipSwapModal';
import ItemAutocomplete from '../common/ItemAutocomplete';
import SectionHeader from '../common/SectionHeader';
import WeightSelect from '../common/WeightSelect';
import { useCatalog } from '../../context/CatalogContext';
import { parseWeight } from '../../ZboziSection';

const weaponCategories = new Set(['Zbraně nablízko', 'Střelné zbraně', 'Zbraně na dálku']);

const isWeaponItem = (item) => weaponCategories.has(item?.Category);
const isArmorItem = (item) => item?.Category === 'Zbroj';

const getItemName = (item) => item?.Předmět || item?.name || '';

const SheetInventory = ({ char, updateDeep, innerRef, handleAddInventorySlot }) => {
    const { allItems } = useCatalog();
    const [swapRequest, setSwapRequest] = useState(null);

    const handleClearItem = (index) => {
        updateDeep('inventory', index, 'name', '');
        updateDeep('inventory', index, 'weight', 1);
    };

    const doEquipWeapon = (dbItem, targetIndex) => {
        const range = dbItem.Dosah || dbItem.Ruce?.match(/\((.*?)\)/)?.[1] || dbItem.Ruce || '';

        updateDeep('weapons', targetIndex, 'name', getItemName(dbItem));
        updateDeep('weapons', targetIndex, 'bonus', dbItem.Bonus || '');
        updateDeep('weapons', targetIndex, 'damage', dbItem.Zranění || '');
        updateDeep('weapons', targetIndex, 'range', range);
        updateDeep('weapons', targetIndex, 'note', dbItem.Vlastnosti || '');
        updateDeep('weapons', targetIndex, 'weight', dbItem.Váha !== undefined ? parseWeight(dbItem.Váha) : 1);
    };

    const doEquipArmor = (dbItem, targetSlot) => {
        updateDeep(targetSlot, null, 'name', getItemName(dbItem));
        updateDeep(targetSlot, null, 'bonus', dbItem.Bonus || '');
        updateDeep(targetSlot, null, 'rating', dbItem.Zbroj || '');
        updateDeep(targetSlot, null, 'weight', dbItem.Váha !== undefined ? parseWeight(dbItem.Váha) : 1);
    };

    const getArmorTargetSlot = (dbItem) => {
        const lowerName = getItemName(dbItem).toLowerCase();
        if (lowerName.includes('štít')) return 'shield';
        if (
            lowerName.includes('helma') ||
            lowerName.includes('čapka') ||
            lowerName.includes('přilbice') ||
            lowerName.includes('přilba') ||
            lowerName.includes('klobouk')
        ) {
            return 'helmet';
        }
        return 'armor';
    };

    const handleEquip = (dbItem, inventoryIndex) => {
        if (!dbItem) return;

        if (isWeaponItem(dbItem)) {
            const emptyIndex = char.weapons.findIndex((weapon) => !weapon.name?.trim());
            if (emptyIndex >= 0) {
                doEquipWeapon(dbItem, emptyIndex);
                handleClearItem(inventoryIndex);
                return;
            }

            setSwapRequest({
                dbItem,
                inventoryIndex,
                options: char.weapons.map((weapon, index) => ({ idx: index, current: weapon, type: 'weapon' })),
            });
            return;
        }

        if (isArmorItem(dbItem)) {
            const targetSlot = getArmorTargetSlot(dbItem);
            const currentInSlot = char[targetSlot];

            if (!currentInSlot.name?.trim()) {
                doEquipArmor(dbItem, targetSlot);
                handleClearItem(inventoryIndex);
                return;
            }

            setSwapRequest({
                dbItem,
                inventoryIndex,
                options: [{ key: targetSlot, current: currentInSlot, type: 'armor' }],
            });
        }
    };

    const confirmSwap = (option) => {
        if (!swapRequest) return;
        const { dbItem, inventoryIndex } = swapRequest;

        updateDeep('inventory', inventoryIndex, 'name', option.current.name);
        updateDeep('inventory', inventoryIndex, 'weight', option.current.weight !== undefined ? option.current.weight : 1);

        if (option.type === 'weapon') doEquipWeapon(dbItem, option.idx);
        else doEquipArmor(dbItem, option.key);

        setSwapRequest(null);
    };

    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Vybavení" icon={Backpack} />
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-1.5 text-[9px] font-bold uppercase text-fl-primary mb-2 px-1">
                <span>Předmět</span>
                <span className="text-center w-14">Váha</span>
                <span className="w-7" />
                <span className="w-6" />
            </div>
            <div className="space-y-2">
                {char.inventory.map((item, index) => {
                    const dbItem = item.name ? allItems.find((candidate) => candidate.Předmět === item.name) : null;
                    const isEquipable = isWeaponItem(dbItem) || isArmorItem(dbItem);

                    return (
                        <div key={index} className="grid grid-cols-[1fr_auto_auto_auto] gap-1.5 items-center bg-fl-paper-bright p-1 rounded border border-fl-paper hover:border-fl-primary/50 transition-colors group">
                            <ItemAutocomplete
                                className="bg-transparent font-bold text-fl-surface w-full focus:outline-none placeholder:text-fl-border px-1"
                                placeholder="Předmět..."
                                value={item.name}
                                onChange={(value) => updateDeep('inventory', index, 'name', value)}
                                onSelect={(selected) => {
                                    updateDeep('inventory', index, 'name', selected.Předmět);
                                    if (selected.Váha !== undefined) {
                                        updateDeep('inventory', index, 'weight', parseWeight(selected.Váha));
                                    }
                                }}
                            />
                            <WeightSelect value={item.weight} onChange={(value) => updateDeep('inventory', index, 'weight', value)} />

                            <div className="w-7 flex justify-center">
                                {isEquipable && (
                                    <button
                                        type="button"
                                        onClick={() => handleEquip(dbItem, index)}
                                        className="w-6 h-6 flex items-center justify-center text-fl-primary hover:text-fl-surface bg-fl-primary/10 hover:bg-fl-primary transition-all rounded shadow-sm"
                                        title="Nasadiť"
                                    >
                                        <ArrowUpRight size={14} strokeWidth={2.5} />
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => handleClearItem(index)}
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
                type="button"
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
