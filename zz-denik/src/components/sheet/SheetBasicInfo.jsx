import React from 'react';
import { Coins } from 'lucide-react';
import Card from '../common/Card';

const SheetBasicInfo = ({ char, updateField }) => {
    return (
        <Card className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Jméno</label>
                    <input
                        type="text"
                        value={char.name}
                        onChange={e => updateField('name', e.target.value)}
                        className="w-full bg-transparent border-b-2 border-fl-border focus:border-fl-primary px-2 py-1 font-serif text-xl font-bold text-fl-surface focus:outline-none placeholder:text-fl-border"
                        placeholder="Jméno postavy"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Rod</label>
                        <input
                            type="text"
                            value={char.kin}
                            onChange={e => updateField('kin', e.target.value)}
                            className="w-full bg-transparent border-b border-fl-border focus:border-fl-primary px-2 py-1 text-sm font-bold text-fl-surface-hover focus:outline-none"
                            placeholder="Člověk, Elf..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Povolání</label>
                        <input
                            type="text"
                            value={char.profession}
                            onChange={e => updateField('profession', e.target.value)}
                            className="w-full bg-transparent border-b border-fl-border focus:border-fl-primary px-2 py-1 text-sm font-bold text-fl-surface-hover focus:outline-none"
                            placeholder="Bojovník..."
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center gap-2 bg-fl-paper-bright p-3 rounded border border-fl-border">
                <div className="flex justify-between items-center border-b border-fl-border pb-2">
                    <span className="text-xs font-bold uppercase text-fl-primary">Peníze</span>
                    <Coins size={16} className="text-fl-border" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    {['gold', 'silver', 'copper'].map(c => (
                        <div key={c} className="flex flex-col items-center">
                            <div className="flex items-center gap-1 w-full">
                                <button
                                    onClick={() => updateField(`money.${c}`, Math.max(0, (char.money[c] || 0) - 1))}
                                    className="text-fl-primary hover:text-fl-surface px-1 font-bold"
                                >-</button>
                                <input
                                    type="number"
                                    value={char.money[c]}
                                    onChange={e => updateField(`money.${c}`, parseInt(e.target.value) || 0)}
                                    className="w-full text-center font-bold bg-transparent border-b border-transparent focus:border-fl-primary focus:outline-none"
                                />
                                <button
                                    onClick={() => updateField(`money.${c}`, (char.money[c] || 0) + 1)}
                                    className="text-fl-primary hover:text-fl-surface px-1 font-bold"
                                >+</button>
                            </div>
                            <span className="text-[9px] uppercase font-bold text-fl-border">
                                {c === 'gold' ? 'ZL' : c === 'silver' ? 'ST' : 'MĚ'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default SheetBasicInfo;
