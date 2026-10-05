import React, { useState } from 'react';
import { ArrowUpRight, Backpack, Minus, Plus, Trash2, X } from 'lucide-react';
import Card from '../common/Card';
import EquipSwapModal from '../common/EquipSwapModal';
import ItemAutocomplete from '../common/ItemAutocomplete';
import SectionHeader from '../common/SectionHeader';
import WeightSelect from '../common/WeightSelect';
import { useCatalog } from '../../context/CatalogContext';
import { getWeaponRange, itemQty, maxStack, parseWeight, stackWeight } from '../../utils/items';
import AnchoredMenu, { useAnchoredMenu } from '../common/AnchoredMenu';

const weaponCategories = new Set(['Zbraně nablízko', 'Střelné zbraně', 'Zbraně na dálku']);

const isWeaponItem = (item) => weaponCategories.has(item?.Category);
const isArmorItem = (item) => item?.Category === 'Zbroj';

const getItemName = (item) => item?.Předmět || item?.name || '';

const formatWeight = (value) => String(Math.round((Number(value) || 0) * 10) / 10).replace('.', ',');

const COPPER_PER = { gold: 100, silver: 10, copper: 1 };
const COIN_COLORS = { gold: 'bg-[#FFD700]', silver: 'bg-gray-400', copper: 'bg-[#9E6649]' };

const priceToCopper = (price) => (price?.value ? price.value * (COPPER_PER[price.currency] || 0) : 0);

// Měďáky → „1 zl 2 st 5 m“ (jen nenulové mince).
const formatCoins = (copperTotal) => {
    const total = Math.round(copperTotal);
    const parts = [[Math.floor(total / 100), 'zl'], [Math.floor((total % 100) / 10), 'st'], [total % 10, 'm']]
        .filter(([amount]) => amount > 0)
        .map(([amount, unit]) => `${amount} ${unit}`);
    return parts.length ? parts.join(' ') : '0';
};

const PriceTag = ({ price }) => {
    if (!price?.value) return <span className="w-11 shrink-0" aria-hidden="true" />;
    return (
        <span className="flex w-11 shrink-0 items-center justify-end gap-1 text-xs font-bold tabular-nums text-fl-text-muted" title="Katalogová cena">
            {String(price.value).replace('.', ',')}
            <span className={`h-2.5 w-2.5 rounded-full ${COIN_COLORS[price.currency] || 'bg-gray-400'}`} aria-hidden="true" />
        </span>
    );
};

