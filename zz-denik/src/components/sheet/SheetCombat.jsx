import React, { useEffect, useState } from 'react';
import { Brain, Crosshair, Dices, Flame, Plus, RotateCcw, Shield, Skull, Sword, Trash2, Zap } from 'lucide-react';
import Card from '../common/Card';
import SectionHeader from '../common/SectionHeader';
import UnequipModal from '../common/UnequipModal';
import WeightSelect from '../common/WeightSelect';
import GearStat from '../common/GearStat';
import { getTalentRank } from '../../utils/talents';

const emptyWeapon = { name: '', bonus: '', bonusMax: '', damage: '', range: '', note: '', weight: 1 };
const emptyArmor = { name: '', bonus: '', rating: '', ratingMax: '', weight: 1 };

// Štít má v katalogu bonus ve sloupci Zbroj, proto všechny sloty používají `rating`.
const ARMOR_SLOTS = [
    { label: 'Zbroj', valueLabel: 'Třída zbroje', emptyLabel: 'Bez zbroje', key: 'armor' },
    { label: 'Helma', valueLabel: 'Třída zbroje', emptyLabel: 'Bez helmy', key: 'helmet' },
    { label: 'Štít', valueLabel: 'Bonus štítu', emptyLabel: 'Bez štítu', key: 'shield' }
];

const FIELD_WEIGHT = 'h-11 border border-fl-border bg-fl-card px-3';

const COMPACT_INPUT = 'min-h-10 w-full min-w-0 rounded-lg border border-fl-border bg-fl-card px-2 text-center text-sm font-bold text-fl-surface focus:border-fl-primary focus:outline-none';

