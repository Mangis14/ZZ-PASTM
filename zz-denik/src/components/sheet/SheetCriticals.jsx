import React from 'react';
import { Dices, PenLine, Skull, Plus, X } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import AnchoredMenu, { useAnchoredMenu } from '../common/AnchoredMenu';

/* „+“ nabídne hod na tabulku kritických zranění, nebo vlastní zápis. */
const AddInjuryButton = ({ onRoll, onCustom, className }) => {
    const menu = useAnchoredMenu();
    const choose = (action) => { menu.close(); action(); };

    return (
        <>
            <button
                type="button"
                onClick={onRoll ? menu.open : onCustom}
                data-game-action
                aria-haspopup={onRoll ? 'dialog' : undefined}
                aria-expanded={menu.isOpen}
                aria-label="Přidat kritické zranění"
                title="Přidat kritické zranění"
                className={className}
            >
                <Plus size={16} />
            </button>
            {menu.isOpen && (
                <AnchoredMenu anchorRect={menu.anchorRect} onClose={menu.close} label="Přidat kritické zranění" widthClass="w-60">
                    <button type="button" onClick={() => choose(onRoll)} className={MENU_ITEM}>
                        <Dices size={18} className="shrink-0 text-fl-primary" aria-hidden="true" />
                        <span>
                            <span className="block font-bold">Hodit na tabulku</span>
                            <span className="block text-xs text-fl-text-muted">Otevře tabulky kritických zranění</span>
                        </span>
                    </button>
                    <button type="button" onClick={() => choose(onCustom)} className={MENU_ITEM}>
                        <PenLine size={18} className="shrink-0 text-fl-primary" aria-hidden="true" />
                        <span>
                            <span className="block font-bold">Přidat vlastní</span>
                            <span className="block text-xs text-fl-text-muted">Prázdný řádek k ručnímu vyplnění</span>
                        </span>
                    </button>
                </AnchoredMenu>
            )}
        </>
    );
};

const MENU_ITEM = 'flex min-h-14 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-fl-surface transition-colors hover:bg-fl-paper active:bg-fl-paper';

const SheetCriticals = ({ char, updateField, updateDeep, onOpenCriticalTable }) => {
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
                    <AddInjuryButton onRoll={onOpenCriticalTable} onCustom={handleAdd} className="flex h-11 w-11 items-center justify-center border border-fl-border rounded-lg text-fl-primary hover:bg-fl-paper active:bg-fl-paper transition-colors" />
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <SectionHeader title="Kritická Zranění" icon={Skull} />
                <AddInjuryButton onRoll={onOpenCriticalTable} onCustom={handleAdd} className="flex h-11 w-11 items-center justify-center border border-fl-border rounded-lg text-fl-primary hover:bg-fl-paper active:bg-fl-paper transition-colors shadow-sm bg-fl-paper-bright" />
            </div>
            
            <div className="space-y-3">
                <div className="grid grid-cols-[1fr_auto_80px_auto] gap-2 text-[10px] font-bold uppercase text-fl-primary px-1 border-b border-fl-paper pb-1">
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
                        <label className="flex min-h-11 w-14 cursor-pointer items-center justify-center z-10">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-red-700"
                                checked={crit.lethal}
                                onChange={e => updateDeep('criticalInjuries', i, 'lethal', e.target.checked)}
                                aria-label={`Smrtící zranění ${i + 1}`}
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
                            aria-label="Zranění vyléčeno — odstranit"
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-fl-text-muted transition-colors hover:bg-red-900/20 hover:text-red-700 active:bg-red-900/20 z-10"
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
