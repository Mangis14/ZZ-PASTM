
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Menu, X, Plus, Skull, Dices, Download, Upload, Trash2, CloudRain, Sun, Moon
} from 'lucide-react';

import Toaster from './components/common/Toast';
import ZboziSection from './ZboziSection';
import TalentsSection from './TalentsSection';
import SpellsSection from './SpellsSection';
import WeatherSection from './WeatherSection';
import DiceRollerModal from './DiceRollerModal';
import CriticalInjuryModal from './CriticalInjuryModal';

import Header from './components/layout/Header';
import CharacterSheet from './components/CharacterSheet';
import { useSwipe } from './utils/useSwipe';

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
  const [currentView, setCurrentViewRaw] = useState('sheet');
  const [viewDirection, setViewDirection] = useState(null); // 'left' | 'right' | null // 'sheet', 'zbozi', 'talents', 'spells', 'weather'

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
    attributes: useRef(null),
    skills: useRef(null),
    combat: useRef(null),
    inventory: useRef(null),
    consumables: useRef(null),
    talents: useRef(null),
    notes: useRef(null)
  };

  const views = ['sheet', 'zbozi', 'talents', 'spells'];

  // Animated view switch — detects direction based on index
  const setCurrentView = (newView) => {
    if (newView === currentView) return;
    const oldIdx = views.indexOf(currentView);
    const newIdx = views.indexOf(newView);
    setViewDirection(newIdx > oldIdx ? 'left' : 'right');
    setCurrentViewRaw(newView);
    // Clear direction after animation
    setTimeout(() => setViewDirection(null), 300);
  };

  const { onTouchStart, onTouchMove, onTouchEnd, swipeOffset, isTransitioning, slideDirection } = useSwipe({
    onSwipedLeft: () => {
      const idx = views.indexOf(currentView);
      if (idx !== -1 && idx < views.length - 1) setCurrentView(views[idx + 1]);
    },
    onSwipedRight: () => {
      const idx = views.indexOf(currentView);
      if (idx !== -1 && idx > 0) setCurrentView(views[idx - 1]);
    }
  });

  const swipeHandlers = { onTouchStart, onTouchMove, onTouchEnd };

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

  const createNew = () => {
    const newChar = { ...defaultCharacter, id: Date.now().toString(), lastSaved: Date.now() };
    setChar(newChar);
    setSavedChars(prev => ({ ...prev, [newChar.id]: newChar }));
    setShowMenu(false);
    showToast("Nová postava vytvořena");
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

  const exportData = () => {
    const blob = new Blob([JSON.stringify(savedChars, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fl_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setSavedChars(data);
          localStorage.setItem('fl_characters', JSON.stringify(data));
          showToast("Záloha obnovena");
        } catch (err) {
          alert("Chyba při importu");
        }
      };
      reader.readAsText(file);
    }
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
    setTimeout(() => {
      refs[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const totalWeight = useMemo(() => {
    let w = 0;
    ['weapons', 'inventory'].forEach(k => char[k].forEach(i => { if (i.name) w += (i.weight || 0); }));
    ['armor', 'helmet', 'shield'].forEach(k => { if (char[k].name) w += (char[k].weight || 0); });
    return w;
  }, [char]);

  const encumbranceLimit = char.attributes.strength.current * 2;
  const isOverencumbered = totalWeight > encumbranceLimit;

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-fl-bg text-fl-primary">Načítám...</div>;

  const startRoll = (base = 0, skill = 0, gear = 0) => {
    setInitialDice({ base, skill, gear });
    setShowDiceModal(true);
  };

  return (
    <div className="min-h-screen bg-fl-bg text-fl-surface font-sans selection:bg-fl-primary selection:text-white pb-20">
      {toast && <Toaster message={toast} />}
      {showDiceModal && <DiceRollerModal initialRoll={initialDice} onClose={() => setShowDiceModal(false)} />}
      {showCritModal && <CriticalInjuryModal onClose={() => setShowCritModal(false)} />}

      <Header
        char={char}
        updateField={updateField}
        toggleMenu={() => setShowMenu(!showMenu)}
        isSaving={isSaving}
        totalWeight={totalWeight}
        encumbranceLimit={encumbranceLimit}
        isOverencumbered={isOverencumbered}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* MENU MODAL */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-start" onClick={() => setShowMenu(false)}>
          <div className="w-80 h-full bg-fl-nav border-r border-fl-primary p-6 overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
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

            <button onClick={() => { setCurrentView('weather'); setShowMenu(false); }} className="w-full flex items-center gap-3 p-4 bg-blue-900 text-fl-paper-light font-bold rounded hover:bg-blue-800 transition-colors mb-6 shadow-lg border border-blue-700">
              <CloudRain size={20} /> Počasí
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
              <button onClick={exportData} className="flex flex-col items-center gap-2 p-3 bg-fl-bg rounded border border-fl-border text-fl-primary hover:text-white hover:border-fl-primary transition-colors">
                <Download size={20} /> <span className="text-xs font-bold uppercase">Export</span>
              </button>
              <label className="flex flex-col items-center gap-2 p-3 bg-fl-bg rounded border border-fl-border text-fl-primary hover:text-white hover:border-fl-primary transition-colors cursor-pointer">
                <Upload size={20} /> <span className="text-xs font-bold uppercase">Import</span>
                <input type="file" className="hidden" accept=".json" onChange={importData} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main {...swipeHandlers} className="max-w-3xl mx-auto px-4 space-y-6 min-h-[80vh]" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 144px)' }}>
        <div
          key={currentView}
          className={`${
            isTransitioning
              ? slideDirection === 'left' 
                ? 'animate-slide-in-right' 
                : 'animate-slide-in-left'
              : viewDirection === 'left'
                ? 'animate-slide-in-right'
                : viewDirection === 'right'
                  ? 'animate-slide-in-left'
                  : ''
          }`}
          style={{
            transform: !isTransitioning && swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
            transition: !isTransitioning && swipeOffset ? 'none' : undefined,
          }}
        >
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
          />
        ) : currentView === 'zbozi' ? (
          <ZboziSection addItemToInventory={addItemToInventory} />
        ) : currentView === 'talents' ? (
          <TalentsSection />
        ) : currentView === 'spells' ? (
          <SpellsSection />
        ) : (
          <WeatherSection />
        )}
        </div>
      </main>
    </div>
  );
};

export default App;
