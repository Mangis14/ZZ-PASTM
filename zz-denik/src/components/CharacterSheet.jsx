import React, { useEffect, useRef, useState } from 'react';
import { Backpack, Flame, Gamepad2, LayoutDashboard, Maximize2, Minimize2, RotateCcw, Scroll, Settings2, Shield, Skull, Sparkles, Star, Sword, UserRound, Wand2 } from 'lucide-react';
import SheetTile from './common/SheetTile';

// Imported Sections
import SheetBasicInfo from './sheet/SheetBasicInfo';
import SheetAttributes from './sheet/SheetAttributes';
import SheetSkills from './sheet/SheetSkills';
import SheetCombat from './sheet/SheetCombat';
import SheetInventory from './sheet/SheetInventory';
import SheetConsumables from './sheet/SheetConsumables';
import SheetCriticals from './sheet/SheetCriticals';
import SheetMounts from './sheet/SheetMounts';

import TalentList from './talents/TalentList';
import TalentPicker from './talents/TalentPicker';
import SpellList from './spells/SpellList';
import SpellPicker from './spells/SpellPicker';
import { useCatalog } from '../context/CatalogContext';
import { confirmAction } from './common/ConfirmDialog';
import { hapticTick } from '../native/platform';

const DEFAULT_COLLAPSED_SECTIONS = {
    profile: true,
    attributes: false,
    criticals: true,
    skills: true,
    combat: false,
    inventory: false,
    mounts: true,
    resources: false,
    talents: true,
    spells: true,
    notes: true
};

const DEFAULT_TILE_ORDER = Object.keys(DEFAULT_COLLAPSED_SECTIONS);
const getLayoutStorageKey = (characterId) => `fl_sheet_layout_${characterId || 'draft'}`;
const getLegacyCollapseStorageKey = (characterId) => `fl_sheet_tiles_${characterId || 'draft'}`;

const loadSheetLayout = (characterId) => {
    try {
        const saved = JSON.parse(localStorage.getItem(getLayoutStorageKey(characterId)) || 'null');
        if (saved) {
            const savedOrder = Array.isArray(saved.order) ? saved.order.filter(id => DEFAULT_TILE_ORDER.includes(id)) : [];
            return {
                order: [...savedOrder, ...DEFAULT_TILE_ORDER.filter(id => !savedOrder.includes(id))],
                collapsed: { ...DEFAULT_COLLAPSED_SECTIONS, ...(saved.collapsed || {}) },
                defaultCollapsed: { ...DEFAULT_COLLAPSED_SECTIONS, ...(saved.defaultCollapsed || {}) },
                gameMode: Boolean(saved.gameMode)
            };
        }

        const legacyCollapsed = JSON.parse(localStorage.getItem(getLegacyCollapseStorageKey(characterId)) || '{}');
        return {
            order: DEFAULT_TILE_ORDER,
            collapsed: { ...DEFAULT_COLLAPSED_SECTIONS, ...legacyCollapsed },
            defaultCollapsed: DEFAULT_COLLAPSED_SECTIONS,
            gameMode: false
        };
    } catch {
        return {
            order: DEFAULT_TILE_ORDER,
            collapsed: DEFAULT_COLLAPSED_SECTIONS,
            defaultCollapsed: DEFAULT_COLLAPSED_SECTIONS,
            gameMode: false
        };
    }
};

