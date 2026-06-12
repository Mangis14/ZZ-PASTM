import React from 'react';
import { PawPrint, Plus, X } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import WeightSelect from '../common/WeightSelect';
import ItemAutocomplete from '../common/ItemAutocomplete';
import { parseWeight } from '../../utils/items';
import { confirmAction } from '../common/ConfirmDialog';

const SheetMounts = ({ char, updateField }) => {
    const mounts = char.mounts || [];

    const handleAddMount = () => {
        const newArr = [...mounts, { name: '', type: 'Kůň', encumbranceLimit: 10, inventory: Array(5).fill({ name: '', weight: 1 }) }];
        updateField('mounts', newArr);
    };

    const handleRemoveMount = async (index) => {
        const confirmed = await confirmAction({
            title: `Propustit ${mounts[index]?.name || 'zvíře/sluhu'}?`,
            message: 'Všechny předměty v jeho nákladu zmizí.',
            confirmLabel: 'Propustit',
            danger: true
        });
        if (!confirmed) return;
        const newArr = [...mounts];
        newArr.splice(index, 1);
        updateField('mounts', newArr);
    };

    const updateMount = (mountIndex, field, value) => {
        const newArr = [...mounts];
        newArr[mountIndex] = { ...newArr[mountIndex], [field]: value };
        updateField('mounts', newArr);
    };

    const updateMountItem = (mountIndex, itemIndex, field, value) => {
        const newArr = [...mounts];
        const newInv = [...newArr[mountIndex].inventory];
        newInv[itemIndex] = { ...newInv[itemIndex], [field]: value };
        newArr[mountIndex].inventory = newInv;
        updateField('mounts', newArr);
    };

    const handleAddMountItem = (mountIndex) => {
        const newArr = [...mounts];
        newArr[mountIndex].inventory = [...newArr[mountIndex].inventory, { name: '', weight: 1 }];
        updateField('mounts', newArr);
    };

    const handleClearMountItem = (mountIndex, itemIndex) => {
        updateMountItem(mountIndex, itemIndex, 'name', '');
        updateMountItem(mountIndex, itemIndex, 'weight', 1);
    };

    if (mounts.length === 0) {
        return (
            <Card>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-fl-primary opacity-60">
                        <PawPrint size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Žádná zvířata / Sluhové</span>
                    </div>
                    <button onClick={handleAddMount} aria-label="Přidat zvíře" className="flex h-11 w-11 items-center justify-center border border-fl-border rounded-lg text-fl-primary hover:bg-fl-paper active:bg-fl-paper transition-colors" title="Přidat zvíře">
                        <Plus size={16} />
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <SectionHeader title="Jízdní zvířata a Sluhové" icon={PawPrint} />
                <button onClick={handleAddMount} aria-label="Přidat další zvíře" className="flex h-11 w-11 items-center justify-center border border-fl-border rounded-lg text-fl-primary hover:bg-fl-paper active:bg-fl-paper transition-colors shadow-sm bg-fl-paper-bright" title="Přidat další">
                    <Plus size={16} />
                </button>
            </div>
            
            <div className="space-y-6">
                {mounts.map((mount, mountIdx) => {
                    // Calculate mount weight
                    let w = 0;
                    (mount.inventory || []).forEach(i => { if (i.name) w += (i.weight || 0); });
                    const overencumbered = w > mount.encumbranceLimit;

                    return (
                        <div key={mountIdx} className="border-2 border-fl-primary/30 rounded p-3 bg-fl-bg shadow-inner relative">
                            <button
                                onClick={() => handleRemoveMount(mountIdx)}
                                aria-label="Propustit zvíře"
                                className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-lg text-fl-primary transition-colors hover:bg-red-900/15 hover:text-red-600 active:bg-red-900/15"
                                title="Propustit zvíře"
                            >
                                <X size={16} />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Jméno</label>
                                    <input 
                                        type="text" 
                                        value={mount.name} 
                                        onChange={e => updateMount(mountIdx, 'name', e.target.value)} 
                                        className="w-full bg-transparent border-b-2 border-fl-border focus:border-fl-primary px-2 py-1 font-serif text-lg font-bold text-fl-surface focus:outline-none placeholder:text-fl-border" 
                                        placeholder="Kůň Blahouš, Nosič Bob..." 
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Nosnost</label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            value={mount.encumbranceLimit}
                                            onChange={e => updateMount(mountIdx, 'encumbranceLimit', parseInt(e.target.value) || 0)}
                                            className="w-full bg-transparent border-b border-fl-border focus:border-fl-primary px-2 py-1 font-bold text-fl-surface focus:outline-none"
                                        />
                                    </div>
                                    <div className={`flex-1 flex flex-col items-center justify-center p-1 rounded border ${overencumbered ? 'bg-red-900/20 border-red-800 text-red-500' : 'bg-fl-paper-bright border-fl-surface-hover text-fl-primary'}`}>
                                        <span className="uppercase text-[9px] font-bold opacity-70">Zátěž</span>
                                        <span className="font-bold text-sm tracking-wider">{w} / {mount.encumbranceLimit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mount Inventory */}
                            <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[9px] font-bold uppercase text-fl-primary mb-2 px-1">
                                <span>Náklad</span>
                                <span className="text-center w-14">Váha</span>
                                <span className="w-6"></span>
                            </div>
                            <div className="space-y-2 mb-2">
                                {(mount.inventory || []).map((item, itemIdx) => (
                                    <div key={itemIdx} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center bg-fl-paper-bright p-1 rounded border border-fl-paper hover:border-fl-primary/50 transition-colors group">
                                        <ItemAutocomplete
                                            className="bg-transparent font-bold text-fl-surface w-full focus:outline-none placeholder:text-fl-border px-1 text-sm"
                                            placeholder="Předmět..."
                                            value={item.name}
                                            onChange={val => updateMountItem(mountIdx, itemIdx, 'name', val)}
                                            onSelect={selected => {
                                                updateMountItem(mountIdx, itemIdx, 'name', selected.Předmět);
                                                if (selected.Váha !== undefined) {
                                                    updateMountItem(mountIdx, itemIdx, 'weight', parseWeight(selected.Váha));
                                                }
                                            }}
                                        />
                                        <WeightSelect value={item.weight} onChange={(v) => updateMountItem(mountIdx, itemIdx, 'weight', v)} />
                                        
                                        <button
                                            onClick={() => handleClearMountItem(mountIdx, itemIdx)}
                                            aria-label={`Odstranit ${item.name || 'předmět'}`}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg text-fl-text-muted transition-colors hover:bg-red-900/20 hover:text-red-700 active:bg-red-900/20"
                                            title="Odstranit předmět"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => handleAddMountItem(mountIdx)}
                                className="w-full py-1 text-fl-text-muted hover:text-fl-primary text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 transition-colors border border-transparent hover:border-fl-border rounded"
                            >
                                <Plus size={14} /> Přidat slot nákladu
                            </button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default SheetMounts;
