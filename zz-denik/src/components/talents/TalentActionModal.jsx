import React, { useEffect, useMemo, useState } from 'react';
import { FlaskConical, HeartPulse, PackageSearch, Search, Sparkles, X } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import useDialog from '../../hooks/useDialog';
import { parseWeight } from '../../utils/items';
import { POISON_TYPES } from '../../utils/poisons';
import { getEffectiveWillpower, getTalentActions, isHalfElf } from '../../utils/talents';

const COMMON_CATEGORIES = new Set(['zbozi', 'obleceni', 'suroviny', 'lektvary']);
const WEAPON_CATEGORY_PARTS = ['zbrane nablizko', 'strelne zbrane', 'zbrane na dalku'];
const ATTRIBUTES = [
    { key: 'strength', label: 'Síla' },
    { key: 'agility', label: 'Obratnost' },
    { key: 'wits', label: 'Bystrost' },
    { key: 'empathy', label: 'Osobnost' }
];

const normalizeText = (value) => String(value || '')
    .toLocaleLowerCase('cs-CZ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const getItemName = (item) => item?.Predmet ?? item?.['Předmět'] ?? '';
const getItemWeight = (item) => item?.Vaha ?? item?.['Váha'];

const getPriceInCopper = (item) => {
    if (Number.isFinite(item?.price?.copper)) return item.price.copper;
    const value = Number(item?.price?.value);
    if (!Number.isFinite(value)) return null;
    if (item.price.currency === 'gold') return value * 100;
    if (item.price.currency === 'silver') return value * 10;
    if (item.price.currency === 'copper') return value;
    return null;
};

const isAllowedItemCategory = (category, rank) => {
    const normalized = normalizeText(category);
    if (COMMON_CATEGORIES.has(normalized)) return true;
    return rank >= 2 && WEAPON_CATEGORY_PARTS.some(item => normalized.includes(item));
};

const TalentActionModal = ({ talent, char, onClose, onApply }) => {
    const panelRef = useDialog(onClose);
    const { allItems } = useCatalog();
    const actions = useMemo(() => getTalentActions(talent), [talent]);
    const [selectedActionId, setSelectedActionId] = useState(actions[0]?.id || '');
    const [spent, setSpent] = useState(Math.min(1, Number(char.willpower) || 0));
    const [search, setSearch] = useState('');
    const [healing, setHealing] = useState({});
    const [poisonType, setPoisonType] = useState('deadly');
    const [poisonSkill, setPoisonSkill] = useState('crafting');
    const availableWillpower = Math.max(0, Number(char.willpower) || 0);
    const action = actions.find(item => item.id === selectedActionId) || actions[0];
    const requiresWillpower = action?.requiresWillpower !== false;
    const maxSpent = Math.min(availableWillpower, Number(action?.maxSpent) || availableWillpower);
    const effectiveWillpower = getEffectiveWillpower(char, spent);
    const baseResultAmount = action?.useEffectiveWillpower === false ? spent : effectiveWillpower;
    const resultAmount = baseResultAmount * (Number(action?.resultMultiplier) || 1);
    const halfElf = isHalfElf(char);
    const availablePoisonTypes = talent.id === 'path_of_poison' && talent.rank < 2
        ? POISON_TYPES.slice(0, 1)
        : POISON_TYPES;
    const isBroken = ATTRIBUTES.some(({ key }) => {
        const attribute = char.attributes?.[key];
        return (Number(attribute?.max) || 0) > 0 && (Number(attribute?.current) || 0) === 0;
    });
    const healingSpent = Object.values(healing).reduce((sum, value) => sum + (Number(value) || 0), 0);

    useEffect(() => {
        setSpent(Math.min(1, maxSpent));
        setHealing({});
        setSearch('');
        setPoisonType('deadly');
        setPoisonSkill('crafting');
    }, [selectedActionId]);

    const eligibleItems = useMemo(() => {
        if (action?.type !== 'item' || spent < 1) return [];
        const maxCopper = effectiveWillpower * (talent.rank >= 3 ? 100 : 10);
        const needle = normalizeText(search);

        return allItems
            .filter(item => isAllowedItemCategory(item.Category, talent.rank))
            .filter(item => parseWeight(getItemWeight(item)) < 2)
            .filter(item => {
                const priceInCopper = getPriceInCopper(item);
                return Number.isFinite(priceInCopper) && priceInCopper <= maxCopper;
            })
            .filter(item => !needle || normalizeText(getItemName(item)).includes(needle))
            .sort((a, b) => getPriceInCopper(a) - getPriceInCopper(b))
            .slice(0, 100);
    }, [action?.type, allItems, effectiveWillpower, search, spent, talent.rank]);

    if (!action) return null;

    const canApply = (!requiresWillpower || (spent >= 1 && spent <= maxSpent))
        && (!action.requireBroken || isBroken)
        && (action.type !== 'heal' || healingSpent > 0);

    const updateHealing = (key, delta) => {
        const attribute = char.attributes?.[key] || {};
        const current = Number(attribute.current) || 0;
        const max = Number(attribute.max) || 0;
        const availableDamage = Math.max(0, max - current);
        const currentAllocation = Number(healing[key]) || 0;
        const next = Math.max(0, Math.min(availableDamage, currentAllocation + delta));
        const nextTotal = healingSpent - currentAllocation + next;
        if (nextTotal > resultAmount) return;
        setHealing(previous => ({ ...previous, [key]: next }));
    };

    const applyAction = () => {
        if (!canApply) return;
        if (action.type === 'poison-roll') {
            onApply({
                type: 'poison-roll',
                talentId: talent.id,
                rank: talent.rank,
                poisonType,
                skill: poisonSkill,
                actionLabel: action.title
            });
        } else if (action.type === 'poison') {
            onApply({
                type: 'poison',
                talentId: talent.id,
                spent,
                amount: resultAmount,
                poisonType,
                quickApply: talent.rank >= 3,
                actionLabel: action.title
            });
        } else if (action.type === 'money') {
            onApply({ type: 'money', talentId: talent.id, spent, currency: action.currency, amount: resultAmount, actionLabel: action.title });
        } else if (action.type === 'heal') {
            onApply({ type: 'heal', talentId: talent.id, spent, amount: resultAmount, healing, actionLabel: action.title });
        } else {
            onApply({
                type: 'effect',
                talentId: talent.id,
                actionId: action.id,
                spent,
                amount: resultAmount,
                resultLabel: action.resultLabel,
                actionLabel: action.title
            });
        }
        onClose();
    };

    const chooseItem = (item) => {
        onApply({
            type: 'item',
            talentId: talent.id,
            spent,
            item: { name: getItemName(item), weight: parseWeight(getItemWeight(item)) },
            actionLabel: action.title
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/85 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={action.title}
                className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-3xl border border-b-0 border-fl-primary bg-fl-card p-5 shadow-2xl outline-none sm:rounded-2xl sm:border-b"
                style={{ paddingBottom: 'max(1.25rem, var(--safe-bottom))' }}
                onClick={event => event.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between border-b border-fl-border pb-3">
                    <div>
                        <h3 className="font-serif text-xl font-bold text-fl-surface">{action.title}</h3>
                        <p className="text-xs text-fl-text-muted">{talent.name}, úroveň {talent.rank}</p>
                    </div>
                    <button onClick={onClose} className="flex h-12 w-12 items-center justify-center rounded-full text-fl-primary hover:bg-fl-paper" aria-label="Zavřít">
                        <X size={22} />
                    </button>
                </div>

                {actions.length > 1 && (
                    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {actions.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedActionId(item.id)}
                                className={`min-h-12 rounded-lg border px-3 text-left text-sm font-bold transition-colors ${
                                    item.id === action.id
                                        ? 'border-fl-primary bg-fl-primary text-white'
                                        : 'border-fl-border bg-fl-paper text-fl-surface hover:border-fl-primary'
                                }`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                )}

                <p className="mb-4 rounded-lg border border-fl-border bg-fl-paper p-3 text-sm text-fl-surface-hover">
                    {action.description}
                </p>

                {(action.type === 'poison' || action.type === 'poison-roll') && (
                    <div className="mb-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fl-primary">Typ jedu</p>
                        <div className="grid grid-cols-2 gap-2">
                            {availablePoisonTypes.map(poison => (
                                <button
                                    key={poison.id}
                                    type="button"
                                    onClick={() => setPoisonType(poison.id)}
                                    className={`min-h-12 rounded-lg border px-3 text-sm font-bold transition-colors ${
                                        poisonType === poison.id
                                            ? 'border-fl-primary bg-fl-primary text-white'
                                            : 'border-fl-border bg-fl-paper text-fl-surface hover:border-fl-primary'
                                    }`}
                                >
                                    {poison.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {action.type === 'poison-roll' && (
                    <div className="mb-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fl-primary">Dovednost výroby</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'crafting', label: 'Řemesla' },
                                { id: 'healing', label: 'Léčení' }
                            ].map(skill => (
                                <button
                                    key={skill.id}
                                    type="button"
                                    onClick={() => setPoisonSkill(skill.id)}
                                    className={`min-h-12 rounded-lg border px-3 text-sm font-bold transition-colors ${
                                        poisonSkill === skill.id
                                            ? 'border-fl-primary bg-fl-primary text-white'
                                            : 'border-fl-border bg-fl-paper text-fl-surface hover:border-fl-primary'
                                    }`}
                                >
                                    {skill.label}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-fl-text-muted">
                            {talent.rank === 2
                                ? 'Úroveň 2 přidá +1 k6.'
                                : talent.rank >= 3
                                    ? 'Úroveň 3 přidá bonusovou k8.'
                                    : 'První úspěch vytvoří jed o základní účinnosti 3.'}
                        </p>
                    </div>
                )}

                {requiresWillpower && (
                    <>
                        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-fl-primary" htmlFor="talent-willpower">
                            Utracená vůle
                        </label>
                        <div className="mb-4 flex items-center gap-3">
                            <input
                                id="talent-willpower"
                                type="number"
                                min="1"
                                max={maxSpent}
                                value={spent}
                                onChange={event => setSpent(Math.max(0, Math.min(maxSpent, Number(event.target.value) || 0)))}
                                className="min-h-12 w-24 rounded-lg border border-fl-border bg-fl-paper-bright px-3 text-lg font-bold text-fl-surface outline-none focus:border-fl-primary"
                            />
                            <div className="text-sm text-fl-surface-hover">
                                Zbývá: <strong>{availableWillpower - spent}</strong>
                                {halfElf && action.useEffectiveWillpower !== false && (
                                    <span className="block text-xs text-fl-primary">Půlelf: účinek {effectiveWillpower} vůle</span>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {action.requireBroken && !isBroken && (
                    <p className="mb-4 rounded-lg border border-amber-700/50 bg-amber-900/10 p-3 text-sm font-bold text-amber-700 dark:text-amber-400">
                        Tuto akci lze použít jen když je alespoň jedna vlastnost na 0.
                    </p>
                )}

                {action.type === 'poison-roll' ? (
                    <button
                        type="button"
                        onClick={applyAction}
                        disabled={!canApply}
                        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-fl-primary font-bold uppercase tracking-wider text-white hover:bg-fl-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FlaskConical size={19} /> Hodit na výrobu jedu
                    </button>
                ) : action.type === 'poison' ? (
                    <button
                        type="button"
                        onClick={applyAction}
                        disabled={!canApply}
                        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-fl-primary font-bold uppercase tracking-wider text-white hover:bg-fl-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FlaskConical size={19} /> Vytvořit jed, účinnost {resultAmount}
                    </button>
                ) : action.type === 'item' ? (
                    <>
                        <div className="mb-3 rounded-lg border border-fl-border bg-fl-paper p-3 text-sm text-fl-surface-hover">
                            <PackageSearch className="mr-2 inline text-fl-primary" size={18} />
                            Limit ceny: <strong>{effectiveWillpower} {talent.rank >= 3 ? 'zlatých' : 'stříbrných'}</strong>
                        </div>
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={17} />
                            <input
                                type="search"
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Hledat předmět..."
                                className="min-h-12 w-full rounded-lg border border-fl-border bg-fl-paper-bright pl-10 pr-3 text-fl-surface outline-none focus:border-fl-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            {eligibleItems.map((item, index) => (
                                <button
                                    key={`${item.Category}-${getItemName(item)}-${index}`}
                                    type="button"
                                    onClick={() => chooseItem(item)}
                                    className="flex min-h-12 w-full items-center justify-between rounded-lg border border-fl-border bg-fl-paper-bright p-3 text-left hover:border-fl-primary hover:bg-fl-paper"
                                >
                                    <span>
                                        <span className="block font-bold text-fl-surface">{getItemName(item)}</span>
                                        <span className="text-xs text-fl-text-muted">{item.Category}</span>
                                    </span>
                                    <span className="text-xs font-bold text-fl-primary">{item.Cena || '-'}</span>
                                </button>
                            ))}
                            {eligibleItems.length === 0 && (
                                <p className="rounded-lg border border-dashed border-fl-border p-5 text-center text-sm italic text-fl-text-muted">
                                    Pro zadanou vůli nebyl nalezen žádný předmět.
                                </p>
                            )}
                        </div>
                    </>
                ) : action.type === 'heal' ? (
                    <div className="space-y-3">
                        <div className="rounded-lg border border-fl-primary/40 bg-fl-primary/10 p-3 text-sm text-fl-surface-hover">
                            <HeartPulse className="mr-2 inline text-fl-primary" size={18} />
                            Rozdělit lze <strong>{resultAmount}</strong> bodů. Zatím rozděleno: <strong>{healingSpent}</strong>.
                        </div>
                        {ATTRIBUTES.map(({ key, label }) => {
                            const value = char.attributes?.[key] || {};
                            const current = Number(value.current) || 0;
                            const max = Number(value.max) || 0;
                            const allocated = Number(healing[key]) || 0;
                            return (
                                <div key={key} className="flex items-center justify-between rounded-lg border border-fl-border bg-fl-paper-bright p-3">
                                    <span className="font-bold text-fl-surface">
                                        {label} <span className="text-sm text-fl-text-muted">{current}/{max}</span>
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => updateHealing(key, -1)}
                                            disabled={allocated <= 0}
                                            className="flex h-11 w-11 items-center justify-center rounded-lg border border-fl-border bg-fl-paper font-bold text-fl-primary disabled:opacity-30"
                                            aria-label={`Ubrat léčení: ${label}`}
                                        >
                                            -
                                        </button>
                                        <strong className="w-6 text-center text-fl-surface">{allocated}</strong>
                                        <button
                                            type="button"
                                            onClick={() => updateHealing(key, 1)}
                                            disabled={current + allocated >= max || healingSpent >= resultAmount}
                                            className="flex h-11 w-11 items-center justify-center rounded-lg border border-fl-primary bg-fl-primary/10 font-bold text-fl-primary disabled:opacity-30"
                                            aria-label={`Přidat léčení: ${label}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        <button
                            type="button"
                            onClick={applyAction}
                            disabled={!canApply}
                            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-fl-primary font-bold uppercase tracking-wider text-white hover:bg-fl-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <HeartPulse size={19} /> Obnovit {healingSpent} bodů
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={applyAction}
                        disabled={!canApply}
                        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-fl-primary font-bold uppercase tracking-wider text-white hover:bg-fl-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Sparkles size={19} />
                        {action.type === 'money' ? 'Získat' : 'Použít'} {resultAmount} {action.resultLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TalentActionModal;
