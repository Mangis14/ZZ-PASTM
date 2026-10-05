import React, { useState } from 'react';
import { CookingPot, Crosshair, Fish, Flame, Leaf, PackagePlus, Utensils, Droplets, Target, Wine, Cigarette } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import { getTalentRank } from '../../utils/talents';
import { adjustSupply, SUPPLY_DICE } from '../../utils/resources';

const RESOURCE_CONFIG = [
    { label: 'Jídlo', key: 'food', icon: Utensils },
    { label: 'Voda', key: 'water', icon: Droplets },
    { label: 'Šípy', key: 'arrows', icon: Target },
    { label: 'Pochodně', key: 'torches', icon: Flame },
    { label: 'Alkohol', key: 'alcohol', icon: Wine },
    { label: 'Tabák', key: 'tobacco', icon: Cigarette }
];

const PREY_OPTIONS = [
    { name: 'Králík', units: 1 },
    { name: 'Koroptev', units: 1 },
    { name: 'Srnec', units: 2 },
    { name: 'Divočák', units: 3 },
    { name: 'Jelen', units: 4 }
];

const SheetConsumables = ({ char, updateField, onRoll, innerRef }) => {
    const [cookAmount, setCookAmount] = useState(1);
    const [actionMessage, setActionMessage] = useState('');
    const [huntChoices, setHuntChoices] = useState([]);
    const herbalistRank = getTalentRank(char, 'bylinkar');
    const fisherRank = getTalentRank(char, 'rybar');
    const trackerRank = getTalentRank(char, 'stopar');
    const cookRank = getTalentRank(char, 'kuchar');
    const rawFood = Math.max(0, Number(char.consumables?.rawFood) || 0);
    const cookMealUsed = Boolean(char.talentState?.cookMealUsedThisQuarterDay);
    const empathy = char.attributes?.empathy || { current: 0, max: 0 };
    const hasSurvivalTalents = herbalistRank > 0 || fisherRank > 0 || trackerRank > 0 || cookRank > 0;

    const cycleUp = (key) => {
        updateField(`consumables.${key}`, adjustSupply(char.consumables?.[key], 1));
    };

    const cycleDown = (key) => {
        updateField(`consumables.${key}`, adjustSupply(char.consumables?.[key], -1));
    };

    const getDisplayValue = (val) => {
        if (!val || val === 0) return 'Prázdné';
        return val;
    };

    const getColorClass = (val) => {
        if (!val || val === 0) return 'text-fl-text-muted';
        if (val === 'K6') return 'text-red-600 dark:text-red-400';
        if (val === 'K8') return 'text-amber-600 dark:text-amber-400';
        if (val === 'K10') return 'text-green-700 dark:text-green-400';
        if (val === 'K12') return 'text-fl-primary';
        return 'text-fl-surface';
    };

    const grantFood = (label, units, rests = false) => {
        const safeUnits = Math.max(0, Number(units) || 0);
        if (safeUnits < 1) {
            setActionMessage(`${label}: žádné jídlo nebylo získáno.`);
            return;
        }
        updateField('consumables.food', adjustSupply(char.consumables?.food, safeUnits));
        if (rests && char.conditions?.sleepy) updateField('conditions.sleepy', false);
        setActionMessage(`${label}: získáno ${safeUnits} stupňů zásoby jídla${rests ? ' a akce se počítá jako odpočinek' : ''}.`);
    };

    const startSurvivalRoll = ({ title, rank, doubleAtRank3 = false, tracker = false }) => {
        const bonusDice = rank >= 1 ? 1 : 0;
        onRoll?.(
            Number(char.attributes?.wits?.current) || 0,
            (Number(char.skills?.survival) || 0) + bonusDice,
            0,
            {
                title,
                description: `${title} používá Přežití${bonusDice ? ' s bonusovou k6 za talent' : ''}.`,
                resolveLabel: 'Použít výsledek',
                onResolve: (successes) => {
                    if (tracker && rank >= 3 && successes > 0) {
                        const shuffled = [...PREY_OPTIONS].sort(() => Math.random() - 0.5);
                        setHuntChoices(shuffled.slice(0, 2));
                        setActionMessage('Stopař: vyber si jednu ze dvou nalezených kořistí.');
                        return;
                    }
                    const multiplier = doubleAtRank3 && rank >= 3 ? 2 : 1;
                    grantFood(title, successes * multiplier, rank >= 2);
                }
            }
        );
    };

    const cookFood = () => {
        const amount = Math.max(1, Math.min(6, rawFood, cookAmount));
        if (amount < 1) return;
        const roll = Math.floor(Math.random() * 6) + 1;
        const produced = Math.min(amount, roll) + (cookRank >= 2 ? 1 : 0);
        updateField('consumables.rawFood', rawFood - amount);
        grantFood('Vaření', produced);
        setActionMessage(`Vaření: k6 padlo ${roll}, spotřebováno ${amount} surovin a získáno ${produced} stupňů jídla.`);
    };

    const eatCookMeal = () => {
        if (cookRank < 3 || cookMealUsed || !char.consumables?.food) return;
        updateField('consumables.food', adjustSupply(char.consumables.food, -1));
        updateField('attributes.empathy', {
            ...empathy,
            current: Math.min(Number(empathy.max) || 0, (Number(empathy.current) || 0) + 1)
        });
        updateField('talentState.cookMealUsedThisQuarterDay', true);
        setActionMessage('Kuchař: jídlo obnovilo 1 bod Osobnosti. Znovu to půjde příští čtvrtden.');
    };

    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Zdroje" icon={Flame} />

            {hasSurvivalTalents && (
                <div className="mb-4 space-y-3 rounded-xl border border-fl-primary/30 bg-fl-paper/30 p-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {herbalistRank > 0 && (
                            <button type="button" onClick={() => startSurvivalRoll({ title: 'Hledat potravu', rank: herbalistRank, doubleAtRank3: true })} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-fl-primary/30 bg-fl-primary/10 px-3 text-xs font-bold uppercase tracking-wide text-fl-primary hover:bg-fl-primary hover:text-white">
                                <Leaf size={16} /> Hledat potravu
                            </button>
                        )}
                        {fisherRank > 0 && (
                            <button type="button" onClick={() => startSurvivalRoll({ title: 'Chytat ryby', rank: fisherRank, doubleAtRank3: true })} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-fl-primary/30 bg-fl-primary/10 px-3 text-xs font-bold uppercase tracking-wide text-fl-primary hover:bg-fl-primary hover:text-white">
                                <Fish size={16} /> Chytat ryby
                            </button>
                        )}
                        {trackerRank > 0 && (
                            <button type="button" onClick={() => startSurvivalRoll({ title: 'Lov zvířat', rank: trackerRank, tracker: true })} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-fl-primary/30 bg-fl-primary/10 px-3 text-xs font-bold uppercase tracking-wide text-fl-primary hover:bg-fl-primary hover:text-white">
                                <Crosshair size={16} /> Lov zvířat
                            </button>
                        )}
                    </div>

                    {huntChoices.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {huntChoices.map(prey => (
                                <button key={prey.name} type="button" onClick={() => { grantFood(`Kořist: ${prey.name}`, prey.units); setHuntChoices([]); }} className="min-h-12 rounded-lg border border-fl-border bg-fl-card px-3 text-left text-sm font-bold text-fl-surface hover:border-fl-primary">
                                    {prey.name}
                                    <span className="block text-xs font-normal text-fl-text-muted">+{prey.units} stupňů jídla</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {cookRank > 0 && (
                        <div className="rounded-lg border border-fl-border bg-fl-card p-3">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-fl-primary">Suroviny k vaření</p>
                                    <p className="text-sm text-fl-text-muted">{rawFood} jednotek, vařit {rawFood > 0 ? Math.min(cookAmount, rawFood) : 0}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => updateField('consumables.rawFood', Math.max(0, rawFood - 1))} disabled={rawFood < 1} aria-label="Ubrat surovinu" className="h-11 w-11 rounded-lg border border-fl-border font-bold text-fl-primary disabled:opacity-30">-</button>
                                    <button type="button" onClick={() => updateField('consumables.rawFood', rawFood + 1)} aria-label="Přidat surovinu" className="h-11 w-11 rounded-lg border border-fl-primary bg-fl-primary/10 font-bold text-fl-primary">+</button>
                                    <button type="button" onClick={() => setCookAmount(value => Math.max(1, value - 1))} disabled={cookAmount <= 1} aria-label="Vařit méně surovin" className="h-11 w-11 rounded-lg border border-fl-border font-bold text-fl-primary disabled:opacity-30">-</button>
                                    <button type="button" onClick={() => setCookAmount(value => Math.min(6, rawFood, value + 1))} disabled={cookAmount >= Math.min(6, rawFood)} aria-label="Vařit více surovin" className="h-11 w-11 rounded-lg border border-fl-primary bg-fl-primary/10 font-bold text-fl-primary disabled:opacity-30">+</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <button type="button" onClick={cookFood} disabled={rawFood < 1} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-fl-primary/30 bg-fl-primary/10 px-3 text-xs font-bold uppercase tracking-wide text-fl-primary hover:bg-fl-primary hover:text-white disabled:opacity-40">
                                    <CookingPot size={16} /> Uvařit jídlo
                                </button>
                                {cookRank >= 3 && (
                                    <button type="button" onClick={eatCookMeal} disabled={cookMealUsed || !char.consumables?.food || Number(empathy.current) >= Number(empathy.max)} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-fl-border bg-fl-paper px-3 text-xs font-bold uppercase tracking-wide text-fl-surface hover:border-fl-primary disabled:opacity-40">
                                        <Utensils size={16} /> Sníst jídlo a obnovit Osobnost
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {actionMessage && (
                        <p className="rounded-lg border border-fl-border bg-fl-paper p-3 text-sm text-fl-surface-hover" role="status">
                            <PackagePlus size={16} className="mr-2 inline text-fl-primary" /> {actionMessage}
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {RESOURCE_CONFIG.map(({ label, key, icon: Icon }) => {
                    const val = char.consumables?.[key];
                    const isEmpty = !val || val === 0;
                    const isMax = val === SUPPLY_DICE[SUPPLY_DICE.length - 1];

                    return (
                        <div key={key} className="rounded-2xl border border-fl-paper bg-fl-paper-bright p-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fl-paper text-fl-primary"><Icon size={18} /></div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-fl-text-muted">{label}</p>
                                    <p className={`text-lg font-black leading-none ${getColorClass(val)}`}>{getDisplayValue(val)}</p>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <button type="button" onClick={() => cycleDown(key)} disabled={isEmpty} data-game-action aria-label={`Znížit zdroj ${label}`} className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${isEmpty ? 'border-fl-border bg-fl-paper text-fl-text-muted opacity-50' : 'border-fl-border bg-fl-paper text-fl-surface hover:border-fl-primary hover:text-fl-primary'}`}>
                                    <span className="text-lg leading-none">-</span><span>Ubrat</span>
                                </button>
                                <button type="button" onClick={() => cycleUp(key)} disabled={isMax} data-game-action aria-label={`Zvýšit zdroj ${label}`} className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${isMax ? 'border-fl-border bg-fl-paper text-fl-text-muted opacity-50' : 'border-fl-primary bg-fl-primary/10 text-fl-primary hover:bg-fl-primary hover:text-white'}`}>
                                    <span className="text-lg leading-none">+</span><span>Přidat</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default SheetConsumables;
