import React from 'react';
import { Skull, Plus, X } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';

const SheetCriticals = ({ char, updateField, updateDeep }) => {
    const criticals = char.criticalInjuries || [];

    const handleAdd = () => {
        const newArr = [...criticals, { description: '', lethal: false, healingTime: '' }];
        updateField('criticalInjuries', newArr);
    };

    const handleRemove = (index) => {
        const newArr = [...criticals];
        newArr.splice(index, 1);
        updateField('criticalInjuries', newArr);
    };

    if (criticals.length === 0) {
        return (
            <Card>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-fl-primary opacity-60">
                        <Skull size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Žádná kritická zranění</span>
                    </div>
                    <button onClick={handleAdd} className="p-1 border border-fl-border rounded text-fl-primary hover:bg-fl-paper transition-colors" title="Přidat zranění">
                        <Plus size={14} />
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <SectionHeader title="Kritická Zranění" icon={Skull} />
                <button onClick={handleAdd} className="p-1 border border-fl-border rounded text-fl-primary hover:bg-fl-paper transition-colors shadow-sm bg-fl-paper-bright">
                    <Plus size={16} />
                </button>
            </div>
            
            <div className="space-y-3">
                <div className="grid grid-cols-[1fr_auto_80px_auto] gap-2 text-[9px] font-bold uppercase text-fl-primary px-1 border-b border-fl-paper pb-1">
                    <span>Popis (Účinek)</span>
                    <span className="text-center w-14 text-red-700 dark:text-red-400">Smrtící</span>
                    <span className="text-center">Limit do<br/>Smrti</span>
                    <span className="w-6"></span>
                </div>
                {criticals.map((crit, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_80px_auto] gap-2 items-center bg-fl-paper-bright p-2 rounded border border-red-900/30 hover:border-red-900/60 transition-colors group shadow-sm relative overflow-hidden">
                        {crit.lethal && <div className="absolute inset-0 bg-red-900/5 pointer-events-none"></div>}
                        <input 
                            type="text" 
                            className="bg-transparent font-bold text-fl-surface w-full focus:outline-none placeholder:text-fl-border z-10 text-sm" 
                            placeholder="Zlomená noha..." 
                            value={crit.description} 
                            onChange={e => updateDeep('criticalInjuries', i, 'description', e.target.value)} 
                        />
                        <label className="flex items-center justify-center w-14 cursor-pointer z-10">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 accent-red-700"
                                checked={crit.lethal}
                                onChange={e => updateDeep('criticalInjuries', i, 'lethal', e.target.checked)}
                            />
                        </label>
                        <input 
                            type="text" 
                            className="bg-transparent text-center w-full focus:outline-none placeholder:text-fl-border z-10 font-mono text-xs" 
                            placeholder="Dny/Kola" 
                            value={crit.healingTime} 
                            onChange={e => updateDeep('criticalInjuries', i, 'healingTime', e.target.value)} 
                        />
                        
                        <button 
                            onClick={() => handleRemove(i)}
                            className="w-6 h-6 flex items-center justify-center text-fl-border hover:text-red-700 opacity-50 group-hover:opacity-100 transition-all rounded hover:bg-red-900/30 z-10"
                            title="Zranění vyléčeno"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SheetCriticals;
