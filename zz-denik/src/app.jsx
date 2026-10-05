
import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { X } from 'lucide-react';

import Toaster from './components/common/Toast';
import { ConfirmHost, confirmAction } from './components/common/ConfirmDialog';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import MenuDrawer from './components/layout/MenuDrawer';
import CharacterSheet from './components/CharacterSheet';
import useDialog from './hooks/useDialog';
import { registerBackHandler, syncSystemBars, exitApp, isNativePlatform } from './native/platform';
import { TALENTS_DATA } from './data/talents_data';
import { calculateAttackDamage, clearPreparedCombatEffects, parseCombatValue } from './utils/combat';
import { createPoisonInventoryItem } from './utils/poisons';
import { getTalentRank } from './utils/talents';
import { advanceStoredWeatherQuarterDay } from './utils/time';
import { KIN_TALENTS } from './data/kin_talents';
import { hasPsychicPower, syncKinTalents } from './utils/kin';

/* Denník je domovská obrazovka a načítava sa hneď; ostatné sekcie
   a veľké modály sa doťahujú až pri prvom použití — skracuje to
   štart aplikácie na slabších zariadeniach. Chunk-y sú lokálne
   v APK, takže prvé otvorenie je prakticky okamžité. */
const ZboziSection = lazy(() => import('./ZboziSection'));
const TalentsSection = lazy(() => import('./TalentsSection'));
const SpellsSection = lazy(() => import('./SpellsSection'));
const WeatherSection = lazy(() => import('./WeatherSection'));
const DiceRollerModal = lazy(() => import('./DiceRollerModal'));
const CriticalInjuryModal = lazy(() => import('./CriticalInjuryModal'));
const CharacterCreationWizard = lazy(() => import('./components/CharacterCreationWizard'));
const DataManagementModal = lazy(() => import('./components/DataManagementModal'));
const RulesReferenceModal = lazy(() => import('./components/RulesReferenceModal'));

const SectionFallback = () => (
  <div className="flex justify-center py-16" role="status" aria-label="Načítám sekci">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-fl-paper border-t-fl-primary" aria-hidden="true" />
  </div>
);

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
  consumables: { food: 0, water: 0, arrows: 0, torches: 0, alcohol: 0, tobacco: 0, rawFood: 0 },
  money: { gold: 0, silver: 0, copper: 0 },
  experience: 0,
  willpower: 0,
  talentState: {
    isBerserking: false,
    berserkerUsedThisFight: false,
    painResistUsesThisFight: 0,
    fearWillpowerUsedThisFight: false,
    cookMealUsedThisQuarterDay: false,
    bonusCombatActions: 0,
    bonusCombatActionTalentId: '',
    extraAttackReady: false,
    ignoreArmorNextMelee: false,
    pendingAttackBonus: 0,
    pendingAttackBonusLabel: '',
    pendingAttackTalentId: '',
    lastAttackSummary: ''
  },
  luckUsedThisQuarterDay: false,
  timeOfDay: 0, // 0=Ráno, 1=Den, 2=Večer, 3=Noc
  criticalInjuries: [], // Array of { description, lethal, healingTime }
  mounts: [], // Array of { name, encumbranceLimit, inventory: [] }
  notes: ''
};

