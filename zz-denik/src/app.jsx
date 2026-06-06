
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Menu, X, Plus, Skull, Dices, Download, Upload, Trash2, CloudRain, Sun, Moon, BookOpen
} from 'lucide-react';

import Toaster from './components/common/Toast';
import ZboziSection from './ZboziSection';
import TalentsSection from './TalentsSection';
import SpellsSection from './SpellsSection';
import WeatherSection from './WeatherSection';
import DiceRollerModal from './DiceRollerModal';
import CriticalInjuryModal from './CriticalInjuryModal';
import CharacterCreationWizard from './components/CharacterCreationWizard';
import DataManagementModal from './components/DataManagementModal';
import RulesReferenceModal from './components/RulesReferenceModal';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import CharacterSheet from './components/CharacterSheet';
import { TALENTS_DATA } from './data/talents_data';

// --- DEFINÍCIE A DÁTA (MUSIA BYŤ NA ZAČIATKU) ---

const defaultCharacter = {
  id: null,
  lastSaved: null,
  name: '',
  kin: '',
  profession: '',
  attributes: {
    strength: { current: 0, max: 0 },
    agility: { current: 0, max: 0 },
    wits: { current: 0, max: 0 },
    empathy: { current: 0, max: 0 }
  },
  conditions: {
    hungry: false, thirsty: false, sleepy: false, cold: false
  },
  skills: {
    might: 0, endurance: 0, melee: 0, crafting: 0,
    stealth: 0, sleightOfHand: 0, move: 0, marksmanship: 0,
    scouting: 0, lore: 0, survival: 0, insight: 0,
    manipulation: 0, performance: 0, healing: 0, animalHandling: 0
  },
  talents: [], // Array of objects { id, name, rank, description }
  spells: [],  // Array of objects { id, name, rank, range, duration, ingredient, description, school }
  weapons: Array(3).fill({ name: '', bonus: '', damage: '', range: '', note: '', weight: 1 }),
  armor: { name: '', bonus: '', rating: '', weight: 1 },
  helmet: { name: '', bonus: '', rating: '', weight: 1 },
  shield: { name: '', bonus: '', rating: '', weight: 1 },
  inventory: Array(10).fill({ name: '', weight: 1 }),
  consumables: { food: 0, water: 0, arrows: 0, torches: 0, alcohol: 0, tobacco: 0 },
  money: { gold: 0, silver: 0, copper: 0 },
  experience: 0,
  willpower: 0,
  timeOfDay: 0, // 0=Ráno, 1=Den, 2=Večer, 3=Noc
  criticalInjuries: [], // Array of { description, lethal, healingTime }
  mounts: [], // Array of { name, encumbranceLimit, inventory: [] }
  notes: ''
};

const ALL_TALENTS = [...(TALENTS_DATA.profession || []), ...(TALENTS_DATA.general || [])];

// --- HLAVNÝ KOMPONENT APP ---

