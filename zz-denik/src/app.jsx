
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X } from 'lucide-react';

import Toaster from './components/common/Toast';
import { ConfirmHost, confirmAction } from './components/common/ConfirmDialog';
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
import MenuDrawer from './components/layout/MenuDrawer';
import CharacterSheet from './components/CharacterSheet';
import useDialog from './hooks/useDialog';
import { registerBackHandler, syncSystemBars } from './native/platform';
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

const THEME_META_COLORS = { light: '#fdfaf3', dark: '#1a2030' };

const getInitialDarkMode = () => {
  const stored = localStorage.getItem('fl_theme');
  if (stored) return stored === 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

// --- VÝBER SPÔSOBU VYTVORENIA POSTAVY ---

const NewCharacterChoiceDialog = ({ onClose, onWizard, onBlank }) => {
  const panelRef = useDialog(onClose);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fl-new-char-title"
        className="w-full max-w-md rounded-2xl border border-fl-primary/60 bg-fl-card p-6 shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="fl-new-char-title" className="font-serif text-2xl font-bold text-fl-primary">Nová postava</h2>
            <p className="mt-1 text-sm text-fl-text-muted">Vyberte způsob vytvoření postavy.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fl-text-muted transition-colors hover:bg-fl-paper hover:text-fl-primary active:bg-fl-paper"
            aria-label="Zavřít"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onWizard}
            className="w-full rounded-xl border border-fl-primary bg-fl-primary p-4 text-left font-bold text-fl-bg shadow-sm transition-all hover:bg-fl-primary-hover active:scale-[0.98]"
          >
            Tvorba postavy krok za krokem
            <span className="mt-1 block text-xs font-normal opacity-80">
              Průvodce vlastnostmi, dovednostmi, talenty a výstrojí.
            </span>
          </button>
          <button
            type="button"
            onClick={onBlank}
            className="w-full rounded-xl border border-fl-border bg-fl-paper p-4 text-left font-bold text-fl-surface transition-all hover:border-fl-primary active:scale-[0.98]"
          >
            Prázdná postava
            <span className="mt-1 block text-xs font-normal text-fl-text-muted">
              Všechny hodnoty doplníte ručně v deníku.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const toastTimer = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('fl_theme', isDarkMode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isDarkMode ? THEME_META_COLORS.dark : THEME_META_COLORS.light);
    syncSystemBars(isDarkMode);
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

  // Systémové Späť na koreni aplikácie: z inej sekcie vráti na denník,
  // z denníka nechá aplikáciu minimalizovať (Android konvencia).
  const viewRef = useRef(currentView);
  viewRef.current = currentView;
  useEffect(() => registerBackHandler(() => {
    if (viewRef.current !== 'sheet') {
      setCurrentViewRaw('sheet');
      return true;
    }
    return false;
  }), []);

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
        showToast("Chyba při načítání postavy z paměti!", 'error');
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

  const showToast = (msg, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message: msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
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

  const deleteChar = async (id, e) => {
    e.stopPropagation();
    const target = savedChars[id];
    const confirmed = await confirmAction({
      title: `Smazat postavu ${target?.name || 'Bezejmenný'}?`,
      message: 'Postava bude trvale odstraněna z tohoto zařízení.',
      confirmLabel: 'Smazat',
      danger: true
    });
    if (!confirmed) return;

    const newSaved = { ...savedChars };
    delete newSaved[id];
    setSavedChars(newSaved);
    localStorage.setItem('fl_characters', JSON.stringify(newSaved));
    showToast('Postava smazána');
    if (char.id === id) createNew();
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
        showToast('Tento talent už ovládaš naplno.', 'info');
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
        showToast('Toto kúzlo už máš v denníku.', 'info');
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
        const offset = headerHeight + 12;
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

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-fl-paper-bright text-fl-primary">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-fl-paper border-t-fl-primary" aria-hidden="true" />
        <p className="font-serif text-lg font-bold" role="status">Načítám deník…</p>
      </div>
    );
  }

  const startRoll = (base = 0, skill = 0, gear = 0) => {
    setInitialDice({ base, skill, gear });
    setShowDiceModal(true);
  };

  return (
    <div className="min-h-screen bg-fl-bg text-fl-surface font-sans selection:bg-fl-primary selection:text-white">
      <ConfirmHost />
      {toast && <Toaster message={toast.message} type={toast.type} />}
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
        <NewCharacterChoiceDialog
          onClose={() => setShowNewCharChoice(false)}
          onWizard={() => {
            setShowNewCharChoice(false);
            setShowCreationWizard(true);
          }}
          onBlank={createNewDirect}
        />
      )}
      {showCreationWizard && (
        <CharacterCreationWizard
          onComplete={createFromWizard}
          onClose={() => setShowCreationWizard(false)}
          showToast={showToast}
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

      {showMenu && (
        <MenuDrawer
          onClose={() => setShowMenu(false)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          savedChars={savedChars}
          currentCharId={char.id}
          onCreateNew={createNew}
          onLoadChar={loadChar}
          onDeleteChar={deleteChar}
          onOpenCrit={() => { setShowCritModal(true); setShowMenu(false); }}
          onOpenDice={() => { setInitialDice(null); setShowDiceModal(true); setShowMenu(false); }}
          onOpenWeather={() => { setCurrentView('weather'); setShowMenu(false); }}
          onOpenRules={() => { setShowRulesModal(true); setShowMenu(false); }}
          onOpenData={() => { setShowDataModal(true); setShowMenu(false); }}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto space-y-6 min-h-[80vh] main-content-layout">
        <div key={currentView} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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

      <BottomNav activeSection={currentView} onSectionChange={setCurrentView} hidden={showMenu} />
    </div>
  );
};

export default App;
