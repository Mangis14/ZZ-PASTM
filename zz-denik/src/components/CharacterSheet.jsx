import React, { useState } from 'react';
import { Flame, Star, Scroll } from 'lucide-react';
import Card from './common/Card';
import SectionHeader from './common/SectionHeader';
import Navigation from './layout/Navigation';

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
import { TALENTS_DATA } from '../data/talents_data';

const CharacterSheet = ({ char, updateField, updateDeep, onRoll, refs, scrollToSection, setCurrentView }) => {
    const [showTalentPicker, setShowTalentPicker] = useState(false);
    const [showSpellPicker, setShowSpellPicker] = useState(false);

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
        setShowTalentPicker(false);
    };

    const handleRemoveTalent = (index) => {
        const newTalents = [...(char.talents || [])];
        newTalents.splice(index, 1);
        updateField('talents', newTalents);
    };

    const handleUpgradeTalent = (talent) => {
        const talents = Array.isArray(char.talents) ? char.talents : [];
        const allTalents = [...(TALENTS_DATA.profession || []), ...(TALENTS_DATA.general || [])];
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
        const allTalents = [...(TALENTS_DATA.profession || []), ...(TALENTS_DATA.general || [])];
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
        if (spells.find(s => s.id === spell.id)) {
            setShowSpellPicker(false);
            return;
        }
        updateField('spells', [...spells, spell]);
        setShowSpellPicker(false);
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

    return (
        <>
            <div style={{ paddingTop: 'calc(env(safe-area-inset-top) + 200px)' }}></div>
            <Navigation scrollToSection={scrollToSection} />

            <SheetBasicInfo char={char} updateField={updateField} />
            
            <SheetAttributes char={char} updateField={updateField} onRoll={onRoll} innerRef={refs.attributes} />

            <SheetCriticals char={char} updateField={updateField} updateDeep={updateDeep} />

            <SheetSkills char={char} updateField={updateField} onRoll={onRoll} innerRef={refs.skills} />

            <SheetCombat char={char} updateDeep={updateDeep} innerRef={refs.combat} />

            <SheetInventory 
                char={char} 
                updateDeep={updateDeep} 
                updateField={updateField} 
                innerRef={refs.inventory} 
                handleAddInventorySlot={handleAddInventorySlot}
            />

            <SheetMounts char={char} updateField={updateField} />

            <SheetConsumables char={char} updateField={updateField} innerRef={refs.consumables} />

            {/* TALENTS */}
            <Card innerRef={refs.talents}>
                <SectionHeader title="Talenty" icon={Star} />
                <TalentList
                    talents={Array.isArray(char.talents) ? char.talents : []}
                    onRemove={handleRemoveTalent}
                    onOpenPicker={() => setShowTalentPicker(true)}
                    onUpgrade={handleUpgradeTalent}
                    onDowngrade={handleDowngradeTalent}
                    onShowFullTalent={handleShowFullTalent}
                />
                {showTalentPicker && (
                    <TalentPicker
                        char={char}
                        onAdd={handleAddTalent}
                        onClose={() => setShowTalentPicker(false)}
                    />
                )}
            </Card>

            {/* SPELLS */}
            <Card>
                <SectionHeader title="Kouzla" icon={Flame} />
                <SpellList
                    spells={Array.isArray(char.spells) ? char.spells : []}
                    onRemove={handleRemoveSpell}
                    onOpenPicker={() => setShowSpellPicker(true)}
                    onShowFullSpell={handleShowFullSpell}
                />
                {showSpellPicker && (
                    <SpellPicker
                        char={char}
                        onAdd={handleAddSpell}
                        onClose={() => setShowSpellPicker(false)}
                    />
                )}
            </Card>

            {/* NOTES */}
            <Card innerRef={refs.notes}>
                <SectionHeader title="Poznámky" icon={Scroll} />
                <textarea
                    className="w-full h-48 bg-fl-paper-bright border border-fl-paper rounded p-3 text-sm text-fl-surface focus:border-fl-primary focus:outline-none resize-y font-serif leading-relaxed"
                    placeholder="Deníkové záznamy, úkoly, poznámky..."
                    value={char.notes}
                    onChange={e => updateField('notes', e.target.value)}
                />
            </Card>
        </>
    );
};

export default CharacterSheet;