const App = () => {
  const [char, setChar] = useState(defaultCharacter);
  const [savedChars, setSavedChars] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDiceModal, setShowDiceModal] = useState(false);
  const [initialDice, setInitialDice] = useState(null);
  const [showCritModal, setShowCritModal] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [showNewCharChoice, setShowNewCharChoice] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [currentView, setCurrentViewRaw] = useState('sheet');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('fl_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fl_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fl_theme', 'light');
    }
  }, [isDarkMode]);

  const refs = {
    profile: useRef(null),
    money: useRef(null),
    attributes: useRef(null),
    skills: useRef(null),
    combat: useRef(null),
    inventory: useRef(null),
    consumables: useRef(null),
    talents: useRef(null),
    notes: useRef(null)
  };

  const setCurrentView = (newView) => {
    if (newView === currentView) return;
    setCurrentViewRaw(newView);
  };

  useEffect(() => {
    const saved = localStorage.getItem('fl_characters');
    
    // Helper to deeply merge old chars with default schema to prevent undefined errors
    const mergeWithDefault = (oldChar) => {
      const merged = JSON.parse(JSON.stringify(defaultCharacter)); // Deep clone default
      if (!oldChar) return merged;
      
      // Merge top level and objects safely
      Object.keys(oldChar).forEach(k => {
        if (oldChar[k] && typeof oldChar[k] === 'object' && !Array.isArray(oldChar[k])) {
          merged[k] = { ...merged[k], ...oldChar[k] };
        } else if (oldChar[k] !== undefined) {
          merged[k] = oldChar[k];
        }
      });
      return merged;
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migratedChars = {};
        Object.keys(parsed).forEach(id => {
          migratedChars[id] = mergeWithDefault(parsed[id]);
        });
        setSavedChars(migratedChars);
        
        const lastId = localStorage.getItem('fl_last_char_id');
        if (lastId && migratedChars[lastId]) {
          setChar(migratedChars[lastId]);
        } else {
          setChar(mergeWithDefault({}));
        }
      } catch(e) {
        console.error("Local storage corruption", e);
        showToast("Chyba při načítání postavy z paměti!");
      }
    }
    setIsLoaded(true);
  }, []);

  const savedCharacterCount = Object.keys(savedChars).length;

  useEffect(() => {
    if (isLoaded && savedCharacterCount === 0 && !char.id) {
      setShowNewCharChoice(true);
    }
  }, [isLoaded, savedCharacterCount, char.id]);

  useEffect(() => {
    if (isLoaded && char.id) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        const updated = { ...savedChars, [char.id]: { ...char, lastSaved: Date.now() } };
        setSavedChars(updated);
        localStorage.setItem('fl_characters', JSON.stringify(updated));
        localStorage.setItem('fl_last_char_id', char.id);
        setIsSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [char, isLoaded]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const createNewDirect = () => {
    const newChar = {
      ...JSON.parse(JSON.stringify(defaultCharacter)),
      id: Date.now().toString(),
      lastSaved: Date.now()
    };
    setChar(newChar);
    setSavedChars(prev => ({ ...prev, [newChar.id]: newChar }));
    setShowNewCharChoice(false);
    setShowMenu(false);
    showToast("Nová prázdná postava vytvořena");
  };

  const createNew = () => {
    setShowMenu(false);
    setShowNewCharChoice(true);
  };

  const createFromWizard = (newChar) => {
    const completedChar = {
      ...JSON.parse(JSON.stringify(defaultCharacter)),
      ...newChar,
      id: newChar.id || Date.now().toString(),
      lastSaved: Date.now()
    };

    setChar(completedChar);
    setSavedChars(prev => {
      const updated = { ...prev, [completedChar.id]: completedChar };
      localStorage.setItem('fl_characters', JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem('fl_last_char_id', completedChar.id);
    setCurrentView('sheet');
    setShowCreationWizard(false);
    showToast(`Postava ${completedChar.name || 'Bezejmenný'} vytvořena!`);
  };

  const loadChar = (id) => {
    setChar(savedChars[id]);
    setShowMenu(false);
    showToast("Postava načtena");
  };

  const deleteChar = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Opravdu smazat?")) {
      const newSaved = { ...savedChars };
      delete newSaved[id];
      setSavedChars(newSaved);
      localStorage.setItem('fl_characters', JSON.stringify(newSaved));
      if (char.id === id) createNew();
    }
  };

  const importAllCharacters = (data) => {
    setSavedChars(data);
    localStorage.setItem('fl_characters', JSON.stringify(data));
    
    // Switch to first character in imported database if any
    const firstId = Object.keys(data)[0];
    if (firstId && data[firstId]) {
      setChar(data[firstId]);
      localStorage.setItem('fl_last_char_id', firstId);
    }
    
    setShowDataModal(false);
    showToast("Záloha všech postav obnovena!");
  };

  const importSingleCharacter = (newChar) => {
    let finalId = newChar.id || Date.now().toString();
    
    // Check if ID collision exists
    if (savedChars[finalId]) {
      finalId = Date.now().toString();
    }

    const mergedChar = { 
      ...newChar, 
      id: finalId, 
      lastSaved: Date.now() 
    };

    setSavedChars(prev => {
      const updated = { ...prev, [finalId]: mergedChar };
      localStorage.setItem('fl_characters', JSON.stringify(updated));
      return updated;
    });

    setChar(mergedChar);
    localStorage.setItem('fl_last_char_id', finalId);
    
    setShowDataModal(false);
    showToast(`Postava ${mergedChar.name || 'Bezejmenný'} importována!`);
  };

  const updateField = (path, value) => {
    setChar(prev => {
      const newChar = { ...prev };
      const parts = path.split('.');
      let current = newChar;
      for (let i = 0; i < parts.length - 1; i++) current = current[parts[i]];
      current[parts[parts.length - 1]] = value;
      return newChar;
    });
  };

  const addItemToInventory = (item) => {
    setChar(prev => {
      const newInv = [...prev.inventory];
      const parsedWeight = item.weight !== undefined && item.weight !== null && !isNaN(Number(item.weight)) ? Number(item.weight) : 0;
      // Find first empty slot
      const emptyIndex = newInv.findIndex(i => !i.name);
      if (emptyIndex !== -1) {
        newInv[emptyIndex] = { name: item.name, weight: parsedWeight };
        showToast(`Přidáno: ${item.name}`);
      } else {
        // If full, add to end (or handle as full)
        newInv.push({ name: item.name, weight: parsedWeight });
        showToast(`Inventář plný, přidáno na konec: ${item.name}`);
      }
      return { ...prev, inventory: newInv };
    });
  };

  const equipItemDirectly = (item) => {
    const parseWeightLocal = (w) => {
      if (!w) return 0;
      const str = String(w).toLowerCase().trim();
      if (['–', '-', 'drobné', 'drobný', 'drobná', '', '0'].includes(str)) return 0;
      if (str.includes('lehk') || str.includes('1/2') || str.includes('½')) return 0.5;
      if (str.includes('normální') || str.includes('běžn')) return 1;
      if (str.includes('těžk')) return 2;
      const num = parseFloat(str.replace(',', '.'));
      return isNaN(num) ? 0 : num;
    };

    if (item.Category === 'Zbroj') {
      const nameLower = (item.Předmět || '').toLowerCase();
      const slot = nameLower.includes('štít') ? 'shield' :
                   (nameLower.includes('čapka') || nameLower.includes('přilbice') || nameLower.includes('helma') || nameLower.includes('čelenka')) ? 'helmet' : 'armor';
      
      setChar(prev => ({
        ...prev,
        [slot]: {
          name: item.Předmět,
          bonus: item.Bonus || '',
          rating: item.Zbroj || '',
          weight: parseWeightLocal(item.Váha)
        }
      }));
      
      const slotLabels = { shield: 'Štít', helmet: 'Helma', armor: 'Zbroj' };
      showToast(`${slotLabels[slot]} ${item.Předmět} vybaven!`);
    } else if (item.Category === 'Zbraně nablízko' || item.Category === 'Střelné zbraně') {
      const weaponObj = {
        name: item.Předmět,
        bonus: item.Bonus || '',
        damage: item.Zranění || '',
        range: item.Category === 'Střelné zbraně' ? (item.Vlastnosti || 'Střední') : 'Blízká',
        note: item.Vlastnosti || '',
        weight: parseWeightLocal(item.Váha)
      };

      let targetIdx = 0;
      setChar(prev => {
        const newWeapons = [...prev.weapons];
        const emptyIndex = newWeapons.findIndex(w => !w.name);
        targetIdx = emptyIndex === -1 ? 0 : emptyIndex;
        newWeapons[targetIdx] = weaponObj;
        return { ...prev, weapons: newWeapons };
      });
      
      showToast(`Zbraň ${item.Předmět} vybavena do slotu ${targetIdx + 1}!`);
    }
  };

  const learnTalent = (talentDefinition) => {
    setChar(prev => {
      const talents = Array.isArray(prev.talents) ? prev.talents : [];
      const existingTalent = talents.find(talent => talent.id === talentDefinition.id);
      const fullTalent = ALL_TALENTS.find(talent => talent.id === talentDefinition.id) || talentDefinition;
      const maxRank = fullTalent?.ranks?.length || existingTalent?.rank || 1;

      if (!existingTalent) {
        const firstRank = fullTalent?.ranks?.[0];
        showToast('Pridané do denníka!');
        return {
          ...prev,
          talents: [
            ...talents,
            {
              id: fullTalent.id,
              name: fullTalent.name,
              rank: 1,
              description: firstRank?.description || fullTalent.description || '',
              profession: fullTalent.profession
            }
          ]
        };
      }

      if (existingTalent.rank >= maxRank) {
        showToast('Tento talent už ovládaš naplno.');
        return prev;
      }

      const nextRank = existingTalent.rank + 1;
      const nextRankData = fullTalent?.ranks?.[nextRank - 1];

      showToast('Úroveň talentu zvýšená!');
      return {
        ...prev,
        talents: talents.map(talent =>
          talent.id === existingTalent.id
            ? {
                ...talent,
                rank: nextRank,
                description: nextRankData?.description || talent.description,
                profession: fullTalent.profession || talent.profession
              }
            : talent
        )
      };
    });
  };

  const learnSpell = (spellDefinition) => {
    setChar(prev => {
      const spells = Array.isArray(prev.spells) ? prev.spells : [];

      if (spells.some(spell => spell.id === spellDefinition.id)) {
        showToast('Toto kúzlo už máš v denníku.');
        return prev;
      }

      showToast('Pridané do denníka!');
      return {
        ...prev,
        spells: [
          ...spells,
          {
            id: spellDefinition.id,
            name: spellDefinition.name,
            rank: spellDefinition.rank,
            range: spellDefinition.range,
            duration: spellDefinition.duration,
            ingredient: spellDefinition.ingredient,
            description: spellDefinition.description,
            school: spellDefinition.school || spellDefinition._school
          }
        ]
      };
    });
  };

  const updateDeep = (section, index, field, value) => {
    setChar(prev => {
      if (index === null) { // For armor, helmet, shield which are objects, not arrays
        return { ...prev, [section]: { ...prev[section], [field]: value } };
      }
      const newArr = [...prev[section]];
      newArr[index] = { ...newArr[index], [field]: value };
      return { ...prev, [section]: newArr };
    });
  };

  const scrollToSection = (key) => {
    setCurrentView('sheet');
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('fl:navigate-sheet-section', { detail: { section: key } }));
      window.setTimeout(() => {
        const target = refs[key]?.current;
        if (!target) return;

        const headerHeight = document.querySelector('[data-mobile-header]')?.getBoundingClientRect().height || 0;
        const sheetNavHeight = document.querySelector('[data-sheet-nav]')?.getBoundingClientRect().height || 0;
        const offset = headerHeight + sheetNavHeight + 12;
        const absoluteTop = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: Math.max(0, absoluteTop),
          behavior: 'smooth'
        });
      }, 100);
    }, currentView === 'sheet' ? 0 : 180);
  };

  const totalWeight = useMemo(() => {
    let w = 0;
    ['weapons', 'inventory'].forEach(k => char[k].forEach(i => { if (i.name) w += (i.weight || 0); }));
    ['armor', 'helmet', 'shield'].forEach(k => { if (char[k].name) w += (char[k].weight || 0); });
    return w;
  }, [char]);

  const soumarTalent = (Array.isArray(char.talents) ? char.talents : []).find(talent =>
    talent.id === 'soumar' || talent.name?.toLocaleLowerCase('cs-CZ') === 'soumar'
  );
  const soumarRank = Number(soumarTalent?.rank || 0);
  const soumarEncumbranceBonus = soumarRank >= 3 ? 10 : soumarRank === 2 ? 5 : soumarRank === 1 ? 2 : 0;
  const encumbranceLimit = (char.attributes.strength.max * 2) + soumarEncumbranceBonus;
  const isOverencumbered = totalWeight > encumbranceLimit;

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-fl-bg text-fl-primary">Načítám...</div>;

  const startRoll = (base = 0, skill = 0, gear = 0) => {
    setInitialDice({ base, skill, gear });
    setShowDiceModal(true);
  };

  return (
    <div className="min-h-screen bg-fl-bg text-fl-surface font-sans selection:bg-fl-primary selection:text-white">
      {toast && <Toaster message={toast} />}
      {showDiceModal && <DiceRollerModal initialRoll={initialDice} onClose={() => setShowDiceModal(false)} />}
      {showCritModal && <CriticalInjuryModal onClose={() => setShowCritModal(false)} />}
      {showDataModal && (
        <DataManagementModal
          char={char}
          savedChars={savedChars}
          onClose={() => setShowDataModal(false)}
          onImportAll={importAllCharacters}
          onImportSingle={importSingleCharacter}
          showToast={showToast}
        />
      )}
      {showRulesModal && (
        <RulesReferenceModal onClose={() => setShowRulesModal(false)} />
      )}
      {showNewCharChoice && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowNewCharChoice(false)}
        >
          <div
            className="w-full max-w-md rounded-lg border-2 border-fl-primary bg-fl-card p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-fl-primary">Nová postava</h2>
                <p className="mt-1 text-sm text-fl-text-muted">Vyberte způsob vytvoření postavy.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCharChoice(false)}
                className="text-fl-text-muted transition-colors hover:text-fl-primary"
                aria-label="Zavřít"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewCharChoice(false);
                  setShowCreationWizard(true);
                }}
                className="w-full rounded border border-fl-primary bg-fl-primary p-4 text-left font-bold text-fl-bg transition-colors hover:bg-fl-primary-hover"
              >
                Tvorba postavy krok za krokem
                <span className="mt-1 block text-xs font-normal opacity-80">
                  Průvodce vlastnostmi, dovednostmi, talenty a výstrojí.
                </span>
              </button>
              <button
                type="button"
                onClick={createNewDirect}
                className="w-full rounded border border-fl-border bg-fl-paper p-4 text-left font-bold text-fl-surface transition-colors hover:border-fl-primary"
              >
                Prázdná postava
                <span className="mt-1 block text-xs font-normal text-fl-text-muted">
                  Všechny hodnoty doplníte ručně v deníku.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreationWizard && (
        <CharacterCreationWizard
          onComplete={createFromWizard}
          onClose={() => setShowCreationWizard(false)}
        />
      )}

      <Header
        char={char}
        updateField={updateField}
        toggleMenu={() => setShowMenu(!showMenu)}
        isSaving={isSaving}
        totalWeight={totalWeight}
        encumbranceLimit={encumbranceLimit}
        isOverencumbered={isOverencumbered}
        onNavigate={scrollToSection}
      />

      {/* MENU MODAL */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] flex items-start justify-start" onClick={() => setShowMenu(false)}>
          <div
            className="w-[min(22rem,calc(100vw-2.5rem))] bg-fl-nav border-r border-fl-primary px-6 overflow-y-auto shadow-2xl"
            style={{
              height: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
              marginTop: 'env(safe-area-inset-top)',
              paddingTop: '1.5rem',
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8 border-b border-fl-nav-hover pb-4">
              <h2 className="font-serif text-2xl text-fl-paper-bright dark:text-fl-surface font-bold">Deník</h2>
              <button onClick={() => setShowMenu(false)} className="text-fl-primary hover:text-white"><X /></button>
            </div>

            <button onClick={createNew} className="w-full flex items-center gap-3 p-4 bg-fl-primary text-fl-bg font-bold rounded hover:bg-fl-primary-hover transition-colors mb-6 shadow-lg">
              <Plus size={20} /> Nová postava
            </button>

            <button onClick={() => { setShowCritModal(true); setShowMenu(false); }} className="w-full flex items-center gap-3 p-4 bg-red-900 text-fl-paper-light font-bold rounded hover:bg-red-800 transition-colors mb-4 shadow-lg border border-red-700">
              <Skull size={20} /> Kritické Zranění
            </button>

            <button onClick={() => { setInitialDice(null); setShowDiceModal(true); setShowMenu(false); }} className="w-full flex items-center gap-3 p-4 bg-fl-paper text-fl-surface font-bold rounded hover:bg-fl-card transition-colors mb-4 shadow-lg border border-fl-primary">
              <Dices size={20} /> Hod Kostkami
            </button>

            <button onClick={() => { setCurrentView('weather'); setShowMenu(false); }} className="w-full flex items-center gap-3 p-4 bg-blue-900 text-fl-paper-light font-bold rounded hover:bg-blue-800 transition-colors mb-4 shadow-lg border border-blue-700">
              <CloudRain size={20} /> Počasí
            </button>

            <button onClick={() => { setShowRulesModal(true); setShowMenu(false); }} className="w-full flex items-center gap-3 p-4 bg-amber-900 text-fl-paper-light font-bold rounded hover:bg-amber-800 transition-colors mb-6 shadow-lg border border-amber-700">
              <BookOpen size={20} /> Pravidla & Tahák
            </button>

            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-3 p-4 bg-fl-bg text-fl-primary font-bold rounded hover:bg-fl-nav-hover transition-colors mb-6 shadow-lg border border-fl-border">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
              {isDarkMode ? "Světlý Režim" : "Temný Režim (Dungeon)"}
            </button>

            <div className="space-y-2 mb-8">
              <h3 className="text-xs font-bold uppercase text-fl-text-muted mb-2 tracking-widest">Uložené postavy</h3>
              {Object.values(savedChars).sort((a, b) => b.lastSaved - a.lastSaved).map(c => (
                <div key={c.id} onClick={() => loadChar(c.id)} className={`p-3 rounded border cursor-pointer flex justify-between items-center group transition-all ${char.id === c.id ? 'bg-fl-nav-hover border-fl-primary text-white' : 'border-fl-border text-fl-border hover:bg-fl-nav-hover hover:text-white'}`}>
                  <div>
                    <div className="font-bold">{c.name || 'Bezejmenný'}</div>
                    <div className="text-xs opacity-60">{c.kin} {c.profession}</div>
                  </div>
                  <button onClick={(e) => deleteChar(c.id, e)} className="p-2 text-red-900 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-fl-nav-hover">
              <button onClick={() => { setShowDataModal(true); setShowMenu(false); }} className="flex flex-col items-center gap-2 p-3 bg-fl-bg rounded border border-fl-border text-fl-primary hover:text-white hover:border-fl-primary transition-colors">
                <Download size={20} /> <span className="text-xs font-bold uppercase">Export</span>
              </button>
              <button onClick={() => { setShowDataModal(true); setShowMenu(false); }} className="flex flex-col items-center gap-2 p-3 bg-fl-bg rounded border border-fl-border text-fl-primary hover:text-white hover:border-fl-primary transition-colors">
                <Upload size={20} /> <span className="text-xs font-bold uppercase">Import</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 space-y-6 min-h-[80vh] main-content-layout">
        <div key={currentView}>
        {currentView === 'sheet' ? (
            <CharacterSheet
            char={char}
            updateField={updateField}
            updateDeep={updateDeep}
            addItemToInventory={addItemToInventory}
            onRoll={startRoll}
            refs={refs}
            scrollToSection={scrollToSection}
            setCurrentView={setCurrentView}
            onModalStateChange={setIsSheetModalOpen}
            totalWeight={totalWeight}
            encumbranceLimit={encumbranceLimit}
            isOverencumbered={isOverencumbered}
          />
        ) : currentView === 'zbozi' ? (
          <ZboziSection addItemToInventory={addItemToInventory} equipItem={equipItemDirectly} />
        ) : currentView === 'talents' ? (
          <TalentsSection char={char} onLearnTalent={learnTalent} />
        ) : currentView === 'spells' ? (
          <SpellsSection char={char} onLearnSpell={learnSpell} />
        ) : (
          <WeatherSection />
        )}
        </div>
      </main>

      {!showMenu && <BottomNav activeSection={currentView} onSectionChange={setCurrentView} />}
    </div>
  );
};

export default App;