const CharacterSheet = ({ char, updateField, updateDeep, addItemToInventory, onRoll, refs, scrollToSection, setCurrentView, onModalStateChange, totalWeight, encumbranceLimit, isOverencumbered }) => {
    const { talents: catalogTalents } = useCatalog();
    const [layout, setLayout] = useState(() => loadSheetLayout(char.id));
    const [customizing, setCustomizing] = useState(false);
    const [draggingId, setDraggingId] = useState(null);
    const loadedLayoutKey = useRef(getLayoutStorageKey(char.id));
    const dragState = useRef({ timer: null, activeId: null });
    const [showTalentPicker, setShowTalentPicker] = useState(false);
    const [showSpellPicker, setShowSpellPicker] = useState(false);
    const [isTalentDetailOpen, setIsTalentDetailOpen] = useState(false);
    const [isSpellDetailOpen, setIsSpellDetailOpen] = useState(false);

    useEffect(() => {
        onModalStateChange?.(showTalentPicker || showSpellPicker || isTalentDetailOpen || isSpellDetailOpen);
    }, [showTalentPicker, showSpellPicker, isTalentDetailOpen, isSpellDetailOpen, onModalStateChange]);

    useEffect(() => {
        const nextKey = getLayoutStorageKey(char.id);
        if (loadedLayoutKey.current === nextKey) return;
        loadedLayoutKey.current = nextKey;
        setLayout(loadSheetLayout(char.id));
        setCustomizing(false);
    }, [char.id]);

    useEffect(() => {
        localStorage.setItem(loadedLayoutKey.current, JSON.stringify(layout));
    }, [layout]);

    useEffect(() => {
        const handleNavigate = (event) => {
            const requestedSection = event.detail?.section;
            const section = requestedSection === 'money' ? 'profile' : requestedSection;
            if (!DEFAULT_TILE_ORDER.includes(section)) return;
            setLayout(prev => ({ ...prev, collapsed: { ...prev.collapsed, [section]: false } }));
        };
        window.addEventListener('fl:navigate-sheet-section', handleNavigate);
        return () => window.removeEventListener('fl:navigate-sheet-section', handleNavigate);
    }, []);

    const toggleSection = (section) => {
        setLayout(prev => ({ ...prev, collapsed: { ...prev.collapsed, [section]: !prev.collapsed[section] } }));
    };

    const setAllSections = (collapsed) => {
        setLayout(prev => ({
            ...prev,
            collapsed: Object.fromEntries(DEFAULT_TILE_ORDER.map(section => [section, collapsed]))
        }));
    };

    const applyPreferredOverview = () => {
        setLayout(prev => ({ ...prev, collapsed: { ...prev.defaultCollapsed } }));
    };

    const savePreferredOverview = () => {
        setLayout(prev => ({ ...prev, defaultCollapsed: { ...prev.collapsed } }));
    };

    const resetLayout = async () => {
        const confirmed = await confirmAction({
            title: 'Obnovit výchozí rozložení?',
            message: 'Pořadí a zbalení dlaždic se vrátí do výchozího stavu.',
            confirmLabel: 'Obnovit'
        });
        if (!confirmed) return;
        setLayout(prev => ({
            ...prev,
            order: DEFAULT_TILE_ORDER,
            collapsed: DEFAULT_COLLAPSED_SECTIONS,
            defaultCollapsed: DEFAULT_COLLAPSED_SECTIONS
        }));
    };

    const reorderTile = (activeId, targetId) => {
        setLayout(prev => {
            const nextOrder = [...prev.order];
            const from = nextOrder.indexOf(activeId);
            const to = nextOrder.indexOf(targetId);
            if (from < 0 || to < 0 || from === to) return prev;
            nextOrder.splice(from, 1);
            nextOrder.splice(to, 0, activeId);
            return { ...prev, order: nextOrder };
        });
    };

    const startTileDrag = (tileId, event) => {
        if (!customizing) return;
        clearTimeout(dragState.current.timer);
        event.currentTarget.setPointerCapture?.(event.pointerId);
        dragState.current.timer = setTimeout(() => {
            dragState.current.activeId = tileId;
            setDraggingId(tileId);
            hapticTick(30);
        }, 350);
    };

    const moveTileDrag = (event) => {
        const activeId = dragState.current.activeId;
        if (!activeId) return;
        event.preventDefault();
        if (event.clientY < 100) window.scrollBy(0, -18);
        if (event.clientY > window.innerHeight - 100) window.scrollBy(0, 18);
        const targetId = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-sheet-tile-id]')?.dataset.sheetTileId;
        if (targetId && targetId !== activeId) reorderTile(activeId, targetId);
    };

    const endTileDrag = () => {
        clearTimeout(dragState.current.timer);
        dragState.current.activeId = null;
        setDraggingId(null);
    };

    const tileProps = (tileId) => ({
        tileId,
        order: layout.order.indexOf(tileId),
        collapsed: layout.collapsed[tileId],
        onToggle: () => toggleSection(tileId),
        customizing,
        isDragging: draggingId === tileId,
        dragHandleProps: {
            onPointerDown: (event) => startTileDrag(tileId, event),
            onPointerMove: moveTileDrag,
            onPointerUp: endTileDrag,
            onPointerCancel: endTileDrag
        }
    });

    // --- TALENT HANDLERS ---
    const handleAddTalent = (talent) => {
        const talents = Array.isArray(char.talents) ? char.talents : [];
        const existingIdx = talents.findIndex(t => t.id === talent.id);
        if (existingIdx >= 0) {
            const newTalents = [...talents];
            newTalents[existingIdx] = { ...newTalents[existingIdx], rank: talent.rank, description: talent.description };
            updateField('talents', newTalents);
        } else {
            updateField('talents', [...talents, talent]);
        }
    };

    const handleRemoveTalent = (index) => {
        const newTalents = [...(char.talents || [])];
        newTalents.splice(index, 1);
        updateField('talents', newTalents);
    };

    const handleUpgradeTalent = (talent) => {
        const talents = Array.isArray(char.talents) ? char.talents : [];
        const allTalents = [...(catalogTalents.profession || []), ...(catalogTalents.general || [])];
        const fullTalent = allTalents.find(t => t.id === talent.id);
        if (!fullTalent) return;
        const nextRank = talent.rank + 1;
        if (nextRank > fullTalent.ranks.length) return;
        const rankData = fullTalent.ranks[nextRank - 1];
        const newTalents = talents.map(t =>
            t.id === talent.id ? { ...t, rank: nextRank, description: rankData.description } : t
        );
        updateField('talents', newTalents);
    };

    const handleDowngradeTalent = (talent) => {
        const talents = Array.isArray(char.talents) ? char.talents : [];
        if (talent.rank <= 1) return;
        const allTalents = [...(catalogTalents.profession || []), ...(catalogTalents.general || [])];
        const fullTalent = allTalents.find(t => t.id === talent.id);
        const prevRank = talent.rank - 1;
        const rankData = fullTalent?.ranks[prevRank - 1];
        const newTalents = talents.map(t =>
            t.id === talent.id ? { ...t, rank: prevRank, description: rankData?.description || t.description } : t
        );
        updateField('talents', newTalents);
    };

    const handleShowFullTalent = (talent) => {
        if (setCurrentView) setCurrentView('talents');
    };

    // --- SPELL HANDLERS ---
    const handleAddSpell = (spell) => {
        const spells = Array.isArray(char.spells) ? char.spells : [];
        if (spells.find(s => s.id === spell.id)) return;
        updateField('spells', [...spells, spell]);
    };

    const handleRemoveSpell = (index) => {
        const newSpells = [...(char.spells || [])];
        newSpells.splice(index, 1);
        updateField('spells', newSpells);
    };

    const handleShowFullSpell = () => {
        if (setCurrentView) setCurrentView('spells');
    };

    // --- INVENTORY HANDLER ---
    const handleAddInventorySlot = () => {
        const newInv = [...char.inventory, { name: '', weight: 1 }];
        updateField('inventory', newInv);
    };

    const handleRemoveInventorySlot = (index) => {
        const newInv = [...char.inventory];
        newInv.splice(index, 1);
        updateField('inventory', newInv);
    };

    const handleAddWeaponSlot = () => {
        const newWeapons = [
            ...char.weapons,
            { name: '', bonus: '', damage: '', range: '', note: '', weight: 1 },
        ];
        updateField('weapons', newWeapons);
    };

    const filledInventory = (char.inventory || []).filter(item => item.name?.trim()).length;
    const equippedWeapons = (char.weapons || []).filter(item => item.name?.trim()).length;
    const activeConditions = Object.values(char.conditions || {}).filter(Boolean).length;
    const attributes = Object.values(char.attributes || {});
    const damagedAttributes = attributes.filter(attribute => Number(attribute.current) < Number(attribute.max)).length;
    const depletedAttributes = attributes.filter(attribute => Number(attribute.current) <= 0).length;
    const developedSkills = Object.values(char.skills || {}).filter(value => Number(value) > 0).length;
    const activeResources = Object.values(char.consumables || {}).filter(Boolean).length;
    const criticalCount = (char.criticalInjuries || []).length;
    const mountCount = (char.mounts || []).length;
    const talentCount = (char.talents || []).length;
    const spellCount = (char.spells || []).length;
    const capacityRatio = encumbranceLimit > 0 ? totalWeight / encumbranceLimit : 0;
    const attributeTone = depletedAttributes > 0 ? 'danger' : damagedAttributes > 0 || activeConditions > 0 ? 'warning' : 'default';
    const inventoryTone = isOverencumbered ? 'danger' : capacityRatio >= 0.8 ? 'warning' : 'default';

    return (
        <div className={`grid grid-cols-1 items-start gap-3 lg:grid-cols-2 ${layout.gameMode ? 'sheet-game-mode' : ''}`}>
            <div className="order-[-2] grid grid-cols-2 gap-2 rounded-lg border border-fl-paper bg-fl-card p-2 shadow-sm min-[380px]:grid-cols-4 lg:col-span-2">
                <button
                    type="button"
                    onClick={applyPreferredOverview}
                    className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md bg-fl-primary/10 px-2 text-[10px] font-bold uppercase tracking-wide text-fl-primary transition-colors hover:bg-fl-primary hover:text-white active:bg-fl-primary/30"
                >
                    <LayoutDashboard size={15} aria-hidden="true" />
                    Herní přehled
                </button>
                <button
                    type="button"
                    onClick={() => setCustomizing(prev => !prev)}
                    aria-pressed={customizing}
                    className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 text-[10px] font-bold uppercase tracking-wide transition-colors active:bg-fl-paper ${
                        customizing ? 'bg-fl-primary/15 text-fl-primary' : 'text-fl-text-muted hover:bg-fl-paper hover:text-fl-primary'
                    }`}
                >
                    <Settings2 size={15} aria-hidden="true" />
                    Upravit rozložení
                </button>
                <button
                    type="button"
                    onClick={() => setAllSections(!DEFAULT_TILE_ORDER.every(id => layout.collapsed[id]))}
                    className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 text-[10px] font-bold uppercase tracking-wide text-fl-text-muted transition-colors hover:bg-fl-paper hover:text-fl-primary active:bg-fl-paper"
                >
                    {DEFAULT_TILE_ORDER.every(id => layout.collapsed[id]) ? <Maximize2 size={15} aria-hidden="true" /> : <Minimize2 size={15} aria-hidden="true" />}
                    {DEFAULT_TILE_ORDER.every(id => layout.collapsed[id]) ? 'Rozbalit vše' : 'Zbalit vše'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setCustomizing(false);
                        setLayout(prev => ({ ...prev, gameMode: !prev.gameMode }));
                    }}
                    aria-pressed={layout.gameMode}
                    className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 text-[10px] font-bold uppercase tracking-wide transition-colors active:bg-fl-paper ${
                        layout.gameMode ? 'bg-green-800 text-white' : 'text-fl-text-muted hover:bg-fl-paper hover:text-fl-primary'
                    }`}
                >
                    <Gamepad2 size={15} aria-hidden="true" />
                    {layout.gameMode ? 'Ukončit hru' : 'Režim Hra'}
                </button>
            </div>

            {customizing && (
                <div className="order-[-1] rounded-lg border border-fl-primary/30 bg-fl-card p-3 shadow-sm lg:col-span-2">
                    <div className="mb-3">
                        <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-fl-surface">Personalizace deníku</h3>
                        <p className="mt-1 text-xs text-fl-text-muted">Podržte úchyt dlaždice a přesuňte ji. Otevřený a zbalený stav se ukládá automaticky.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={savePreferredOverview} className="min-h-12 rounded-md border border-fl-primary/30 bg-fl-primary/10 px-2 py-2 text-[10px] font-bold uppercase tracking-wide text-fl-primary transition-colors hover:bg-fl-primary/20 active:bg-fl-primary/30">
                            Uložit jako výchozí
                        </button>
                        <button type="button" onClick={resetLayout} className="flex min-h-12 items-center justify-center gap-1 rounded-md border border-fl-border px-2 py-2 text-[10px] font-bold uppercase tracking-wide text-fl-text-muted transition-colors hover:bg-fl-paper active:bg-fl-paper">
                            <RotateCcw size={13} aria-hidden="true" /> Obnovit rozložení
                        </button>
                    </div>
                </div>
            )}

            <SheetTile {...tileProps('profile')} title="Profil postavy" icon={UserRound} summary={`${char.kin || 'Bez rodu'} · ${char.profession || 'Bez povolání'}`} innerRef={refs.profile}>
                <SheetBasicInfo char={char} updateField={updateField} moneyRef={refs.money} />
            </SheetTile>

            <SheetTile {...tileProps('attributes')} title="Vlastnosti a stavy" icon={Sparkles} summary={`SIL ${char.attributes.strength.current}/${char.attributes.strength.max} · OBR ${char.attributes.agility.current}/${char.attributes.agility.max} · OSO ${char.attributes.empathy.current}/${char.attributes.empathy.max} · BYS ${char.attributes.wits.current}/${char.attributes.wits.max} · ${activeConditions} stavů`} innerRef={refs.attributes} tone={attributeTone}>
                <SheetAttributes char={char} updateField={updateField} onRoll={onRoll} />
            </SheetTile>

            <SheetTile {...tileProps('criticals')} title="Kritická zranění" icon={Skull} summary={criticalCount === 0 ? 'Žádná kritická zranění' : `${criticalCount} aktivní zranění`} tone={criticalCount > 0 ? 'danger' : 'default'}>
                <SheetCriticals char={char} updateField={updateField} updateDeep={updateDeep} />
            </SheetTile>

            <SheetTile {...tileProps('skills')} title="Dovednosti" icon={Star} summary={`${developedSkills} rozvinutých dovedností`} innerRef={refs.skills}>
                <SheetSkills char={char} updateField={updateField} onRoll={onRoll} />
            </SheetTile>

            <SheetTile {...tileProps('combat')} title="Boj" icon={Sword} summary={`${equippedWeapons} zbraně · Zbroj ${char.armor.rating || 0} · Štít ${char.shield.rating || 0}`} innerRef={refs.combat}>
                <SheetCombat char={char} updateDeep={updateDeep} handleAddWeaponSlot={handleAddWeaponSlot} addItemToInventory={addItemToInventory} />
            </SheetTile>

            <SheetTile {...tileProps('inventory')} title="Inventář" icon={Backpack} summary={`Zátěž ${totalWeight}/${encumbranceLimit} · ${filledInventory} předmětů · ${char.inventory.length} slotů`} innerRef={refs.inventory} tone={inventoryTone}>
                <SheetInventory char={char} updateDeep={updateDeep} updateField={updateField} handleAddInventorySlot={handleAddInventorySlot} handleRemoveInventorySlot={handleRemoveInventorySlot} />
            </SheetTile>

            <SheetTile {...tileProps('mounts')} title="Zvířata a sluhové" icon={Shield} summary={mountCount === 0 ? 'Žádná zvířata ani sluhové' : `${mountCount} záznamů`}>
                <SheetMounts char={char} updateField={updateField} />
            </SheetTile>

            <SheetTile {...tileProps('resources')} title="Zdroje" icon={Flame} summary={`${activeResources} z 6 zdrojů aktivních`} innerRef={refs.consumables}>
                <SheetConsumables char={char} updateField={updateField} />
            </SheetTile>

            <SheetTile {...tileProps('talents')} title="Talenty" icon={Star} summary={`${talentCount} naučených talentů`} innerRef={refs.talents}>
                <TalentList
                    talents={Array.isArray(char.talents) ? char.talents : []}
                    onRemove={handleRemoveTalent}
                    onOpenPicker={() => setShowTalentPicker(true)}
                    onUpgrade={handleUpgradeTalent}
                    onDowngrade={handleDowngradeTalent}
                    onShowFullTalent={handleShowFullTalent}
                    onDetailOpenChange={setIsTalentDetailOpen}
                />
                {showTalentPicker && (
                    <TalentPicker
                        char={char}
                        onAdd={handleAddTalent}
                        onClose={() => setShowTalentPicker(false)}
                    />
                )}
            </SheetTile>

            <SheetTile {...tileProps('spells')} title="Kouzla" icon={Wand2} summary={`${spellCount} naučených kouzel`}>
                <SpellList
                    spells={Array.isArray(char.spells) ? char.spells : []}
                    onRemove={handleRemoveSpell}
                    onOpenPicker={() => setShowSpellPicker(true)}
                    onShowFullSpell={handleShowFullSpell}
                    onDetailOpenChange={setIsSpellDetailOpen}
                />
                {showSpellPicker && (
                    <SpellPicker
                        char={char}
                        onAdd={handleAddSpell}
                        onClose={() => setShowSpellPicker(false)}
                    />
                )}
            </SheetTile>

            <SheetTile {...tileProps('notes')} title="Poznámky" icon={Scroll} summary={char.notes?.trim() ? 'Obsahují záznamy' : 'Prázdné'} innerRef={refs.notes}>
                <textarea
                    className="w-full h-48 bg-fl-paper-bright border border-fl-paper rounded p-3 text-sm text-fl-surface focus:border-fl-primary focus:outline-none resize-y font-serif leading-relaxed"
                    placeholder="Deníkové záznamy, úkoly, poznámky..."
                    value={char.notes}
                    onChange={e => updateField('notes', e.target.value)}
                />
            </SheetTile>
        </div>
    );
};

export default CharacterSheet;