/* Počet kusů ve slotu: nenápadné „1×“, větší stoh zvýrazněný; změna v malém menu. */
const QuantityPicker = ({ item, onChange }) => {
    const menu = useAnchoredMenu();
    const qty = itemQty(item);
    const limit = maxStack(item.weight);

    return (
        <>
            <button
                type="button"
                onClick={menu.open}
                data-readonly-in-game
                aria-haspopup="dialog"
                aria-expanded={menu.isOpen}
                aria-label={`Počet kusů ${qty}, změnit`}
                className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-md px-1.5 text-xs font-bold tabular-nums transition-colors ${
                    qty > 1 ? 'bg-fl-primary/15 text-fl-primary' : 'text-fl-text-muted hover:bg-fl-paper'
                }`}
            >
                {qty}×
            </button>
            {menu.isOpen && (
                <AnchoredMenu anchorRect={menu.anchorRect} onClose={menu.close} label="Počet kusů" widthClass="w-56">
                    <div className="p-2">
                        <p className="mb-2 truncate text-xs font-bold text-fl-surface">{item.name}</p>
                        <div className="flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => onChange(qty - 1)}
                                disabled={qty <= 1}
                                aria-label="Ubrat kus"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-fl-border text-fl-primary transition-all active:scale-90 disabled:opacity-30"
                            >
                                <Minus size={16} strokeWidth={2.5} />
                            </button>
                            <span className="font-serif text-2xl font-bold tabular-nums text-fl-surface">{qty}</span>
                            <button
                                type="button"
                                onClick={() => onChange(qty + 1)}
                                disabled={qty >= limit}
                                aria-label="Přidat kus"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-fl-primary/60 bg-fl-primary/10 text-fl-primary transition-all active:scale-90 disabled:opacity-30"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                        <p className="mt-2 text-center text-[11px] text-fl-text-muted">
                            Zátěž stohu {formatWeight(stackWeight(item))} · max {limit} ks
                        </p>
                    </div>
                </AnchoredMenu>
            )}
        </>
    );
};

const SheetInventory = ({ char, updateDeep, innerRef, handleAddInventorySlot, handleRemoveInventorySlot, handleClearInventory, totalWeight = 0, encumbranceLimit = 0, addItemToInventory }) => {
    const { allItems } = useCatalog();
    const [swapRequest, setSwapRequest] = useState(null);

    const handleClearItem = (index) => {
        updateDeep('inventory', index, 'name', '');
        updateDeep('inventory', index, 'weight', 1);
        updateDeep('inventory', index, 'qty', 1);
    };

    // Ze stohu se nasazuje po jednom kusu.
    const takeOne = (index) => {
        const qty = itemQty(char.inventory[index]);
        if (qty > 1) updateDeep('inventory', index, 'qty', qty - 1);
        else handleClearItem(index);
    };

    const setQty = (index, qty) => {
        const item = char.inventory[index];
        updateDeep('inventory', index, 'qty', Math.max(1, Math.min(maxStack(item.weight), qty)));
    };

    const setWeight = (index, weight) => {
        const item = char.inventory[index];
        updateDeep('inventory', index, 'weight', weight);
        if (itemQty(item) > maxStack(weight)) updateDeep('inventory', index, 'qty', maxStack(weight));
    };

    const doEquipWeapon = (dbItem, targetIndex) => {
        updateDeep('weapons', targetIndex, 'name', getItemName(dbItem));
        updateDeep('weapons', targetIndex, 'bonus', dbItem.Bonus || '');
        updateDeep('weapons', targetIndex, 'bonusMax', dbItem.Bonus || '');
        updateDeep('weapons', targetIndex, 'damage', dbItem.Zranění || '');
        updateDeep('weapons', targetIndex, 'range', dbItem.Dosah || getWeaponRange(dbItem));
        updateDeep('weapons', targetIndex, 'note', dbItem.Vlastnosti || '');
        updateDeep('weapons', targetIndex, 'weight', dbItem.Váha !== undefined ? parseWeight(dbItem.Váha) : 1);
    };

    const doEquipArmor = (dbItem, targetSlot) => {
        updateDeep(targetSlot, null, 'name', getItemName(dbItem));
        updateDeep(targetSlot, null, 'bonus', dbItem.Bonus || '');
        updateDeep(targetSlot, null, 'rating', dbItem.Zbroj || '');
        updateDeep(targetSlot, null, 'ratingMax', dbItem.Zbroj || '');
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
                takeOne(inventoryIndex);
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
                takeOne(inventoryIndex);
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

        const swappedOut = { name: option.current.name, weight: option.current.weight !== undefined ? option.current.weight : 1 };
        if (itemQty(char.inventory[inventoryIndex]) > 1) {
            // Ze stohu ubereme kus a odložená výbava jde do volného slotu.
            takeOne(inventoryIndex);
            if (swappedOut.name?.trim()) addItemToInventory?.(swappedOut);
        } else {
            updateDeep('inventory', inventoryIndex, 'name', swappedOut.name);
            updateDeep('inventory', inventoryIndex, 'weight', swappedOut.weight);
            updateDeep('inventory', inventoryIndex, 'qty', 1);
        }

        if (option.type === 'weapon') doEquipWeapon(dbItem, option.idx);
        else doEquipArmor(dbItem, option.key);

        setSwapRequest(null);
    };

    const packWeight = char.inventory.reduce((sum, item) => sum + stackWeight(item), 0);
    const findCatalogItem = (name) => (name ? allItems.find((candidate) => candidate.Předmět === name) : null);
    const packValue = char.inventory.reduce((sum, item) => sum + priceToCopper(findCatalogItem(item.name?.trim())?.price) * itemQty(item), 0);
    const loadRatio = encumbranceLimit > 0 ? totalWeight / encumbranceLimit : 0;
    const isOverencumbered = encumbranceLimit > 0 && totalWeight > encumbranceLimit;

    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Vybavení" icon={Backpack} />
            {encumbranceLimit > 0 && (
                <div className="mb-3 rounded-xl border border-fl-border bg-fl-paper/40 p-3">
                    <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                        <span className="font-bold uppercase tracking-wide text-fl-primary">Zátěž</span>
                        <span className={`font-serif text-base font-bold tabular-nums ${isOverencumbered ? 'text-red-600 dark:text-red-400' : 'text-fl-surface'}`}>
                            {formatWeight(totalWeight)} / {encumbranceLimit}
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-fl-paper" aria-hidden="true">
                        <div
                            className={`h-full rounded-full transition-all ${isOverencumbered ? 'bg-red-600' : loadRatio > 0.8 ? 'bg-amber-500' : 'bg-fl-primary'}`}
                            style={{ width: `${Math.min(100, loadRatio * 100)}%` }}
                        />
                    </div>
                    <p className="mt-1.5 text-[11px] text-fl-text-muted">
                        Batoh {formatWeight(packWeight)} · nasazená výbava {formatWeight(Math.max(0, totalWeight - packWeight))}
                        {packValue > 0 && <> · hodnota batohu {formatCoins(packValue)}</>}
                        {isOverencumbered && <span className="font-bold text-red-600 dark:text-red-400"> · přetížení</span>}
                    </p>
                </div>
            )}
            <div className="space-y-2">
                {char.inventory.map((item, index) => {
                    const dbItem = findCatalogItem(item.name);
                    const isEquipable = isWeaponItem(dbItem) || isArmorItem(dbItem);

                    return (
                        <div key={index} className="flex items-center gap-1 rounded-lg border border-fl-border bg-fl-paper-bright p-1 transition-colors hover:border-fl-primary/50">
                            {item.name?.trim() ? (
                                <QuantityPicker item={item} onChange={(qty) => setQty(index, qty)} />
                            ) : (
                                <span className="w-9 shrink-0" aria-hidden="true" />
                            )}
                            <div className="min-w-0 flex-1">
                            <ItemAutocomplete
                                className="min-h-10 w-full bg-transparent px-2 text-sm font-bold text-fl-surface placeholder:font-normal placeholder:text-fl-text-muted focus:outline-none"
                                placeholder="Předmět..."
                                value={item.name}
                                onChange={(value) => updateDeep('inventory', index, 'name', value)}
                                onSelect={(selected) => {
                                    updateDeep('inventory', index, 'name', selected.Předmět);
                                    if (selected.Váha !== undefined) {
                                        setWeight(index, parseWeight(selected.Váha));
                                    }
                                }}
                            />
                            </div>
                            <PriceTag price={dbItem?.price} />
                            <WeightSelect value={item.weight} onChange={(value) => setWeight(index, value)} />

                            {isEquipable && (
                                <button
                                    type="button"
                                    onClick={() => handleEquip(dbItem, index)}
                                    aria-label={`Nasadit ${item.name}`}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fl-primary/10 text-fl-primary shadow-sm transition-colors hover:bg-fl-primary hover:text-white active:bg-fl-primary active:text-white"
                                    title="Nasadit"
                                >
                                    <ArrowUpRight size={15} strokeWidth={2.5} />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => handleRemoveInventorySlot(index)}
                                aria-label={`Odstranit slot ${item.name || index + 1}`}
                                className="flex h-10 w-9 shrink-0 items-center justify-center rounded-lg text-fl-text-muted transition-colors hover:bg-red-900/20 hover:text-red-700 active:bg-red-900/20"
                                title="Odstranit slot"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={handleAddInventorySlot}
                    className="min-h-12 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-[10px] tracking-widest rounded-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 border border-fl-primary/30"
                >
                    <Plus size={16} aria-hidden="true" /> Přidat slot
                </button>
                <button
                    type="button"
                    onClick={handleClearInventory}
                    disabled={!char.inventory.some(item => item.name?.trim())}
                    className="min-h-12 rounded-lg border border-red-900/30 bg-red-900/10 text-[10px] font-bold uppercase tracking-widest text-red-700 transition-all hover:bg-red-900/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400"
                >
                    <span className="flex items-center justify-center gap-2">
                        <Trash2 size={15} aria-hidden="true" /> Vyčistit vše
                    </span>
                </button>
            </div>

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
