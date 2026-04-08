import React from 'react';
import { User, Coins } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
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
            </div>
            <MoneyInput 
                money={char.money} 
                onChange={(newMoney) => {
                    updateField('money.gold', newMoney.gold);
                    updateField('money.silver', newMoney.silver);
                    updateField('money.copper', newMoney.copper);
                }} 
            />
        </Card>
    );
};

export default SheetBasicInfo;
