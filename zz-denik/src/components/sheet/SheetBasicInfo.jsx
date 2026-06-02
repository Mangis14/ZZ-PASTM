import React from 'react';
import Card from '../common/Card';
import MoneyInput from '../common/MoneyInput';

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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Věk</label>
                        <input
                            type="number"
                            value={char.age || ''}
                            onChange={e => updateField('age', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent border-b border-fl-border focus:border-fl-primary px-2 py-1 text-sm font-bold text-fl-surface-hover focus:outline-none"
                            placeholder="Věk"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Reputace</label>
                        <input
                            type="number"
                            value={char.reputation || ''}
                            onChange={e => updateField('reputation', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent border-b border-fl-border focus:border-fl-primary px-2 py-1 text-sm font-bold text-fl-surface-hover focus:outline-none"
                            placeholder="Reputace"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Vzhled</label>
                    <input
                        type="text"
                        value={char.appearance || ''}
                        onChange={e => updateField('appearance', e.target.value)}
                        className="w-full bg-transparent border-b border-fl-border focus:border-fl-primary px-2 py-1 text-sm text-fl-surface-hover focus:outline-none"
                        placeholder="Popis vzhledu..."
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Pýcha</label>
                    <input
                        type="text"
                        value={char.pride || ''}
                        onChange={e => updateField('pride', e.target.value)}
                        className="w-full bg-transparent border-b border-fl-border focus:border-fl-primary px-2 py-1 text-xs text-fl-surface-hover focus:outline-none italic"
                        placeholder="Pýcha postavy..."
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1 tracking-wider">Temné tajemství</label>
                    <input
                        type="text"
                        value={char.darkSecret || ''}
                        onChange={e => updateField('darkSecret', e.target.value)}
                        className="w-full bg-transparent border-b border-fl-border focus:border-fl-primary px-2 py-1 text-xs text-fl-surface-hover focus:outline-none italic text-red-900 dark:text-red-400"
                        placeholder="Temné tajemství..."
                    />
                </div>
            </div>
            
            <div className="flex flex-col justify-between h-full space-y-4">
                <MoneyInput 
                    money={char.money} 
                    onChange={(newMoney) => {
                        updateField('money.gold', newMoney.gold);
                        updateField('money.silver', newMoney.silver);
                        updateField('money.copper', newMoney.copper);
                    }} 
                />

                {/* Relationships (Vztahy k ostatním PC) */}
                <div className="border border-fl-primary/20 bg-fl-paper-bright/20 p-3 rounded-sm space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-fl-primary tracking-wider">Vztahy k ostatním postavám</label>
                    <div className="space-y-1.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                value={char.relationships?.[i] || ''}
                                onChange={e => {
                                    const newRels = [...(char.relationships || ['', '', '', ''])];
                                    newRels[i] = e.target.value;
                                    updateField('relationships', newRels);
                                }}
                                className="w-full bg-transparent border-b border-fl-border/40 focus:border-fl-primary px-1.5 py-0.5 text-xs text-fl-surface-hover focus:outline-none"
                                placeholder={`Dobrodruh ${i + 1}...`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default SheetBasicInfo;
