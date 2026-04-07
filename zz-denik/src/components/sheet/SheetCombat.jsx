import React from 'react';
import { Sword, Shield } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import WeightSelect from '../common/WeightSelect';

const SheetCombat = ({ char, updateDeep, innerRef }) => {
    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Boj" icon={Sword} />

            {/* ARMOR */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                    { label: 'Zbroj', key: 'armor', icon: Shield },
                    { label: 'Helma', key: 'helmet', icon: Shield },
                    { label: 'Štít', key: 'shield', icon: Shield }
                ].map(({ label, key, icon: Icon }) => (
                    <div key={key} className="bg-fl-paper-bright p-2 rounded border border-fl-paper relative group">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold uppercase text-fl-primary">{label}</span>
                            <Icon size={12} className="text-fl-border" />
                        </div>
                        <input
                            type="text"
                            placeholder="..."
                            className="w-full bg-transparent border-b border-fl-paper text-sm font-bold text-fl-surface mb-1 focus:outline-none placeholder:text-fl-border"
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
                ))}
            </div>

            {/* WEAPONS */}
            <div className="space-y-2">
                <div className="grid grid-cols-[1fr_30px_30px_40px_1fr_auto] gap-2 text-[9px] font-bold uppercase text-fl-primary px-1">
                    <span>Zbraň</span>
                    <span className="text-center">Bon</span>
                    <span className="text-center">Zran</span>
                    <span className="text-center">Rozsah</span>
                    <span>Poznámka</span>
                    <span className="text-center w-14">Váha</span>
                </div>
                {char.weapons.map((w, i) => (
                    <div key={i} className="grid grid-cols-[1fr_30px_30px_40px_1fr_auto] gap-2 items-center bg-fl-paper-bright p-1 rounded border border-fl-paper hover:border-fl-primary/50 transition-colors">
                        <input type="text" className="bg-transparent font-bold text-fl-surface w-full focus:outline-none placeholder:text-fl-border" value={w.name} onChange={e => updateDeep('weapons', i, 'name', e.target.value)} />
                        <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={w.bonus} onChange={e => updateDeep('weapons', i, 'bonus', e.target.value)} />
                        <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={w.damage} onChange={e => updateDeep('weapons', i, 'damage', e.target.value)} />
                        <input type="text" className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border" value={w.range} onChange={e => updateDeep('weapons', i, 'range', e.target.value)} />
                        <input type="text" className="bg-transparent text-xs w-full focus:outline-none text-fl-text-muted placeholder:text-fl-border" value={w.note} onChange={e => updateDeep('weapons', i, 'note', e.target.value)} />
                        <WeightSelect value={w.weight} onChange={(v) => updateDeep('weapons', i, 'weight', v)} />
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SheetCombat;