const ALL_TALENTS = [...(TALENTS_DATA.profession || []), ...(TALENTS_DATA.general || []), ...KIN_TALENTS];

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
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4"
      style={{ paddingTop: 'calc(var(--safe-top) + 1rem)' }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fl-new-char-title"
        className="relative w-full max-w-md max-h-full overflow-y-auto overscroll-contain rounded-t-3xl border border-b-0 border-fl-primary/60 bg-fl-card p-6 shadow-2xl outline-none animate-in fade-in slide-in-from-bottom-8 duration-300 sm:rounded-2xl sm:border-b sm:slide-in-from-bottom-0 sm:zoom-in-95 sm:duration-200"
        style={{ paddingBottom: 'max(1.5rem, var(--safe-bottom))' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-fl-border sm:hidden" aria-hidden="true" />
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
  const exitConfirmOpen = useRef(false);
  const strengthTriggerOpen = useRef(false);

  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isDarkMode ? THEME_META_COLORS.dark : THEME_META_COLORS.light);
    syncSystemBars(isDarkMode);
  }, [isDarkMode]);

  // Voľba sa ukladá len pri ručnom prepnutí; bez nej aplikácia
  // živo sleduje systémový svetlý/tmavý režim.
  const toggleTheme = () => {
    const next = !isDarkMode;
    localStorage.setItem('fl_theme', next ? 'dark' : 'light');
    setIsDarkMode(next);
  };

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;
    const followSystem = (event) => {
      if (!localStorage.getItem('fl_theme')) setIsDarkMode(event.matches);
    };
    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, []);

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

  // Systémové Späť na koreni aplikácie (keď nie je otvorený žiadny dialóg):
  // 1. odskrolovaná stránka → najprv návrat úplne hore,
  // 2. iná sekcia → návrat na denník,
  // 3. denník hore → potvrdenie a úplné ukončenie aplikácie.
  const viewRef = useRef(currentView);
  viewRef.current = currentView;
  useEffect(() => registerBackHandler(() => {
    if (window.scrollY > 10) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }
    if (viewRef.current !== 'sheet') {
      setCurrentViewRaw('sheet');
      return true;
    }
    if (!isNativePlatform) return false;
    if (exitConfirmOpen.current) return true;
    exitConfirmOpen.current = true;
    (async () => {
      try {
        const confirmed = await confirmAction({
          title: 'Ukončit aplikaci?',
          message: 'Všechny postavy jsou uložené v zařízení.',
          confirmLabel: 'Ukončit',
          cancelLabel: 'Zůstat'
        });
        if (confirmed) exitApp();
      } finally {
        exitConfirmOpen.current = false;
      }
    })();
    return true;
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
      // Rodové talenty dřív nesly vymyšlené názvy a popisy – srovnáme je s Průvodcem hráče.
      // Cesta zlata byla z pravidel odstraněna; postavy ji mají jako Cestu pokladu.
      if (Array.isArray(merged.talents)) {
        merged.talents = merged.talents.map(talent => {
          if (talent?.id === 'path_of_gold') {
            const treasure = ALL_TALENTS.find(item => item.id === 'kupec-cesta-pokladu');
            const rank = Math.max(1, Math.min(3, Number(talent.rank) || 1));
            return {
              ...talent,
              id: 'kupec-cesta-pokladu',
              name: 'Cesta pokladu',
              description: treasure?.ranks?.[rank - 1]?.description || talent.description
            };
          }
          const kinTalent = KIN_TALENTS.find(item => item.id === talent?.id);
          return kinTalent
            ? { ...talent, name: kinTalent.name, description: kinTalent.ranks[0].description }
            : talent;
        });
      }
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

  // Rodový talent se postavě přiřazuje automaticky podle vyplněného rodu.
  useEffect(() => {
    if (!isLoaded) return;
    setChar(prev => {
      const talents = syncKinTalents(prev);
      return talents === prev.talents ? prev : { ...prev, talents };
    });
  }, [isLoaded, char.kin, char.talents]);

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

  const showToast = (msg, type = 'success', action = null) => {
    clearTimeout(toastTimer.current);
    setToast({ message: msg, type, action });
    // S akciou (napr. Vrátit) necháme viac času na reakciu
    toastTimer.current = setTimeout(() => setToast(null), action ? 5000 : 3000);
  };

  const dismissToast = () => {
    clearTimeout(toastTimer.current);
    setToast(null);
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

  const setFieldValue = (path, value) => {
    setChar(prev => {
      const parts = path.split('.');
      const newChar = { ...prev };
      let current = newChar;
      let source = prev;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        const nextSource = source?.[key];
        current[key] = Array.isArray(nextSource) ? [...nextSource] : { ...(nextSource || {}) };
        current = current[key];
        source = nextSource;
      }
      current[parts[parts.length - 1]] = value;
      return newChar;
    });
  };

  const updateField = async (path, value) => {
    const changesStrength = path === 'attributes.strength' || path === 'attributes.strength.current';
    const previousStrength = Number(char.attributes?.strength?.current) || 0;
    const nextStrength = path === 'attributes.strength'
      ? Number(value?.current) || 0
      : path === 'attributes.strength.current'
        ? Number(value) || 0
        : previousStrength;

    if (!changesStrength || previousStrength <= 0 || nextStrength !== 0 || strengthTriggerOpen.current) {
      setFieldValue(path, value);
      return;
    }

    strengthTriggerOpen.current = true;
    try {
      const berserkerRank = getTalentRank(char, 'berserker');
      const painResistantRank = getTalentRank(char, 'odolny_proti_bolesti');
      const talentState = char.talentState || {};

      if (berserkerRank > 0 && !talentState.berserkerUsedThisFight) {
        const activateBerserker = await confirmAction({
          title: 'Aktivovat běsnění Berserkra?',
          message: `Síla klesla na 0. Obnovíš si ${berserkerRank} bod${berserkerRank === 1 ? '' : 'y'} Síly, získáš +1 ke zranění zblízka a nebudeš moci používat Manipulaci.`,
          confirmLabel: 'Aktivovat',
          cancelLabel: painResistantRank > 0 ? 'Jiná možnost' : 'Zůstat vyřazen'
        });

        if (activateBerserker) {
          setChar(prev => {
            const max = Number(prev.attributes?.strength?.max) || berserkerRank;
            return {
              ...prev,
              attributes: {
                ...prev.attributes,
                strength: {
                  ...(path === 'attributes.strength' ? value : prev.attributes.strength),
                  current: Math.min(max, berserkerRank)
                }
              },
              talentState: {
                ...prev.talentState,
                isBerserking: true,
                berserkerUsedThisFight: true
              }
            };
          });
          showToast(`Berserker aktivován: Síla obnovena na ${berserkerRank}.`, 'info');
          return;
        }
      }

      const painUses = Math.max(0, Number(talentState.painResistUsesThisFight) || 0);
      const canUsePainResistance = painResistantRank > 0 && (painResistantRank >= 2 || painUses < 1);
      if (canUsePainResistance) {
        const activatePainResistance = await confirmAction({
          title: 'Použít Odolnost proti bolesti?',
          message: 'Síla zůstane na 1 místo vyřazení.',
          confirmLabel: 'Zůstat na 1 Síle',
          cancelLabel: 'Zůstat vyřazen'
        });

        if (activatePainResistance) {
          setChar(prev => ({
            ...prev,
            attributes: {
              ...prev.attributes,
              strength: {
                ...(path === 'attributes.strength' ? value : prev.attributes.strength),
                current: 1
              }
            },
            talentState: {
              ...prev.talentState,
              painResistUsesThisFight: (Number(prev.talentState?.painResistUsesThisFight) || 0) + 1
            }
          }));
          showToast('Odolnost proti bolesti tě udržela na 1 Síle.', 'info');
          return;
        }
      }

      setFieldValue(path, value);
    } finally {
      strengthTriggerOpen.current = false;
    }
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

  // Odstránenie slotu inventára s možnosťou vrátenia cez toast
  // (rýchlejšie než potvrdzovací dialóg, bez rizika straty dát).
  const removeInventorySlot = (index) => {
    const removed = char.inventory[index];
    const newInv = [...char.inventory];
    newInv.splice(index, 1);
    updateField('inventory', newInv);

    if (removed?.name?.trim()) {
      showToast(`Odstraněno: ${removed.name}`, 'info', {
        label: 'Vrátit',
        onAction: () => setChar(prev => {
          const restored = [...prev.inventory];
          restored.splice(Math.min(index, restored.length), 0, removed);
          return { ...prev, inventory: restored };
        })
      });
    }
  };

  // Zápis hodeného kritického zranenia priamo do denníka postavy
  const saveCriticalInjury = (injury) => {
    setChar(prev => ({
      ...prev,
      criticalInjuries: [...(prev.criticalInjuries || []), injury]
    }));
    showToast('Zranění zapsáno do deníku');
  };

  const markLuckUsed = () => {
    setChar(prev => ({ ...prev, luckUsedThisQuarterDay: true }));
  };

  const advanceQuarterDay = () => {
    const nextTimeOfDay = ((Number(char.timeOfDay) || 0) + 1) % 4;
    setChar(prev => ({
      ...prev,
      timeOfDay: nextTimeOfDay,
      luckUsedThisQuarterDay: false,
      talentState: {
        ...clearPreparedCombatEffects(prev.talentState),
        cookMealUsedThisQuarterDay: false
      }
    }));
    advanceStoredWeatherQuarterDay(nextTimeOfDay);
    showToast('Začal nový čtvrtden. Čtvrtdenní použití a připravené efekty byly obnoveny.', 'info');
  };

  const resetFight = () => {
    setChar(prev => ({
      ...prev,
      talentState: {
        ...clearPreparedCombatEffects(prev.talentState),
        isBerserking: false,
        berserkerUsedThisFight: false,
        painResistUsesThisFight: 0,
        fearWillpowerUsedThisFight: false
      }
    }));
    showToast('Začal nový boj. Bojové talenty jsou znovu připravené.', 'info');
  };

  const endBerserking = () => {
    setChar(prev => ({
      ...prev,
      talentState: { ...prev.talentState, isBerserking: false }
    }));
    showToast('Běsnění ukončeno.', 'info');
  };

  const receiveFearAttack = () => {
    setChar(prev => {
      const fearlessRank = getTalentRank(prev, 'nebojacny');
      const alreadyGainedWillpower = Boolean(prev.talentState?.fearWillpowerUsedThisFight);

      if (fearlessRank >= 4 && !alreadyGainedWillpower) {
        showToast('Nebojácný: za první útok strachem získáváš 1 bod vůle.', 'info');
        return {
          ...prev,
          willpower: (Number(prev.willpower) || 0) + 1,
          talentState: { ...prev.talentState, fearWillpowerUsedThisFight: true }
        };
      }

      showToast(
        fearlessRank >= 1
          ? 'Útok strachem zaznamenán. Můžeš hodit obranu pomocí Osobnosti.'
          : 'Útok strachem zaznamenán.',
        'info'
      );
      return prev;
    });
  };

  const performCoupDeGrace = async () => {
    const coldBloodedRank = getTalentRank(char, 'chladnokrevny');

    const finishCoupDeGrace = (requiresCost) => {
      setChar(prev => {
        if (requiresCost && (Number(prev.willpower) || 0) < 1) {
          showToast('Rána z milosti vyžaduje 1 bod vůle.', 'error');
          return prev;
        }

        const empathy = prev.attributes?.empathy || { current: 0, max: 0 };
        const currentEmpathy = Number(empathy.current) || 0;
        const maxEmpathy = Number(empathy.max) || 0;
        const nextEmpathy = coldBloodedRank >= 3
          ? Math.min(maxEmpathy, currentEmpathy + 1)
          : requiresCost
            ? Math.max(0, currentEmpathy - 1)
            : currentEmpathy;

        showToast(
          coldBloodedRank >= 3
            ? 'Chladnokrevný: rána z milosti obnovila 1 bod Osobnosti.'
            : 'Rána z milosti provedena.',
          'info'
        );

        return {
          ...prev,
          willpower: requiresCost ? (Number(prev.willpower) || 0) - 1 : prev.willpower,
          attributes: {
            ...prev.attributes,
            empathy: { ...empathy, current: nextEmpathy }
          }
        };
      });
    };

    if (coldBloodedRank < 1) {
      if ((Number(char.willpower) || 0) < 1) {
        showToast('Rána z milosti vyžaduje 1 bod vůle.', 'error');
        return;
      }
      startRoll(Number(char.attributes?.empathy?.current) || 0, 0, 0, {
        title: 'Rána z milosti',
        description: 'Potřebuješ alespoň jeden úspěch. Při úspěchu utratíš 1 vůli a utrpíš 1 zranění Osobnosti.',
        resolveLabel: 'Vyhodnotit ránu z milosti',
        onResolve: (successes) => {
          if (successes < 1) {
            showToast('Rána z milosti se nezdařila.', 'error');
            return;
          }
          finishCoupDeGrace(true);
        }
      });
      return;
    }

    const requiresCost = coldBloodedRank === 1;
    const confirmed = await confirmAction({
      title: 'Provést ránu z milosti?',
      message: requiresCost
        ? 'Chladnokrevný umožní automatický úspěch. Akce utratí 1 vůli a způsobí 1 zranění Osobnosti.'
        : coldBloodedRank >= 3
          ? 'Akce je automatická, bez ceny, a obnoví 1 bod Osobnosti.'
          : 'Akce je automatická, bez ceny a bez zranění Osobnosti.',
      confirmLabel: 'Provést',
      cancelLabel: 'Zrušit',
      danger: true
    });
    if (confirmed) finishCoupDeGrace(requiresCost);
  };

  const clearForgottenTalentEffects = (talentId, nextRank = 0) => {
    setChar(prev => {
      const talentState = prev.talentState || {};
      const clearsPendingAttack = talentState.pendingAttackTalentId === talentId;
      const clearsBonusActions = talentState.bonusCombatActionTalentId === talentId;
      const clearsBladeRankOne = talentId === 'path_of_the_blade' && nextRank < 1;
      const clearsBladeRankTwo = talentId === 'path_of_the_blade' && nextRank < 2;

      if (!clearsPendingAttack && !clearsBonusActions && !clearsBladeRankOne && !clearsBladeRankTwo) {
        return prev;
      }

      return {
        ...prev,
        talentState: {
          ...talentState,
          ...(clearsPendingAttack
            ? { pendingAttackBonus: 0, pendingAttackBonusLabel: '', pendingAttackTalentId: '' }
            : {}),
          ...(clearsBonusActions
            ? { bonusCombatActions: 0, bonusCombatActionTalentId: '' }
            : {}),
          ...(clearsBladeRankOne ? { ignoreArmorNextMelee: false } : {}),
          ...(clearsBladeRankTwo ? { extraAttackReady: false } : {})
        }
      };
    });
  };

  const activateBladeCombatOption = (option) => {
    const bladeRank = getTalentRank(char, 'path_of_the_blade');
    const requiredRank = option === 'ignore-armor' ? 1 : 2;
    if (bladeRank < requiredRank) return;
    if ((Number(char.willpower) || 0) < 1) {
      showToast('Na použití Cesty ostří potřebuješ 1 bod vůle.', 'error');
      return;
    }

    setChar(prev => ({
      ...prev,
      willpower: Math.max(0, (Number(prev.willpower) || 0) - 1),
      talentState: {
        ...prev.talentState,
        ...(option === 'ignore-armor'
          ? { ignoreArmorNextMelee: true }
          : { extraAttackReady: true })
      }
    }));
    showToast(
      option === 'ignore-armor'
        ? 'Cesta ostří: příští útok zblízka ignoruje zbroj.'
        : 'Cesta ostří: útok navíc je připraven.',
      'info'
    );
  };

  const performCombatAttack = ({ weaponIndex, type }) => {
    const weapon = char.weapons?.[weaponIndex];
    if (!weapon?.name?.trim()) {
      showToast('Nejdřív vyber vybavenou zbraň.', 'error');
      return;
    }

    const melee = type !== 'ranged';
    const talentState = char.talentState || {};
    const ignoreArmor = melee && Boolean(talentState.ignoreArmorNextMelee);
    const pendingBonus = Math.max(0, Number(talentState.pendingAttackBonus) || 0);
    const pendingLabel = talentState.pendingAttackBonusLabel || '';
    const berserkerBonus = melee && talentState.isBerserking ? 1 : 0;
    const usesExtraAttack = Boolean(talentState.extraAttackReady);
    const usesBonusAction = !usesExtraAttack && (Number(talentState.bonusCombatActions) || 0) > 0;
    const attributeKey = melee ? 'strength' : 'agility';
    const skillKey = melee ? 'melee' : 'marksmanship';

    setChar(prev => ({
      ...prev,
      talentState: {
        ...prev.talentState,
        ignoreArmorNextMelee: ignoreArmor ? false : prev.talentState?.ignoreArmorNextMelee,
        pendingAttackBonus: 0,
        pendingAttackBonusLabel: '',
        pendingAttackTalentId: '',
        extraAttackReady: usesExtraAttack ? false : prev.talentState?.extraAttackReady,
        bonusCombatActions: usesBonusAction
          ? Math.max(0, (Number(prev.talentState?.bonusCombatActions) || 0) - 1)
          : Number(prev.talentState?.bonusCombatActions) || 0
      }
    }));

    startRoll(
      Number(char.attributes?.[attributeKey]?.current) || 0,
      Number(char.skills?.[skillKey]) || 0,
      Math.max(0, parseCombatValue(weapon.bonus)),
      {
        title: `${melee ? 'Útok zblízka' : 'Střelecký útok'}: ${weapon.name}`,
        description: [
          ignoreArmor ? 'Útok ignoruje zbroj.' : '',
          pendingBonus ? `${pendingLabel || 'Talent'}: +${pendingBonus} ke zranění.` : '',
          berserkerBonus ? 'Běsnění: +1 ke zranění.' : '',
          usesExtraAttack ? 'Spotřebovává připravený útok navíc.' : usesBonusAction ? 'Spotřebovává bonusovou bojovou akci.' : ''
        ].filter(Boolean).join(' '),
        resolveLabel: 'Vyhodnotit útok',
        onResolve: (successes) => {
          const damage = calculateAttackDamage({
            successes,
            weaponDamage: weapon.damage,
            pendingBonus,
            berserkerBonus
          });
          const summary = successes < 1
            ? `${weapon.name}: útok minul.`
            : `${weapon.name}: ${successes} úspěchů, zranění ${damage}${ignoreArmor ? ', ignoruje zbroj' : ''}.`;
          setChar(prev => ({
            ...prev,
            talentState: { ...prev.talentState, lastAttackSummary: summary }
          }));
          showToast(summary, successes < 1 ? 'error' : 'info');
        }
      }
    );
  };

  const applyTalentAction = (action) => {
    if (action?.type === 'poison-roll') {
      const rank = Math.max(1, Math.min(3, Number(action.rank) || 1));
      const usesHealing = action.skill === 'healing';
      const skillKey = usesHealing ? 'healing' : 'crafting';
      const attributeKey = usesHealing ? 'empathy' : 'strength';
      const skillBonus = rank === 2 ? 1 : 0;

      startRoll(
        Number(char.attributes?.[attributeKey]?.current) || 0,
        (Number(char.skills?.[skillKey]) || 0) + skillBonus,
        0,
        {
          d8: rank >= 3 ? 1 : 0,
          title: 'Výroba jedu',
          description: `Hod na ${usesHealing ? 'Léčení' : 'Řemesla'}. První úspěch vytvoří jed o účinnosti 3, každý další ji zvýší o 1.`,
          resolveLabel: 'Dokončit výrobu',
          onResolve: (successes) => {
            if (successes < 1) {
              showToast('Výroba jedu se nezdařila.', 'error');
              return;
            }
            const potency = 3 + Math.max(0, successes - 1);
            addItemToInventory(createPoisonInventoryItem({ type: action.poisonType, potency }));
          }
        }
      );
      return;
    }

    setChar(prev => {
      const spent = Math.max(0, Number(action?.spent) || 0);
      if (spent < 1 || spent > (Number(prev.willpower) || 0)) {
        showToast('Na použití talentu nemáš dost vůle.', 'error');
        return prev;
      }

      if (action.type === 'money') {
        const currency = action.currency === 'gold' ? 'gold' : 'silver';
        const amount = Math.max(0, Number(action.amount) || 0);
        showToast(`${action.actionLabel || 'Talent'} přidal ${amount} ${currency === 'gold' ? 'zlatých' : 'stříbrných'}.`);
        return {
          ...prev,
          willpower: prev.willpower - spent,
          money: { ...prev.money, [currency]: (Number(prev.money?.[currency]) || 0) + amount }
        };
      }

      if (action.type === 'item' && action.item?.name) {
        const inventory = [...prev.inventory];
        const entry = { name: action.item.name, weight: Number(action.item.weight) || 0 };
        const emptyIndex = inventory.findIndex(item => !item.name);
        if (emptyIndex >= 0) inventory[emptyIndex] = entry;
        else inventory.push(entry);
        showToast(`${action.actionLabel || 'Talent'} našel: ${entry.name}`);
        return { ...prev, willpower: prev.willpower - spent, inventory };
      }

      if (action.type === 'poison') {
        const inventory = [...prev.inventory];
        const entry = createPoisonInventoryItem({
          type: action.poisonType,
          potency: action.amount,
          quickApply: Boolean(action.quickApply)
        });
        const emptyIndex = inventory.findIndex(item => !item.name);
        if (emptyIndex >= 0) inventory[emptyIndex] = entry;
        else inventory.push(entry);
        showToast(`${action.actionLabel || 'Talent'} vytvořil: ${entry.name}`);
        return { ...prev, willpower: prev.willpower - spent, inventory };
      }

      if (action.type === 'heal') {
        let remaining = Math.max(0, Number(action.amount) || 0);
        const attributes = { ...prev.attributes };
        let healed = 0;

        Object.entries(action.healing || {}).forEach(([key, requested]) => {
          if (!attributes[key] || remaining <= 0) return;
          const current = Number(attributes[key].current) || 0;
          const max = Number(attributes[key].max) || 0;
          const amount = Math.min(
            remaining,
            Math.max(0, Number(requested) || 0),
            Math.max(0, max - current)
          );
          if (amount <= 0) return;
          attributes[key] = { ...attributes[key], current: current + amount };
          remaining -= amount;
          healed += amount;
        });

        if (healed < 1) {
          showToast('Nebyl vybrán žádný bod vlastnosti k obnovení.', 'error');
          return prev;
        }

        showToast(`${action.actionLabel || 'Talent'} obnovil ${healed} bodů vlastnosti.`);
        return { ...prev, willpower: prev.willpower - spent, attributes };
      }

      if (action.type === 'effect') {
        const amount = Math.max(0, Number(action.amount) || 0);
        const attackBonusActions = new Set([
          'blade-damage',
          'knight-damage',
          'arrow-damage',
          'dexterity-damage',
          'shadows-damage',
          'hound-damage',
          'killer-damage'
        ]);

        if (attackBonusActions.has(action.actionId)) {
          showToast(`${action.actionLabel || 'Talent'} připravil +${amount} ke zranění příštího útoku.`, 'info');
          return {
            ...prev,
            willpower: prev.willpower - spent,
            talentState: {
              ...prev.talentState,
              pendingAttackBonus: (Number(prev.talentState?.pendingAttackBonus) || 0) + amount,
              pendingAttackBonusLabel: action.actionLabel || 'Talent',
              pendingAttackTalentId: action.talentId || ''
            }
          };
        }

        if (action.actionId === 'fate-actions') {
          showToast(`Zpomalení času přidalo ${amount} bojových akcí.`, 'info');
          return {
            ...prev,
            willpower: prev.willpower - spent,
            talentState: {
              ...prev.talentState,
              bonusCombatActions: (Number(prev.talentState?.bonusCombatActions) || 0) + amount,
              bonusCombatActionTalentId: action.talentId || ''
            }
          };
        }

        const result = action.resultLabel ? `: ${amount} ${action.resultLabel}` : '';
        showToast(`${action.actionLabel || 'Talent'}${result}.`, 'info');
        return { ...prev, willpower: prev.willpower - spent };
      }

      return prev;
    });
  };

  const spendWillpowerForBargain = (spent, discountPercent, talentName = 'Cesta pokladu') => {
    const safeSpent = Math.max(1, Math.min(4, Number(spent) || 0));
    if (safeSpent > (Number(char.willpower) || 0)) {
      showToast('Na smlouvání nemáš dost vůle.', 'error');
      return false;
    }

    setChar(prev => ({ ...prev, willpower: Math.max(0, (Number(prev.willpower) || 0) - safeSpent) }));
    showToast(`${talentName}: cena snížena o ${discountPercent} %.`, 'info');
    return true;
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
  const manyThingsTalent = (Array.isArray(char.talents) ? char.talents : []).find(talent =>
    talent.id === 'path_of_many_things' || talent.name?.toLocaleLowerCase('cs-CZ') === 'cesta mnoha věcí'
  );
  const manyThingsRank = Number(manyThingsTalent?.rank || 0);
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

  const startRoll = (base = 0, skill = 0, gear = 0, options = {}) => {
    setInitialDice({ base, skill, gear, ...options });
    setShowDiceModal(true);
  };

  return (
    <div className="min-h-screen bg-fl-bg text-fl-surface font-sans selection:bg-fl-primary selection:text-white">
      <ConfirmHost />
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          action={toast.action ? {
            label: toast.action.label,
            onAction: () => {
              dismissToast();
              toast.action.onAction();
            }
          } : null}
        />
      )}
      <Suspense fallback={null}>
        {showDiceModal && <DiceRollerModal initialRoll={initialDice} onClose={() => setShowDiceModal(false)} />}
        {showCritModal && (
          <CriticalInjuryModal
            char={char}
            onClose={() => setShowCritModal(false)}
            onSaveInjury={char.id ? saveCriticalInjury : null}
            onUseLuck={markLuckUsed}
          />
        )}
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
        {showCreationWizard && (
          <CharacterCreationWizard
            onComplete={createFromWizard}
            onClose={() => setShowCreationWizard(false)}
            showToast={showToast}
          />
        )}
      </Suspense>
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
          onToggleTheme={toggleTheme}
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
        <Suspense fallback={<SectionFallback />}>
        {currentView === 'sheet' ? (
            <CharacterSheet
            char={char}
            updateField={updateField}
            updateDeep={updateDeep}
            addItemToInventory={addItemToInventory}
            removeInventorySlot={removeInventorySlot}
            onRoll={startRoll}
            refs={refs}
            scrollToSection={scrollToSection}
            setCurrentView={setCurrentView}
            onModalStateChange={setIsSheetModalOpen}
            onApplyTalentAction={applyTalentAction}
            onResetFight={resetFight}
            onAdvanceQuarterDay={advanceQuarterDay}
            onTalentRankChanged={clearForgottenTalentEffects}
            onEndBerserking={endBerserking}
            onReceiveFearAttack={receiveFearAttack}
            onCoupDeGrace={performCoupDeGrace}
            onActivateBladeOption={activateBladeCombatOption}
            onCombatAttack={performCombatAttack}
            totalWeight={totalWeight}
            encumbranceLimit={encumbranceLimit}
            isOverencumbered={isOverencumbered}
          />
        ) : currentView === 'zbozi' ? (
          <ZboziSection
            addItemToInventory={addItemToInventory}
            equipItem={equipItemDirectly}
            char={char}
            onBargain={spendWillpowerForBargain}
            manyThingsCharacterRank={manyThingsRank}
            willpower={Number(char.willpower) || 0}
            psychicPower={hasPsychicPower(char)}
          />
        ) : currentView === 'talents' ? (
          <TalentsSection char={char} onLearnTalent={learnTalent} />
        ) : currentView === 'spells' ? (
          <SpellsSection char={char} onLearnSpell={learnSpell} />
        ) : (
          <WeatherSection />
        )}
        </Suspense>
        </div>
      </main>

      <BottomNav activeSection={currentView} onSectionChange={setCurrentView} hidden={showMenu} />
    </div>
  );
};

export default App;
