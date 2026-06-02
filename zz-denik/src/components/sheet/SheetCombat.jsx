import React, { useState } from 'react';
import { Plus, Shield, Sword, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import UnequipModal from '../common/UnequipModal';
import WeightSelect from '../common/WeightSelect';

const emptyWeapon = { name: '', bonus: '', damage: '', range: '', note: '', weight: 1 };
const emptyArmor = { name: '', bonus: '', rating: '', weight: 1 };

const SheetCombat = ({ char, updateDeep, innerRef, handleAddWeaponSlot, addItemToInventory }) => {
    const [unequipRequest, setUnequipRequest] = useState(null);

    const clearArmorSlot = (key) => {
        Object.entries(emptyArmor).forEach(([field, value]) => updateDeep(key, null, field, value));
    };

    const clearWeaponSlot = (index) => {
        Object.entries(emptyWeapon).forEach(([field, value]) => updateDeep('weapons', index, field, value));
    };

    const handleStash = () => {
        if (!unequipRequest) return;
        const { current } = unequipRequest;
        if (current.name && addItemToInventory) {
            addItemToInventory({
                name: current.name,
                weight: current.weight !== undefined ? current.weight : 1,
            });
        }

        if (unequipRequest.type === 'weapon') clearWeaponSlot(unequipRequest.idx);
        else clearArmorSlot(unequipRequest.key);
        setUnequipRequest(null);
    };

    const handleDrop = () => {
        if (!unequipRequest) return;
        if (unequipRequest.type === 'weapon') clearWeaponSlot(unequipRequest.idx);
        else clearArmorSlot(unequipRequest.key);
        setUnequipRequest(null);
    };

    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Boj" icon={Sword} />

            <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                    { label: 'Zbroj', key: 'armor', icon: Shield },
                    { label: 'Helma', key: 'helmet', icon: Shield },
                    { label: 'Štít', key: 'shield', icon: Shield },
                ].map(({ label, key, icon: Icon }) => {
                    const hasItem = Boolean(char[key].name?.trim());

                    return (
                        <div key={key} className="bg-fl-paper-bright p-2 rounded border border-fl-paper relative group">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold uppercase text-fl-primary">{label}</span>
                                {hasItem ? (
                                    <button
                                        type="button"
                                        onClick={() => setUnequipRequest({ type: 'armor', key, current: char[key] })}
                                        className="text-red-500/60 hover:text-red-500 hover:bg-red-900/20 rounded p-0.5 transition-colors absolute right-1 top-1"
                                        title="Odložiť alebo zahodiť"
                                    >
                                        <Trash2 size={12} strokeWidth={2.5} />
                                    </button>
                                ) : (
                                    <Icon size={12} className="text-fl-border" />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="..."
                                className="w-full bg-transparent border-b border-fl-paper text-sm font-bold text-fl-surface mb-1 focus:outline-none placeholder:text-fl-border pt-1"
                                value={char[key].name}
                                onChange={(event) => updateDeep(key, null, 'name', event.target.value)}
                            />
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    placeholder="Bonus"
                                    className="w-1/2 text-center text-xs border-b border-fl-paper focus:outline-none placeholder:text-fl-border"
                                    value={char[key].bonus}
                                    onChange={(event) => updateDeep(key, null, 'bonus', event.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Hodnota"
                                    className="w-1/2 text-center text-xs border-b border-fl-paper focus:outline-none placeholder:text-fl-border"
                                    value={char[key].rating}
                                    onChange={(event) => updateDeep(key, null, 'rating', event.target.value)}
                                />
                            </div>
                            <div className="mt-1 flex justify-end">
                                <WeightSelect value={char[key].weight} onChange={(value) => updateDeep(key, null, 'weight', value)} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-[1fr_30px_30px_40px_1fr_auto_auto] gap-2 text-[9px] font-bold uppercase text-fl-primary px-1">
                    <span>Zbraň</span>
                    <span className="text-center">Bon</span>
                    <span className="text-center">Zran</span>
                    <span className="text-center">Rozsah</span>
                    <span>Poznámka</span>
                    <span className="text-center w-14">Váha</span>
                    <span className="w-5" />
                </div>
                {char.weapons.map((weapon, index) => {
                    const hasItem = Boolean(weapon.name?.trim());

                    return (
                        <div key={index} className="grid grid-cols-[1fr_30px_30px_40px_1fr_auto_auto] gap-1.5 items-center bg-fl-paper-bright p-1 rounded border border-fl-paper hover:border-fl-primary/50 transition-colors">
                            <input type="text" className="bg-transparent font-bold text-fl-surface w-full focus:outline-none placeholder:text-fl-border" value={weapon.name} onChange={(event) => updateDeep('weapons', index, 'name', event.target.value)} />
                            <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={weapon.bonus} onChange={(event) => updateDeep('weapons', index, 'bonus', event.target.value)} />
                            <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={weapon.damage} onChange={(event) => updateDeep('weapons', index, 'damage', event.target.value)} />
                            <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={weapon.range} onChange={(event) => updateDeep('weapons', index, 'range', event.target.value)} />
                            <input type="text" className="bg-transparent text-xs w-full focus:outline-none text-fl-text-muted placeholder:text-fl-border" value={weapon.note} onChange={(event) => updateDeep('weapons', index, 'note', event.target.value)} />
                            <WeightSelect value={weapon.weight} onChange={(value) => updateDeep('weapons', index, 'weight', value)} />
                            <div className="w-5 flex justify-center">
                                {hasItem ? (
                                    <button
                                        type="button"
                                        onClick={() => setUnequipRequest({ type: 'weapon', idx: index, current: weapon })}
                                        className="w-5 h-5 flex items-center justify-center text-red-500/60 hover:text-red-500 hover:bg-red-900/30 rounded transition-colors"
                                        title="Odložiť zbraň"
                                    >
                                        <Trash2 size={12} strokeWidth={2.5} />
                                    </button>
                                ) : (
                                    <span className="w-5" />
                                )}
                            </div>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={handleAddWeaponSlot}
                    className="w-full mt-2 py-1.5 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-xs tracking-widest rounded transition-colors flex items-center justify-center gap-2 border border-fl-primary/30"
                >
                    <Plus size={16} /> Přidat slot zbraně
                </button>
            </div>

            {unequipRequest && (
                <UnequipModal
                    itemName={unequipRequest.current.name}
                    onStash={handleStash}
                    onDrop={handleDrop}
                    onCancel={() => setUnequipRequest(null)}
                />
            )}
        </Card>
    );
};

export default SheetCombat;
