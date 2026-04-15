import React, { useState } from 'react';
import { Sword, Shield, Plus, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import WeightSelect from '../common/WeightSelect';
import UnequipModal from '../common/UnequipModal';

const SheetCombat = ({ char, updateDeep, innerRef, handleAddWeaponSlot, addItemToInventory }) => {
    const [unequipReq, setUnequipReq] = useState(null);

    const clearArmorSlot = (key) => {
        updateDeep(key, null, 'name', '');
        updateDeep(key, null, 'bonus', '');
        updateDeep(key, null, 'rating', '');
        updateDeep(key, null, 'weight', 1);
    };

    const clearWeaponSlot = (idx) => {
        updateDeep('weapons', idx, 'name', '');
        updateDeep('weapons', idx, 'bonus', '');
        updateDeep('weapons', idx, 'damage', '');
        updateDeep('weapons', idx, 'range', '');
        updateDeep('weapons', idx, 'note', '');
        updateDeep('weapons', idx, 'weight', 1);
    };

    const handleStash = () => {
        if (!unequipReq) return;
        const { current } = unequipReq;
        if (addItemToInventory && current.name) {
            addItemToInventory({ name: current.name, weight: current.weight !== undefined ? current.weight : 1 });
        }
        
        if (unequipReq.type === 'weapon') clearWeaponSlot(unequipReq.idx);
        else clearArmorSlot(unequipReq.key);
        
        setUnequipReq(null);
    };

    const handleDrop = () => {
        if (!unequipReq) return;
        if (unequipReq.type === 'weapon') clearWeaponSlot(unequipReq.idx);
        else clearArmorSlot(unequipReq.key);
        
        setUnequipReq(null);
    };
    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Boj" icon={Sword} />

            {/* ARMOR */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                    { label: 'Zbroj', key: 'armor', icon: Shield },
                    { label: 'Helma', key: 'helmet', icon: Shield },
                    { label: 'Štít', key: 'shield', icon: Shield }
                ].map(({ label, key, icon: Icon }) => {
                    const hasItem = !!(char[key].name && char[key].name.trim());
                    return (
                        <div key={key} className="bg-fl-paper-bright p-2 rounded border border-fl-paper relative group">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold uppercase text-fl-primary">{label}</span>
                                {hasItem ? (
                                    <button 
                                        onClick={() => setUnequipReq({ type: 'armor', key, current: char[key] })}
                                        className="text-red-500/50 hover:text-red-500 hover:bg-red-900/20 rounded p-0.5 transition-colors absolute right-1 top-1"
                                        title="Zahodiť / Odložiť"
                                    >
                                        <Trash2 size={12} strokeWidth={2.5}/>
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
                                onChange={e => updateDeep(key, null, 'name', e.target.value)}
                            />
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    placeholder="Bonus"
                                    className="w-1/2 text-center text-xs border-b border-fl-paper focus:outline-none placeholder:text-fl-border"
                                    value={char[key].bonus}
                                    onChange={e => updateDeep(key, null, 'bonus', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Hodnota"
                                    className="w-1/2 text-center text-xs border-b border-fl-paper focus:outline-none placeholder:text-fl-border"
                                    value={char[key].rating}
                                    onChange={e => updateDeep(key, null, 'rating', e.target.value)}
                                />
                            </div>
                            <div className="mt-1 flex justify-end">
                                <WeightSelect value={char[key].weight} onChange={(v) => updateDeep(key, null, 'weight', v)} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* WEAPONS */}
            <div className="space-y-2">
                <div className="grid grid-cols-[1fr_30px_30px_40px_1fr_auto_auto] gap-2 text-[9px] font-bold uppercase text-fl-primary px-1">
                    <span>Zbraň</span>
                    <span className="text-center">Bon</span>
                    <span className="text-center">Zran</span>
                    <span className="text-center">Rozsah</span>
                    <span>Poznámka</span>
                    <span className="text-center w-14">Váha</span>
                    <span className="w-5"></span>
                </div>
                {char.weapons.map((w, i) => {
                    const hasItem = !!(w.name && w.name.trim());
                    return (
                        <div key={i} className="grid grid-cols-[1fr_30px_30px_40px_1fr_auto_auto] gap-1.5 items-center bg-fl-paper-bright p-1 rounded border border-fl-paper hover:border-fl-primary/50 transition-colors">
                            <input type="text" className="bg-transparent font-bold text-fl-surface w-full focus:outline-none placeholder:text-fl-border" value={w.name} onChange={e => updateDeep('weapons', i, 'name', e.target.value)} />
                            <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={w.bonus} onChange={e => updateDeep('weapons', i, 'bonus', e.target.value)} />
                            <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={w.damage} onChange={e => updateDeep('weapons', i, 'damage', e.target.value)} />
                            <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={w.range} onChange={e => updateDeep('weapons', i, 'range', e.target.value)} />
                            <input type="text" className="bg-transparent text-xs w-full focus:outline-none text-fl-text-muted placeholder:text-fl-border" value={w.note} onChange={e => updateDeep('weapons', i, 'note', e.target.value)} />
                            <WeightSelect value={w.weight} onChange={(v) => updateDeep('weapons', i, 'weight', v)} />
                            <div className="w-5 flex justify-center">
                                {hasItem ? (
                                    <button 
                                        onClick={() => setUnequipReq({ type: 'weapon', idx: i, current: w })} 
                                        className="w-5 h-5 flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-900/30 rounded transition-colors" 
                                        title="Odložiť zbraň"
                                    >
                                        <Trash2 size={12} strokeWidth={2.5}/>
                                    </button>
                                ) : <span className="w-5"></span>}
                            </div>
                        </div>
                    );
                })}
                
                <button
                    onClick={handleAddWeaponSlot}
                    className="w-full mt-2 py-1.5 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-xs tracking-widest rounded transition-colors flex items-center justify-center gap-2 border border-fl-primary/30"
                >
                    <Plus size={16} /> Přidat slot zbraně
                </button>
            </div>

            {unequipReq && (
                <UnequipModal
                    itemName={unequipReq.current.name}
                    onStash={handleStash}
                    onDrop={handleDrop}
                    onCancel={() => setUnequipReq(null)}
                />
            )}
        </Card>
    );
};

export default SheetCombat;