const SheetCombat = ({ char, updateDeep, innerRef, handleAddWeaponSlot, addItemToInventory, onResetFight, onEndBerserking, onReceiveFearAttack, onCoupDeGrace, onActivateBladeOption, onCombatAttack, onRoll }) => {
    const [unequipRequest, setUnequipRequest] = useState(null);
    const [initiativeOptions, setInitiativeOptions] = useState([]);
    const [initiative, setInitiative] = useState(null);
    const [selectedWeaponIndex, setSelectedWeaponIndex] = useState(0);
    const [attackType, setAttackType] = useState('melee');
    const berserkerRank = getTalentRank(char, 'berserker');
    const painResistantRank = getTalentRank(char, 'odolny_proti_bolesti');
    const lightningSpeedRank = getTalentRank(char, 'rychlost_blesku');
    const fearlessRank = getTalentRank(char, 'nebojacny');
    const bladeRank = getTalentRank(char, 'path_of_the_blade');
    const isBerserking = Boolean(char.talentState?.isBerserking);
    const berserkerUsed = Boolean(char.talentState?.berserkerUsedThisFight);
    const painUses = Math.max(0, Number(char.talentState?.painResistUsesThisFight) || 0);
    const painReady = painResistantRank >= 2 || painUses < 1;
    const bonusCombatActions = Math.max(0, Number(char.talentState?.bonusCombatActions) || 0);
    const pendingAttackBonus = Math.max(0, Number(char.talentState?.pendingAttackBonus) || 0);
    const equippedWeapons = char.weapons
        .map((weapon, index) => ({ weapon, index }))
        .filter(({ weapon }) => weapon.name?.trim());
    const selectedWeapon = char.weapons?.[selectedWeaponIndex];

    useEffect(() => {
        if (equippedWeapons.length > 0 && !selectedWeapon?.name?.trim()) {
            setSelectedWeaponIndex(equippedWeapons[0].index);
        }
    }, [equippedWeapons, selectedWeapon]);

    const drawInitiative = () => {
        const cards = Array.from({ length: 10 }, (_, index) => index + 1);
        for (let index = cards.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
        }
        const optionCount = lightningSpeedRank > 0 ? Math.min(4, lightningSpeedRank + 1) : 1;
        const options = cards.slice(0, optionCount);
        setInitiativeOptions(options);
        setInitiative(optionCount === 1 ? options[0] : null);
    };

    const startNewFight = () => {
        setInitiativeOptions([]);
        setInitiative(null);
        onResetFight?.();
    };

    const clearArmorSlot = (key) => {
        Object.entries(emptyArmor).forEach(([field, value]) => updateDeep(key, null, field, value));
    };

    const clearWeaponSlot = (index) => {
        Object.entries(emptyWeapon).forEach(([field, value]) => updateDeep('weapons', index, field, value));
    };

    const handleStash = () => {
        if (!unequipRequest) return;
        const { current } = unequipRequest;
        if (current.name && addItemToInventory) {
            addItemToInventory({
                name: current.name,
                weight: current.weight !== undefined ? current.weight : 1,
            });
        }

        if (unequipRequest.type === 'weapon') clearWeaponSlot(unequipRequest.idx);
        else clearArmorSlot(unequipRequest.key);
        setUnequipRequest(null);
    };

    const handleDrop = () => {
        if (!unequipRequest) return;
        if (unequipRequest.type === 'weapon') clearWeaponSlot(unequipRequest.idx);
        else clearArmorSlot(unequipRequest.key);
        setUnequipRequest(null);
    };

    return (
        <Card innerRef={innerRef}>
            <SectionHeader title="Boj" icon={Sword} />

            <div className="mb-4 space-y-3 rounded-xl border border-fl-primary/30 bg-fl-paper/30 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-fl-primary">Bojový útok</h3>
                    <div className="flex flex-wrap gap-2">
                        {char.talentState?.extraAttackReady && (
                            <span className="rounded-full bg-fl-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                Útok navíc připraven
                            </span>
                        )}
                        {bonusCombatActions > 0 && (
                            <span className="rounded-full bg-fl-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-fl-primary">
                                Bonusové akce: {bonusCombatActions}
                            </span>
                        )}
                        {pendingAttackBonus > 0 && (
                            <span className="rounded-full bg-amber-900/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                                +{pendingAttackBonus} ke zranění
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                    <label className="text-xs font-bold uppercase tracking-wide text-fl-text-muted">
                        Zbraň
                        <select
                            value={selectedWeaponIndex}
                            onChange={event => setSelectedWeaponIndex(Number(event.target.value))}
                            disabled={equippedWeapons.length === 0}
                            className="mt-1 min-h-12 w-full rounded-lg border border-fl-border bg-fl-paper-bright px-3 text-sm font-bold normal-case text-fl-surface outline-none focus:border-fl-primary disabled:opacity-40"
                        >
                            {equippedWeapons.length === 0 && <option value={0}>Žádná vybavená zbraň</option>}
                            {equippedWeapons.map(({ weapon, index }) => (
                                <option key={index} value={index}>{weapon.name}</option>
                            ))}
                        </select>
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:w-52">
                        <button
                            type="button"
                            data-game-action
                            onClick={() => setAttackType('melee')}
                            aria-pressed={attackType === 'melee'}
                            className={`min-h-12 rounded-lg border px-3 text-xs font-bold uppercase tracking-wide ${
                                attackType === 'melee'
                                    ? 'border-fl-primary bg-fl-primary text-white'
                                    : 'border-fl-border bg-fl-card text-fl-surface'
                            }`}
                        >
                            <Sword size={15} className="mx-auto mb-1" /> Zblízka
                        </button>
                        <button
                            type="button"
                            data-game-action
                            onClick={() => setAttackType('ranged')}
                            aria-pressed={attackType === 'ranged'}
                            className={`min-h-12 rounded-lg border px-3 text-xs font-bold uppercase tracking-wide ${
                                attackType === 'ranged'
                                    ? 'border-fl-primary bg-fl-primary text-white'
                                    : 'border-fl-border bg-fl-card text-fl-surface'
                            }`}
                        >
                            <Crosshair size={15} className="mx-auto mb-1" /> Střelba
                        </button>
                    </div>
                </div>

                {bladeRank > 0 && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                            type="button"
                            data-game-action
                            onClick={() => onActivateBladeOption?.('ignore-armor')}
                            disabled={attackType !== 'melee' || char.talentState?.ignoreArmorNextMelee || (Number(char.willpower) || 0) < 1}
                            className="min-h-12 rounded-lg border border-fl-border bg-fl-card px-3 text-xs font-bold uppercase tracking-wide text-fl-surface hover:border-fl-primary hover:text-fl-primary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {char.talentState?.ignoreArmorNextMelee ? 'Ignorování zbroje připraveno' : 'Cesta ostří: ignorovat zbroj (1 vůle)'}
                        </button>
                        {bladeRank >= 2 && (
                            <button
                                type="button"
                                data-game-action
                                onClick={() => onActivateBladeOption?.('extra-attack')}
                                disabled={char.talentState?.extraAttackReady || (Number(char.willpower) || 0) < 1}
                                className="min-h-12 rounded-lg border border-fl-border bg-fl-card px-3 text-xs font-bold uppercase tracking-wide text-fl-surface hover:border-fl-primary hover:text-fl-primary disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {char.talentState?.extraAttackReady ? 'Útok navíc připraven' : 'Cesta ostří: útok navíc (1 vůle)'}
                            </button>
                        )}
                    </div>
                )}

                <div>
                    <button
                        type="button"
                        data-game-action
                        onClick={() => onCombatAttack?.({ weaponIndex: selectedWeaponIndex, type: attackType })}
                        disabled={!selectedWeapon?.name?.trim()}
                        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-fl-primary px-4 font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-fl-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {attackType === 'melee' ? <Sword size={18} /> : <Crosshair size={18} />}
                        Hodit útok
                    </button>
                </div>

                {char.talentState?.lastAttackSummary && (
                    <p className="rounded-lg border border-fl-border bg-fl-paper p-3 text-sm font-bold text-fl-surface-hover" role="status">
                        {char.talentState.lastAttackSummary}
                    </p>
                )}
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-fl-border bg-fl-paper/30 p-3 sm:grid-cols-2">
                <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-fl-primary">Iniciativa</h3>
                        {initiative !== null && (
                            <span className="rounded-full bg-fl-primary px-3 py-1 text-xs font-bold text-white">Karta {initiative}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        data-game-action
                        onClick={drawInitiative}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-fl-primary/30 bg-fl-primary/10 px-3 text-xs font-bold uppercase tracking-wide text-fl-primary transition-colors hover:bg-fl-primary hover:text-white"
                    >
                        <Dices size={16} /> Hodit iniciativu
                    </button>
                    {lightningSpeedRank > 0 && (
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-fl-text-muted">
                            <Zap size={12} className="mr-1 inline text-fl-primary" />
                            Rychlost blesku: vybíráš z {Math.min(4, lightningSpeedRank + 1)} karet
                        </p>
                    )}
                    {initiativeOptions.length > 1 && (
                        <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Výběr iniciativy">
                            {initiativeOptions.map(card => (
                                <button
                                    key={card}
                                    type="button"
                                    data-game-action
                                    onClick={() => setInitiative(card)}
                                    aria-pressed={initiative === card}
                                    className={`flex min-h-12 items-center justify-center rounded-lg border font-serif text-xl font-bold transition-colors ${
                                        initiative === card
                                            ? 'border-fl-primary bg-fl-primary text-white'
                                            : 'border-fl-border bg-fl-card text-fl-surface hover:border-fl-primary'
                                    }`}
                                >
                                    {card}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-fl-primary">Útok strachem</h3>
                    <button
                        type="button"
                        data-game-action
                        onClick={onReceiveFearAttack}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-fl-border bg-fl-card px-3 text-xs font-bold uppercase tracking-wide text-fl-surface transition-colors hover:border-fl-primary hover:text-fl-primary"
                    >
                        <Brain size={16} /> Obdržet útok strachem
                    </button>
                    {fearlessRank >= 1 && (
                        <button
                            type="button"
                            data-game-action
                            onClick={() => onRoll?.(Number(char.attributes?.empathy?.current) || 0, 0, 0)}
                            disabled={(Number(char.attributes?.empathy?.current) || 0) < 1}
                            className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-fl-primary/30 bg-fl-primary/10 px-3 text-xs font-bold uppercase tracking-wide text-fl-primary transition-colors hover:bg-fl-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Shield size={16} /> Obrana Osobností
                        </button>
                    )}
                </div>
            </div>

            <button
                type="button"
                data-game-action
                onClick={onCoupDeGrace}
                className="mb-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-red-800/40 bg-red-900/10 px-3 text-xs font-bold uppercase tracking-wide text-red-800 transition-colors hover:bg-red-900/20 dark:text-red-300"
            >
                <Skull size={16} /> Rána z milosti
            </button>

            {(isBerserking || berserkerRank > 0 || painResistantRank > 0 || fearlessRank >= 4) && (
                <div className="mb-4 space-y-2 rounded-xl border border-fl-primary/30 bg-fl-paper/40 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {berserkerRank > 0 && (
                            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                isBerserking
                                    ? 'bg-red-800 text-white'
                                    : berserkerUsed
                                        ? 'bg-fl-paper text-fl-text-muted'
                                        : 'bg-fl-primary/15 text-fl-primary'
                            }`}>
                                Berserker {isBerserking ? 'aktivní' : berserkerUsed ? 'použit' : 'připraven'}
                            </span>
                        )}
                        {painResistantRank > 0 && (
                            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                painReady ? 'bg-fl-primary/15 text-fl-primary' : 'bg-fl-paper text-fl-text-muted'
                            }`}>
                                Odolnost proti bolesti {painReady ? 'připravena' : 'použita'}
                            </span>
                        )}
                        {fearlessRank >= 4 && (
                            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                char.talentState?.fearWillpowerUsedThisFight
                                    ? 'bg-fl-paper text-fl-text-muted'
                                    : 'bg-fl-primary/15 text-fl-primary'
                            }`}>
                                Vůle ze strachu {char.talentState?.fearWillpowerUsedThisFight ? 'získána' : 'připravena'}
                            </span>
                        )}
                    </div>

                    {isBerserking && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-800/30 bg-red-900/10 p-3 text-sm text-red-800 dark:text-red-300">
                            <Flame size={18} className="mt-0.5 shrink-0" />
                            <p><strong>Běsnění:</strong> +1 ke zranění útoků zblízka. Manipulace je blokována.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {isBerserking && (
                            <button
                                type="button"
                                data-game-action
                                onClick={onEndBerserking}
                                className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-red-800/40 bg-red-900/10 px-3 text-xs font-bold uppercase tracking-wide text-red-800 transition-colors hover:bg-red-900/20 dark:text-red-300"
                            >
                                <Flame size={16} /> Ukončit běsnění
                            </button>
                        )}
                        <button
                            type="button"
                            data-game-action
                            onClick={startNewFight}
                            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-fl-primary/30 bg-fl-primary/10 px-3 text-xs font-bold uppercase tracking-wide text-fl-primary transition-colors hover:bg-fl-primary hover:text-white"
                        >
                            <RotateCcw size={16} /> Začít nový boj
                        </button>
                    </div>
                </div>
            )}

            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-fl-primary">Zbroj</h3>
            <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {ARMOR_SLOTS.map(({ label, valueLabel, emptyLabel, key }) => {
                    const slot = char[key] || emptyArmor;
                    const hasItem = Boolean(slot.name?.trim());

                    return (
                        <div key={key} className="rounded-xl border border-fl-border bg-fl-paper-bright p-3">
                            <div className="mb-1 flex items-center gap-1.5">
                                <Shield size={13} className={hasItem ? 'text-fl-primary' : 'text-fl-text-muted'} aria-hidden="true" />
                                <span className="text-[11px] font-bold uppercase tracking-wide text-fl-primary">{label}</span>
                            </div>
                            <div className="mb-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={emptyLabel}
                                    aria-label={`${label} – název`}
                                    className="min-h-11 min-w-0 flex-1 rounded-lg border border-fl-border bg-fl-card px-3 text-sm font-bold text-fl-surface placeholder:font-normal placeholder:text-fl-text-muted focus:border-fl-primary focus:outline-none"
                                    value={slot.name}
                                    onChange={(event) => updateDeep(key, null, 'name', event.target.value)}
                                />
                                {hasItem && (
                                    <button
                                        type="button"
                                        onClick={() => setUnequipRequest({ type: 'armor', key, current: slot })}
                                        aria-label={`Odložit ${slot.name}`}
                                        className="flex h-11 w-10 shrink-0 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-900/15 active:bg-red-900/20 dark:text-red-400"
                                        title="Odložit nebo zahodit"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-end gap-2">
                                <div className="min-w-0 flex-1">
                                    <GearStat
                                        label={valueLabel}
                                        value={slot.rating}
                                        maxValue={slot.ratingMax}
                                        onChange={(value) => updateDeep(key, null, 'rating', value)}
                                        onMaxChange={(value) => updateDeep(key, null, 'ratingMax', value)}
                                    />
                                </div>
                                <label className="flex shrink-0 flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-fl-primary">Váha</span>
                                    <WeightSelect value={slot.weight} onChange={(value) => updateDeep(key, null, 'weight', value)} className={FIELD_WEIGHT} />
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>

            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-fl-primary">Zbraně</h3>
            <div className="space-y-2">
                {char.weapons.map((weapon, index) => {
                    const hasItem = Boolean(weapon.name?.trim());

                    return (
                        <div key={index} className={`rounded-xl border p-3 transition-colors ${hasItem ? 'border-fl-border bg-fl-paper-bright' : 'border-dashed border-fl-border/70 bg-transparent'}`}>
                            <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fl-primary/15 text-xs font-bold text-fl-primary">{index + 1}</span>
                                <input
                                    type="text"
                                    placeholder="Prázdný slot zbraně"
                                    aria-label={`Zbraň ${index + 1} – název`}
                                    className="min-h-11 min-w-0 flex-1 rounded-lg border border-fl-border bg-fl-card px-3 text-sm font-bold text-fl-surface placeholder:font-normal placeholder:text-fl-text-muted focus:border-fl-primary focus:outline-none"
                                    value={weapon.name}
                                    onChange={(event) => updateDeep('weapons', index, 'name', event.target.value)}
                                />
                                {hasItem && (
                                    <button
                                        type="button"
                                        onClick={() => setUnequipRequest({ type: 'weapon', idx: index, current: weapon })}
                                        aria-label={`Odložit zbraň ${weapon.name}`}
                                        className="flex h-11 w-10 shrink-0 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-900/15 active:bg-red-900/20 dark:text-red-400"
                                        title="Odložit zbraň"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>

                            {hasItem && (
                                <>
                                    <div className="mt-2 grid grid-cols-1 gap-2 min-[360px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                                        <GearStat
                                            label="Bonus"
                                            signed
                                            value={weapon.bonus}
                                            maxValue={weapon.bonusMax}
                                            onChange={(value) => updateDeep('weapons', index, 'bonus', value)}
                                            onMaxChange={(value) => updateDeep('weapons', index, 'bonusMax', value)}
                                        />
                                        <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2">
                                            <label className="flex min-w-0 flex-col gap-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wide text-fl-primary">Zranění</span>
                                                <input type="text" inputMode="numeric" className={COMPACT_INPUT} value={weapon.damage} onChange={(event) => updateDeep('weapons', index, 'damage', event.target.value)} />
                                            </label>
                                            <label className="flex min-w-0 flex-col gap-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wide text-fl-primary">Dosah</span>
                                                <input type="text" className={`${COMPACT_INPUT} px-1 text-xs`} value={weapon.range} onChange={(event) => updateDeep('weapons', index, 'range', event.target.value)} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-end gap-2">
                                        <label className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-fl-primary">Vlastnosti</span>
                                            <input
                                                type="text"
                                                placeholder="sečná, bodná…"
                                                className="min-h-10 w-full rounded-lg border border-fl-border bg-fl-card px-3 text-sm text-fl-surface placeholder:text-fl-text-muted focus:border-fl-primary focus:outline-none"
                                                value={weapon.note}
                                                onChange={(event) => updateDeep('weapons', index, 'note', event.target.value)}
                                            />
                                        </label>
                                        <label className="flex shrink-0 flex-col gap-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-fl-primary">Váha</span>
                                            <WeightSelect value={weapon.weight} onChange={(value) => updateDeep('weapons', index, 'weight', value)} className={FIELD_WEIGHT} />
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={handleAddWeaponSlot}
                    className="w-full mt-2 min-h-12 bg-fl-paper hover:bg-fl-border text-fl-primary font-bold uppercase text-xs tracking-widest rounded-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 border border-fl-primary/30"
                >
                    <Plus size={16} aria-hidden="true" /> Přidat slot zbraně
                </button>
            </div>

            {unequipRequest && (
                <UnequipModal
                    itemName={unequipRequest.current.name}
                    onStash={handleStash}
                    onDrop={handleDrop}
                    onCancel={() => setUnequipRequest(null)}
                />
            )}
        </Card>
    );
};

export default SheetCombat;
