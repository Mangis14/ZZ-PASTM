import React, { useState, useMemo } from 'react';
import { X, ArrowRight, ArrowLeft, Shield, Sword, Brain, Smile, Check, Info, Dices, Search, Plus, Trash2 } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import Card from './common/Card';

const KIN_LIST = ['Člověk', 'Elf', 'Trpaslík', 'Půlelf', 'Půlčík', 'Vlken', 'Ork', 'Skřet'];

const PROFESSION_LIST = [
  'Válečník', 'Druid', 'Kouzelník', 'Jezdec', 'Kupec', 'Bard',
  'Lovec', 'Zloděj', 'Šampion', 'Řemeslník', 'Švihák', 'Lupič'
];

const KIN_AGE_RANGES = {
  'Člověk': { Mladá: '16-25', Dospělá: '26-50', Stará: '51+' },
  'Trpaslík': { Mladá: '16-30', Dospělá: '31-100', Stará: '101+' },
  'Půlelf': { Mladá: '16-30', Dospělá: '31-100', Stará: '101+' },
  'Půlčík': { Mladá: '20-40', Dospělá: '41-80', Stará: '81+' },
  'Vlken': { Mladá: '16-25', Dospělá: '26-60', Stará: '61+' },
  'Ork': { Mladá: '13-20', Dospělá: '21-40', Stará: '41+' },
  'Skřet': { Mladá: '13-20', Dospělá: '21-45', Stará: '46+' },
  'Elf': { Dospělá: 'Vždy dospělá' }
};

const KIN_TALENT_MAP = {
  'Člověk': { id: 'prizpusobivy', name: 'Přizpůsobivý', description: 'Umožňuje ti naučit se talenty jiných povolání nebo získat bonus ke všem hodům při plnění úkolu spojeného s učením.' },
  'Elf': { id: 'vnitrni_klid', name: 'Vnitřní klid', description: 'Umožňuje ti meditovat a čerpat sílu přímo ze své elfí podstaty (obnova bodů vlastností bez jídla/pití).' },
  'Trpaslík': { id: 'houzevnatost', name: 'Houževnatost', description: 'Když utrpíš poškození, které by tě vyřadilo, můžeš utratit body vůle k ignorování zranění.' },
  'Půlelf': { id: 'magicka_sila', name: 'Magická síla', description: 'Můžeš čerpat sílu z obou svých původů a získat body vůle z cizích zdrojů.' },
  'Půlčík': { id: 'tezko_polapitelny', name: 'Těžko polapitelný', description: 'Díky své malé výšce a mrštnosti máš bonus při úhybu v boji.' },
  'Vlken': { id: 'divoky_lov', name: 'Divoký lov', description: 'Můžeš použít své zvířecí smysly ke stopování pachu nebo získání výhody při útoku.' },
  'Ork': { id: 'nesmiritelny', name: 'Nesmiřitelný', description: 'Když jsi zraněný a útočíš na nepřítele, který ti zranění způsobil, tvůj útok je silnější.' },
  'Skřet': { id: 'nocni_tvor', name: 'Noční tvor', description: 'Získáváš výhodu a lépe vidíš ve tmě a šeru, sluneční svit ti ale může překážet.' }
};

const PROF_SKILLS_MAP = {
  'Válečník': ['might', 'endurance', 'melee', 'crafting', 'move'],
  'Druid': ['endurance', 'survival', 'insight', 'healing', 'animalHandling'],
  'Kouzelník': ['crafting', 'sleightOfHand', 'lore', 'insight', 'manipulation'],
  'Jezdec': ['endurance', 'melee', 'marksmanship', 'survival', 'animalHandling'],
  'Kupec': ['crafting', 'sleightOfHand', 'scouting', 'insight', 'manipulation'],
  'Bard': ['lore', 'insight', 'manipulation', 'healing', 'performance'],
  'Lovec': ['stealth', 'move', 'marksmanship', 'scouting', 'survival'],
  'Zloděj': ['melee', 'stealth', 'sleightOfHand', 'move', 'manipulation'],
  'Šampion': ['might', 'endurance', 'melee', 'move', 'survival'],
  'Řemeslník': ['might', 'endurance', 'crafting', 'sleightOfHand', 'lore'],
  'Švihák': ['melee', 'lore', 'insight', 'manipulation', 'animalHandling'],
  'Lupič': ['endurance', 'stealth', 'sleightOfHand', 'move', 'scouting']
};

const SKILL_NAMES_CZ = {
  might: 'Svaly',
  endurance: 'Výdrž',
  melee: 'Boj zblízka',
  crafting: 'Řemesla',
  stealth: 'Plížení',
  sleightOfHand: 'Zlodějina',
  move: 'Mrštnost',
  marksmanship: 'Střelba',
  scouting: 'Ostražitost',
  lore: 'Příběhy',
  survival: 'Přežití',
  insight: 'Empatie',
  manipulation: 'Manipulace',
  performance: 'Vystupování',
  healing: 'Léčení',
  animalHandling: 'Zvířata'
};

const SKILL_ATTR_MAP = {
  might: 'strength', endurance: 'strength', melee: 'strength', crafting: 'strength',
  stealth: 'agility', sleightOfHand: 'agility', move: 'agility', marksmanship: 'agility',
  scouting: 'wits', lore: 'wits', survival: 'wits', insight: 'wits',
  manipulation: 'empathy', performance: 'empathy', healing: 'empathy', animalHandling: 'empathy'
};

// Check key attributes based on Kin and Profession (homebrew)
const isAttrKeyForKin = (attr, kin) => {
  const kinKeyMap = {
    'Člověk': 'empathy',
    'Elf': 'agility',
    'Trpaslík': 'strength',
    'Půlčík': 'empathy',
    'Půlelf': 'wits',
    'Vlken': 'agility',
    'Ork': 'strength',
    'Skřet': 'agility'
  };
  return kinKeyMap[kin] === attr;
};

const isAttrKeyForProf = (attr, prof) => {
  const profKeyMap = {
    'Válečník': 'strength',
    'Šampion': 'strength',
    'Řemeslník': 'strength',
    'Zloděj': 'agility',
    'Lovec': 'agility',
    'Lupič': 'agility',
    'Jezdec': 'agility',
    'Druid': 'wits',
    'Kouzelník': 'wits',
    'Švihák': 'wits',
    'Bard': 'empathy',
    'Kupec': 'empathy'
  };
  return profKeyMap[prof] === attr;
};

const getAttrLimits = (attr, kin, prof) => {
  const isKin = isAttrKeyForKin(attr, kin);
  const isProf = isAttrKeyForProf(attr, prof);
  if (isKin && isProf) return { min: 2, max: 6 };
  if (isKin || isProf) return { min: 2, max: 5 };
  return { min: 2, max: 4 };
};

const getAgePools = (ageGroup) => {
  if (ageGroup === 'Mladá') return { attributes: 15, skills: 10, generalTalents: 1 };
  if (ageGroup === 'Stará') return { attributes: 13, skills: 18, generalTalents: 3 };
  return { attributes: 14, skills: 14, generalTalents: 2 }; // Dospělá
};

// Starting gear choices by profession
const PROF_GEAR_RECOMMENDED = {
  'Válečník': ['Meč široký', 'Sekera bojová', 'Drátěná košile', 'Kožená zbroj', 'Štít kulatý', 'Tlumok'],
  'Druid': ['Hůl', 'Bylinky', 'Léčivý lektvar', 'Dýka', 'Tlumok'],
  'Kouzelník': ['Hůl', 'Dýka', 'Kniha kouzel', 'Tlumok'],
  'Jezdec': ['Jezdecký kůň', 'Kopí', 'Meč krátký', 'Kožená zbroj', 'Tlumok'],
  'Kupec': ['Dýka', 'Kožená zbroj', 'Pěkné oblečení', 'Mince', 'Tlumok'],
  'Bard': ['Loutna', 'Dýka', 'Pěkné oblečení', 'Tlumok'],
  'Lovec': ['Luk dlouhý', 'Kuš lehká', 'Dýka', 'Kožená zbroj', 'Past na zvěř', 'Tlumok'],
  'Zloděj': ['Dýka', 'Meč krátký', 'Kožená zbroj', 'Paklíč', 'Tlumok'],
  'Šampion': ['Obouruční meč', 'Palcát', 'Drátěná košile', 'Štít velký', 'Tlumok'],
  'Řemeslník': ['Kladivo řemeslnické', 'Nářadí', 'Kožená zbroj', 'Tlumok'],
  'Švihák': ['Kord', 'Dýka', 'Pěkné oblečení', 'Štít malý', 'Tlumok'],
  'Lupič': ['Dýka', 'Meč krátký', 'Kožená zbroj', 'Provaz', 'Tlumok']
};

export default function CharacterCreationWizard({ onComplete, onClose }) {
  const { talents: catalogTalents, spells: catalogSpells, allItems } = useCatalog();
  const [step, setStep] = useState(1);

  // Kroky:
  // 1: Basic Info (Name, Kin, Profession, Age)
  // 2: Attributes
  // 3: Skills
  // 4: Talents
  // 5: Spells (Druid/Mage only)
  // 6: Pride, Dark Secret, Gear, Review

  // --- STAV PRO TVORBU ---
  const [name, setName] = useState('');
  const [kin, setKin] = useState('Člověk');
  const [profession, setProfession] = useState('Válečník');
  const [ageGroup, setAgeGroup] = useState('Dospělá');
  const [ageValue, setAgeValue] = useState(30);

  // Atributy (Strength, Agility, Wits, Empathy)
  const [attributes, setAttributes] = useState({
    strength: 2,
    agility: 2,
    wits: 2,
    empathy: 2
  });

  // Dovednosti
  const [skills, setSkills] = useState({
    might: 0, endurance: 0, melee: 0, crafting: 0,
    stealth: 0, sleightOfHand: 0, move: 0, marksmanship: 0,
    scouting: 0, lore: 0, survival: 0, insight: 0,
    manipulation: 0, performance: 0, healing: 0, animalHandling: 0
  });

  // Talenty
  const [selectedProfTalentId, setSelectedProfTalentId] = useState('');
  const [selectedGeneralTalentIds, setSelectedGeneralTalentIds] = useState([]);
  const [isProfRank2Selected, setIsProfRank2Selected] = useState(false); // Homebrew choice

  // Spells
  const [selectedSpellIds, setSelectedSpellIds] = useState([]);

  // Gear & Custom fields
  const [pride, setPride] = useState('');
  const [darkSecret, setDarkSecret] = useState('');
  const [appearance, setAppearance] = useState('');
  const [relationships, setRelationships] = useState(['', '', '', '']);
  const [reputation, setReputation] = useState(0);
  const [startingItems, setStartingItems] = useState([]);
  const [startingGold, setStartingGold] = useState(0);
  const [startingSilver, setStartingSilver] = useState(15);
  const [startingCopper, setStartingCopper] = useState(0);

  // Search items in step 6
  const [itemSearch, setItemSearch] = useState('');

  // --- DYNAMICKÉ HODNOTY ---
  const limits = useMemo(() => {
    return {
      strength: getAttrLimits('strength', kin, profession),
      agility: getAttrLimits('agility', kin, profession),
      wits: getAttrLimits('wits', kin, profession),
      empathy: getAttrLimits('empathy', kin, profession)
    };
  }, [kin, profession]);

  const pools = useMemo(() => {
    return getAgePools(kin === 'Elf' ? 'Dospělá' : ageGroup);
  }, [kin, ageGroup]);

  const profSkills = useMemo(() => {
    return PROF_SKILLS_MAP[profession] || [];
  }, [profession]);

  const isSpellcaster = profession === 'Druid' || profession === 'Kouzelník';

  // --- POMOCNÉ VÝPOČTY ---

  // Atributy points total
  const attrSpent = attributes.strength + attributes.agility + attributes.wits + attributes.empathy;
  const attrRemaining = pools.attributes - attrSpent;

  // Skills points total (homebrew pricing)
  const skillsSpent = useMemo(() => {
    let cost = 0;
    Object.entries(skills).forEach(([sId, val]) => {
      // Halfling/Goblin +1 stealth doesn't cost points
      let calculatedVal = val;
      if (sId === 'stealth' && (kin === 'Půlčík' || kin === 'Skřet')) {
        calculatedVal = Math.max(0, val - 1);
      }

      if (calculatedVal === 0) return;
      if (calculatedVal === 1) cost += 1;
      if (calculatedVal === 2) cost += 2;
      if (calculatedVal === 3) cost += 4;
    });
    return cost;
  }, [skills, kin]);

  const skillsRemaining = pools.skills - skillsSpent;

  // List of available professional talents
  const availableProfTalents = useMemo(() => {
    const profKey = {
      'Bard': 'Bard',
      'Válečník': 'Bojovník',
      'Jezdec': 'Jezdec',
      'Kupec': 'Kupec',
      'Lovec': 'Lovec',
      'Lupič': 'Lupič',
      'Řemeslník': 'Řemeslník',
      'Šampion': 'Šampión',
      'Švihák': 'Švihák',
      'Zloděj': 'Zloděj',
      'Druid': 'Druid',
      'Kouzelník': 'Kouzelník'
    }[profession] || profession;

    const catalogList = catalogTalents.profession || [];
    // Filter matching profession talents
    const matched = catalogList.filter(t => t.profession === profKey);

    // If it's empty (like for Druid/Mage which are spells), we can generate mock talents if not in catalog
    if (matched.length === 0) {
      if (profession === 'Druid') {
        return [
          { id: 'cesta_leceni', name: 'Cesta léčení', ranks: [{ rank: 1, description: 'Umožňuje léčit zranění.' }] },
          { id: 'cesta_promeny', name: 'Cesta proměny', ranks: [{ rank: 1, description: 'Umožňuje měnit podobu.' }] },
          { id: 'cesta_kamene', name: 'Cesta kamene', ranks: [{ rank: 1, description: 'Umožňuje tvarovat kámen.' }] }
        ];
      }
      if (profession === 'Kouzelník') {
        return [
          { id: 'cesta_smrti', name: 'Cesta smrti', ranks: [{ rank: 1, description: 'Kouzla nekromancie.' }] },
          { id: 'cesta_krve', name: 'Cesta krve', ranks: [{ rank: 1, description: 'Kouzla krve a moci.' }] },
          { id: 'cesta_jasnovidectvi', name: 'Cesta jasnovidectví', ranks: [{ rank: 1, description: 'Jasnozřivá magie.' }] }
        ];
      }
    }
    return matched;
  }, [profession, catalogTalents]);

  // List of spells corresponding to chosen profession magic talent
  const startingSpellChoices = useMemo(() => {
    if (!isSpellcaster) return [];
    // Map selected magic talent ID to spell school
    let school = 'Obecná';
    if (selectedProfTalentId === 'cesta_leceni' || selectedProfTalentId === 'path_of_healing') school = 'Léčení';
    else if (selectedProfTalentId === 'cesta_promeny' || selectedProfTalentId === 'path_of_shifting') school = 'Proměna';
    else if (selectedProfTalentId === 'cesta_kamene' || selectedProfTalentId === 'path_of_stone_singing') school = 'Kámenpěvec';
    else if (selectedProfTalentId === 'cesta_smrti' || selectedProfTalentId === 'path_of_death') school = 'Smrt';
    else if (selectedProfTalentId === 'cesta_krve' || selectedProfTalentId === 'path_of_blood') school = 'Krev';
    else if (selectedProfTalentId === 'cesta_jasnovidectvi' || selectedProfTalentId === 'path_of_sight') school = 'Jasnovidnost';

    const schoolSpells = catalogSpells[school] || [];
    const generalSpells = catalogSpells['Obecná'] || [];

    // Filter rank 1 spells
    return {
      schoolName: school,
      schoolSpells: schoolSpells.filter(s => s.rank === 1),
      generalSpells: generalSpells.filter(s => s.rank === 1)
    };
  }, [isSpellcaster, selectedProfTalentId, catalogSpells]);

  // Search items list filtered
  const filteredGearSearch = useMemo(() => {
    if (!itemSearch) return [];
    return allItems.filter(item =>
      item['Předmět']?.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.Category?.toLowerCase().includes(itemSearch.toLowerCase())
    ).slice(0, 10);
  }, [allItems, itemSearch]);

  // --- AKCE / HANDLERY ---

  const handleNextStep = () => {
    // Validation before moving next
    if (step === 1) {
      if (!name.trim()) {
        alert("Prosím zadejte jméno postavy.");
        return;
      }
      // Initialize attributes to min limits when advancing
      const newAttrs = { ...attributes };
      Object.keys(newAttrs).forEach(k => {
        newAttrs[k] = Math.max(limits[k].min, newAttrs[k]);
      });
      setAttributes(newAttrs);

      // Initialize default profession talent if not selected
      if (availableProfTalents.length > 0 && !selectedProfTalentId) {
        setSelectedProfTalentId(availableProfTalents[0].id);
      }
    }

    if (step === 2) {
      if (attrRemaining !== 0) {
        alert(`Musíte rozdělit přesně všechny body vlastností. Zbývá rozdělit: ${attrRemaining} b.`);
        return;
      }
      // Initialize skills stealth bonus
      const newSkills = { ...skills };
      if (kin === 'Půlčík' || kin === 'Skřet') {
        newSkills.stealth = Math.max(1, newSkills.stealth);
      } else {
        newSkills.stealth = Math.max(0, newSkills.stealth);
      }
      setSkills(newSkills);
    }

    if (step === 3) {
      if (skillsRemaining !== 0) {
        alert(`Musíte rozdělit přesně všechny body dovedností. Zbývá rozdělit: ${skillsRemaining} b.`);
        return;
      }
    }

    if (step === 4) {
      // Validate general talents count
      const requiredGeneralCount = isProfRank2Selected ? pools.generalTalents - 1 : pools.generalTalents;
      if (selectedGeneralTalentIds.length !== requiredGeneralCount) {
        alert(`Zvolte prosím přesně ${requiredGeneralCount} obecných talentů.`);
        return;
      }
      // Pre-add selected spell choices if spellcaster
      if (isSpellcaster && selectedSpellIds.length === 0 && startingSpellChoices.schoolSpells?.length > 0) {
        setSelectedSpellIds([
          startingSpellChoices.schoolSpells[0].id,
          startingSpellChoices.generalSpells[0]?.id || startingSpellChoices.schoolSpells[0].id
        ]);
      }
    }

    if (step === 5 && isSpellcaster) {
      if (selectedSpellIds.length !== 2) {
        alert("Zvolte prosím přesně 2 startovní kouzla.");
        return;
      }
    }

    // Determine next step
    if (step === 4 && !isSpellcaster) {
      setStep(6);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step === 6 && !isSpellcaster) {
      setStep(4);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const adjustAttribute = (attr, delta) => {
    const lim = limits[attr];
    const newVal = attributes[attr] + delta;
    if (newVal >= lim.min && newVal <= lim.max) {
      if (delta > 0 && attrRemaining <= 0) return; // No points left
      setAttributes(prev => ({ ...prev, [attr]: newVal }));
    }
  };

  const adjustSkill = (sId, delta) => {
    const isProf = profSkills.includes(sId);
    const maxVal = isProf ? 3 : 1;
    const current = skills[sId];
    const nextVal = current + delta;

    if (nextVal < 0 || nextVal > maxVal) return;

    // Halfling/Goblin +1 stealth cannot be removed below 1
    if (sId === 'stealth' && (kin === 'Půlčík' || kin === 'Skřet') && nextVal < 1) {
      return;
    }

    // Determine cost changes
    let currentCost = 0;
    let actualCurrent = current;
    if (sId === 'stealth' && (kin === 'Půlčík' || kin === 'Skřet')) {
      actualCurrent = Math.max(0, current - 1);
    }
    if (actualCurrent === 1) currentCost = 1;
    if (actualCurrent === 2) currentCost = 2;
    if (actualCurrent === 3) currentCost = 4;

    let nextCost = 0;
    let actualNext = nextVal;
    if (sId === 'stealth' && (kin === 'Půlčík' || kin === 'Skřet')) {
      actualNext = Math.max(0, nextVal - 1);
    }
    if (actualNext === 1) nextCost = 1;
    if (actualNext === 2) nextCost = 2;
    if (actualNext === 3) nextCost = 4;

    const diff = nextCost - currentCost;
    if (diff > 0 && skillsRemaining < diff) return; // Not enough points

    setSkills(prev => ({ ...prev, [sId]: nextVal }));
  };

  const handleGeneralTalentToggle = (talentId) => {
    setSelectedGeneralTalentIds(prev => {
      if (prev.includes(talentId)) {
        return prev.filter(id => id !== talentId);
      }
      const limitCount = isProfRank2Selected ? pools.generalTalents - 1 : pools.generalTalents;
      if (prev.length >= limitCount) {
        return [...prev.slice(1), talentId];
      }
      return [...prev, talentId];
    });
  };

  const handleSpellToggle = (spellId) => {
    setSelectedSpellIds(prev => {
      if (prev.includes(spellId)) {
        return prev.filter(id => id !== spellId);
      }
      if (prev.length >= 2) {
        return [...prev.slice(1), spellId];
      }
      return [...prev, spellId];
    });
  };

  const addStartingItem = (item) => {
    const weight = item['Váha'] ? (parseFloat(item['Váha']) || 1) : 1;
    setStartingItems(prev => [...prev, { name: item['Předmět'], weight }]);
  };

  const removeStartingItem = (idx) => {
    setStartingItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFinish = () => {
    // Map collected state into character sheet object
    const finalCharacter = {
      id: Date.now().toString(),
      name,
      kin,
      profession,
      age: parseInt(ageValue) || 0,
      ageGroup,
      pride,
      darkSecret,
      appearance,
      reputation: parseInt(reputation) || 0,
      relationships,
      attributes: {
        strength: { current: attributes.strength, max: attributes.strength },
        agility: { current: attributes.agility, max: attributes.agility },
        wits: { current: attributes.wits, max: attributes.wits },
        empathy: { current: attributes.empathy, max: attributes.empathy }
      },
      skills,
      conditions: { hungry: false, thirsty: false, sleepy: false, cold: false },
      consumables: { food: 0, water: 0, arrows: 0, torches: 0, alcohol: 0, tobacco: 0 },
      money: { gold: startingGold, silver: startingSilver, copper: startingCopper },
      weapons: Array(3).fill({ name: '', bonus: '', damage: '', range: '', note: '', weight: 1 }),
      armor: { name: '', bonus: '', rating: '', weight: 1 },
      helmet: { name: '', bonus: '', rating: '', weight: 1 },
      shield: { name: '', bonus: '', rating: '', weight: 1 },
      inventory: Array(10).fill({ name: '', weight: 1 }),
      mounts: [],
      criticalInjuries: [],
      willpower: 0,
      experience: 0,
      timeOfDay: 0,
      notes: ''
    };

    // Prepopulate starting items in inventory
    startingItems.forEach((item, idx) => {
      if (idx < 10) {
        finalCharacter.inventory[idx] = { name: item.name, weight: item.weight };
      } else {
        finalCharacter.inventory.push({ name: item.name, weight: item.weight });
      }
    });

    // Resolve talents list
    const finalTalents = [];

    // Kin talent
    const kinTalent = KIN_TALENT_MAP[kin];
    if (kinTalent) {
      finalTalents.push({
        id: kinTalent.id,
        name: kinTalent.name,
        rank: 1,
        description: kinTalent.description,
        profession: ''
      });
    }

    // Professional talent
    const profTalent = availableProfTalents.find(t => t.id === selectedProfTalentId);
    if (profTalent) {
      const rank = isProfRank2Selected ? 2 : 1;
      const rankDesc = profTalent.ranks?.[rank - 1]?.description || profTalent.description || '';
      finalTalents.push({
        id: profTalent.id,
        name: profTalent.name,
        rank,
        description: rankDesc,
        profession: profession
      });
    }

    // General talents
    selectedGeneralTalentIds.forEach(tId => {
      const tDef = catalogTalents.general?.find(t => t.id === tId);
      if (tDef) {
        finalTalents.push({
          id: tDef.id,
          name: tDef.name,
          rank: 1,
          description: tDef.ranks?.[0]?.description || tDef.description || '',
          profession: ''
        });
      }
    });

    finalCharacter.talents = finalTalents;

    // Spells
    const finalSpells = [];
    if (isSpellcaster) {
      selectedSpellIds.forEach(sId => {
        // Search in Obecna and other schools
        let found = null;
        Object.keys(catalogSpells).forEach(sch => {
          const s = catalogSpells[sch].find(sp => sp.id === sId);
          if (s) found = { ...s, school: sch };
        });
        if (found) {
          finalSpells.push(found);
        }
      });
    }
    finalCharacter.spells = finalSpells;

    onComplete(finalCharacter);
  };

  // --- RENDERING KROKŮ ---

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-fl-card w-full max-w-3xl min-h-[90vh] sm:min-h-0 rounded-lg border-2 border-fl-primary shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
        {/* Header */}
        <div className="p-4 border-b border-fl-border bg-fl-card flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-fl-primary">Tvorba Postavy</h2>
            <p className="text-xs text-fl-text-muted">Krok {step} z {isSpellcaster ? 6 : 5} • {
              step === 1 ? 'Základní informace' :
              step === 2 ? 'Atributy' :
              step === 3 ? 'Dovednosti' :
              step === 4 ? 'Talenty' :
              step === 5 ? 'Kouzla' : 'Výstroj a Detaily'
            }</p>
          </div>
          <button onClick={onClose} className="text-fl-text-muted hover:text-fl-primary p-2">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Step Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-fl-paper-bright space-y-4 text-fl-surface">

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border border-fl-primary/20 bg-fl-paper-light p-3 rounded-sm flex items-start gap-3">
                <Info className="text-fl-primary shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-fl-surface-hover leading-relaxed">
                  Vítejte v průvodci tvorbou postavy. Podle zvoleného věku a rasy se určí startovní body vlastností a dovedností. Elfi jsou vždy dospělí.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Jméno postavy</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-fl-card border border-fl-border rounded px-3 py-2 text-base font-serif font-bold text-fl-surface focus:border-fl-primary focus:outline-none placeholder:text-fl-border"
                  placeholder="Zadejte jméno hrdiny..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Rod (Rasa)</label>
                  <select
                    value={kin}
                    onChange={e => {
                      const newKin = e.target.value;
                      setKin(newKin);
                      if (newKin === 'Elf') setAgeGroup('Dospělá');
                    }}
                    className="w-full bg-fl-card border border-fl-border rounded px-3 py-2 text-sm font-bold text-fl-surface focus:border-fl-primary focus:outline-none"
                  >
                    {KIN_LIST.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Povolání</label>
                  <select
                    value={profession}
                    onChange={e => setProfession(e.target.value)}
                    className="w-full bg-fl-card border border-fl-border rounded px-3 py-2 text-sm font-bold text-fl-surface focus:border-fl-primary focus:outline-none"
                  >
                    {PROFESSION_LIST.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Věk (Kategorie)</label>
                  <div className="flex gap-2">
                    {['Mladá', 'Dospělá', 'Stará'].map(cat => {
                      const isDisabled = kin === 'Elf' && cat !== 'Dospělá';
                      return (
                        <button
                          key={cat}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setAgeGroup(cat)}
                          className={`flex-1 py-2 text-xs font-bold uppercase rounded border transition-colors ${
                            ageGroup === cat
                              ? 'bg-fl-primary text-white border-fl-primary'
                              : isDisabled
                                ? 'bg-fl-paper-light border-fl-border text-fl-text-muted cursor-not-allowed opacity-30'
                                : 'bg-fl-card border-fl-border text-fl-surface-hover hover:border-fl-primary/60'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {kin !== 'Elf' && (
                    <p className="text-[10px] text-fl-text-muted mt-1 italic">
                      Věkové rozmezí pro {kin}: {KIN_AGE_RANGES[kin][ageGroup]} let
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Přesný věk (let)</label>
                  <input
                    type="number"
                    value={ageValue}
                    onChange={e => setAgeValue(e.target.value)}
                    className="w-full bg-fl-card border border-fl-border rounded px-3 py-2 text-sm text-fl-surface focus:border-fl-primary focus:outline-none"
                    placeholder="Např. 25"
                  />
                </div>
              </div>

              {/* Race warning for Small species */}
              {(kin === 'Půlčík' || kin === 'Skřet') && (
                <div className="border border-red-700 bg-red-950/20 p-4 rounded-sm space-y-2">
                  <div className="text-red-700 font-bold text-xs uppercase tracking-wide">Úprava malých druhů ({kin})</div>
                  <p className="text-xs text-fl-surface leading-relaxed">
                    Permanentní bonus <strong>+1 k PLÍŽENÍ</strong> (přidán zdarma). Mohou však řídit pouze vlky a poníky. Dlouhé luky a zbraně nablízko, které nejsou <em>LEHKÉ</em> dávají postih <strong>-1 na MRŠTNOST</strong> a těžké jednoruční je nutno nosit obouručně (dvojručné těžké nablízko nelze použít vůbec).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Attributes */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-fl-border pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold">Vlastnosti (Atributy)</h3>
                  <p className="text-xs text-fl-text-muted">Rozdělte celkem {pools.attributes} bodů (Věk: {ageGroup})</p>
                </div>
                <div className={`px-3 py-1.5 rounded border text-sm font-bold ${attrRemaining === 0 ? 'bg-green-900/20 border-green-700 text-green-700' : 'bg-fl-primary/10 border-fl-primary text-fl-primary'}`}>
                  Zbývá rozdělit: {attrRemaining} b.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'strength', label: 'Síla', icon: Sword, desc: 'Tělesná síla, výdrž a zdraví.' },
                  { key: 'agility', label: 'Obratnost', icon: Shield, desc: 'Koordinace pohybu, rychlost a mrštnost.' },
                  { key: 'wits', label: 'Bystrost', icon: Brain, desc: 'Smysly, inteligence a pohotovost.' },
                  { key: 'empathy', label: 'Osobnost', icon: Smile, desc: 'Vliv na lidi, charisma a empatie.' }
                ].map(attr => {
                  const val = attributes[attr.key];
                  const lim = limits[attr.key];
                  const isKin = isAttrKeyForKin(attr.key, kin);
                  const isProf = isAttrKeyForProf(attr.key, profession);

                  return (
                    <div key={attr.key} className="bg-fl-card border border-fl-border p-4 rounded-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-base font-bold text-fl-surface">{attr.label}</h4>
                            <attr.icon size={16} className="text-fl-primary" />
                          </div>
                          <p className="text-[11px] text-fl-text-muted mt-1 leading-relaxed">{attr.desc}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-bold text-fl-primary uppercase">Rozsah</div>
                          <div className="text-xs font-bold tabular-nums">{lim.min} - {lim.max}</div>
                        </div>
                      </div>

                      {/* Badges for Key attribute */}
                      <div className="flex gap-1.5 my-2">
                        {isKin && <span className="px-1.5 py-0.5 bg-fl-primary/10 text-fl-primary text-[9px] font-bold uppercase rounded border border-fl-primary/20">Klíč rasy</span>}
                        {isProf && <span className="px-1.5 py-0.5 bg-blue-900/10 text-blue-400 text-[9px] font-bold uppercase rounded border border-blue-900/20">Klíč povolání</span>}
                      </div>

                      <div className="flex items-center justify-between border-t border-fl-border/40 pt-3">
                        <span className="text-xs text-fl-text-muted font-bold uppercase">Úroveň</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => adjustAttribute(attr.key, -1)}
                            disabled={val <= lim.min}
                            className="w-8 h-8 rounded border border-fl-border flex items-center justify-center font-bold bg-fl-paper-light hover:border-fl-primary hover:text-fl-primary disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="font-serif text-2xl font-bold w-6 text-center tabular-nums text-fl-primary">{val}</span>
                          <button
                            type="button"
                            onClick={() => adjustAttribute(attr.key, 1)}
                            disabled={val >= lim.max || attrRemaining <= 0}
                            className="w-8 h-8 rounded border border-fl-border flex items-center justify-center font-bold bg-fl-paper-light hover:border-fl-primary hover:text-fl-primary disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Skills */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-fl-border pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold">Dovednosti (Skills)</h3>
                  <p className="text-xs text-fl-text-muted">Rozdělte celkem {pools.skills} bodů (Věk: {ageGroup})</p>
                </div>
                <div className={`px-3 py-1.5 rounded border text-sm font-bold ${skillsRemaining === 0 ? 'bg-green-900/20 border-green-700 text-green-700' : 'bg-fl-primary/10 border-fl-primary text-fl-primary'}`}>
                  Zbývá rozdělit: {skillsRemaining} b.
                </div>
              </div>

              <div className="border border-fl-primary/20 bg-fl-paper-light p-3 rounded-sm text-xs text-fl-surface-hover space-y-1">
                <p>💡 <strong>Profesní dovednosti</strong> (zvýrazněné zlatě) lze zvednout až na **stupeň 3**.</p>
                <p>💡 Ostatní dovednosti lze zvednout pouze na **stupeň 1**.</p>
                <p>⚙️ <strong>Cena:</strong> stupeň 1 = 1 bod, stupeň 2 = +1 bod (celkem 2), stupeň 3 = +2 body (celkem 4).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
                {Object.keys(skills).map(sId => {
                  const val = skills[sId];
                  const isProf = profSkills.includes(sId);
                  const isStealthBonus = sId === 'stealth' && (kin === 'Půlčík' || kin === 'Skřet');

                  return (
                    <div
                      key={sId}
                      className={`p-3 rounded-sm border flex items-center justify-between transition-colors ${
                        isProf
                          ? 'border-fl-primary/30 bg-fl-primary/5 hover:border-fl-primary/60'
                          : 'border-fl-border bg-fl-card'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-fl-surface">{SKILL_NAMES_CZ[sId]}</span>
                          {isProf && (
                            <span className="text-[8px] bg-fl-primary text-fl-bg font-bold uppercase px-1 rounded">Triední</span>
                          )}
                          {isStealthBonus && (
                            <span className="text-[8px] bg-green-700 text-white font-bold uppercase px-1 rounded" title="Bonus rasy">+1 Rasa</span>
                          )}
                        </div>
                        <span className="text-[10px] text-fl-text-muted font-bold uppercase">{SKILL_ATTR_MAP[sId] === 'strength' ? 'Síla' : SKILL_ATTR_MAP[sId] === 'agility' ? 'Obratnost' : SKILL_ATTR_MAP[sId] === 'wits' ? 'Bystrost' : 'Osobnost'}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => adjustSkill(sId, -1)}
                          disabled={isStealthBonus ? val <= 1 : val <= 0}
                          className="w-7 h-7 rounded border border-fl-border flex items-center justify-center font-bold bg-fl-paper-light hover:border-fl-primary disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="font-serif text-lg font-bold w-4 text-center text-fl-primary tabular-nums">{val}</span>
                        <button
                          type="button"
                          onClick={() => adjustSkill(sId, 1)}
                          disabled={val >= (isProf ? 3 : 1)}
                          className="w-7 h-7 rounded border border-fl-border flex items-center justify-center font-bold bg-fl-paper-light hover:border-fl-primary disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Talents */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-fl-border pb-3">
                <h3 className="font-serif text-lg font-bold">Výběr Talentů</h3>
                <p className="text-xs text-fl-text-muted">Rodový talent a profesní talent jsou automaticky uděleny na 1. stupeň.</p>
              </div>

              {/* Kin Talent */}
              <div className="bg-fl-card border border-fl-border p-4 rounded-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-fl-primary">Rodový Talent (Automaticky)</span>
                  <span className="text-[10px] font-bold bg-green-900/20 text-green-600 px-1 border border-green-900/30 rounded">Stupeň 1</span>
                </div>
                <h4 className="font-serif text-base font-bold text-fl-surface">{KIN_TALENT_MAP[kin]?.name}</h4>
                <p className="text-xs text-fl-text-muted leading-relaxed font-serif italic">
                  {KIN_TALENT_MAP[kin]?.description}
                </p>
              </div>

              {/* Profession Talent Choice */}
              <div className="bg-fl-card border border-fl-primary/30 bg-fl-primary/5 p-4 rounded-sm space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-fl-primary">Volba profesní cesty (Talent Povolání)</span>
                  <p className="text-xs text-fl-text-muted">Vyberte si jednu z cest svého povolání ({profession})</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {availableProfTalents.map(t => (
                    <label
                      key={t.id}
                      className={`p-3 rounded-sm border cursor-pointer flex items-start gap-3 transition-colors ${
                        selectedProfTalentId === t.id
                          ? 'border-fl-primary bg-fl-primary/10'
                          : 'border-fl-border bg-fl-card hover:border-fl-primary/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="profTalent"
                        checked={selectedProfTalentId === t.id}
                        onChange={() => setSelectedProfTalentId(t.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-bold text-sm text-fl-surface">{t.name}</div>
                        <div className="text-xs text-fl-text-muted leading-relaxed font-serif mt-1">
                          {t.ranks?.[0]?.description || t.description || 'Profesní talent na stupni 1.'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Homebrew rank 2 profession talent replacement */}
                {ageGroup !== 'Mladá' && (
                  <div className="border-t border-fl-primary/20 pt-4 mt-2 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isProfRank2Selected}
                        onChange={(e) => {
                          setIsProfRank2Selected(e.target.checked);
                          // Clear general talents if selected to adjust size
                          setSelectedGeneralTalentIds([]);
                        }}
                      />
                      <span className="text-xs font-bold text-fl-primary uppercase">Reforged Homebrew Výhoda</span>
                    </label>
                    <p className="text-xs text-fl-surface-hover leading-relaxed">
                      Protože je tvá postava {ageGroup}, můžeš si vzít <strong>vybraný profesní talent na Stupni 2</strong> namísto jednoho obecného talentu.
                    </p>
                  </div>
                )}
              </div>

              {/* General Talents Selection */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-serif text-base font-bold">Výběr Obecných Talentů</h4>
                  <p className="text-xs text-fl-text-muted">
                    Zvolte přesně <strong>{isProfRank2Selected ? pools.generalTalents - 1 : pools.generalTalents}</strong> obecných talentů (Věk: {ageGroup} {isProfRank2Selected ? ', -1 za profesní talent lvl 2' : ''})
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-1 bg-fl-card/50 p-2 rounded border border-fl-border">
                  {catalogTalents.general?.map(t => {
                    const isSelected = selectedGeneralTalentIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleGeneralTalentToggle(t.id)}
                        className={`p-3 rounded-sm border cursor-pointer flex flex-col justify-between transition-colors ${
                          isSelected
                            ? 'border-fl-primary bg-fl-primary/10'
                            : 'border-fl-border bg-fl-card hover:border-fl-primary/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs text-fl-surface">{t.name}</span>
                          {isSelected && <Check size={14} className="text-fl-primary shrink-0" />}
                        </div>
                        {t.ranks?.[0]?.description && (
                          <p className="text-[10px] text-fl-text-muted leading-relaxed font-serif mt-1 line-clamp-2">
                            {t.ranks[0].description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Spells (Druid/Mage only) */}
          {step === 5 && isSpellcaster && (
            <div className="space-y-6">
              <div className="border-b border-fl-border pb-3">
                <h3 className="font-serif text-lg font-bold">Výběr Startovních Kouzel</h3>
                <p className="text-xs text-fl-text-muted">Vyberte přesně 2 kouzla 1. úrovně ze své školy magie nebo z obecné magie.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* School Spells */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base font-bold text-fl-primary">Škola: {startingSpellChoices.schoolName}</h4>
                  <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                    {startingSpellChoices.schoolSpells?.map(s => {
                      const isSelected = selectedSpellIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSpellToggle(s.id)}
                          className={`p-3 rounded border cursor-pointer space-y-1 transition-colors ${
                            isSelected ? 'border-fl-primary bg-fl-primary/10' : 'border-fl-border bg-fl-card hover:border-fl-primary/40'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs">{s.name}</span>
                            {isSelected && <Check size={14} className="text-fl-primary" />}
                          </div>
                          <p className="text-[10px] text-fl-text-muted leading-relaxed font-serif line-clamp-2">{s.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* General Spells */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base font-bold text-fl-surface-hover">Obecná Magie</h4>
                  <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                    {startingSpellChoices.generalSpells?.map(s => {
                      const isSelected = selectedSpellIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSpellToggle(s.id)}
                          className={`p-3 rounded border cursor-pointer space-y-1 transition-colors ${
                            isSelected ? 'border-fl-primary bg-fl-primary/10' : 'border-fl-border bg-fl-card hover:border-fl-primary/40'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs">{s.name}</span>
                            {isSelected && <Check size={14} className="text-fl-primary" />}
                          </div>
                          <p className="text-[10px] text-fl-text-muted leading-relaxed font-serif line-clamp-2">{s.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Gear, Pride, Secrets, Confirm */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="border-b border-fl-border pb-3">
                <h3 className="font-serif text-lg font-bold">Detaily a Výstroj postavy</h3>
                <p className="text-xs text-fl-text-muted">Doplňte startovní vybavení, pýchu a temné tajemství.</p>
              </div>

              {/* Pride and Dark Secret */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Pýcha postavy</label>
                  <textarea
                    value={pride}
                    onChange={e => setPride(e.target.value)}
                    rows={2}
                    className="w-full bg-fl-card border border-fl-border rounded px-3 py-2 text-xs text-fl-surface focus:border-fl-primary focus:outline-none placeholder:text-fl-border/50"
                    placeholder="Např. Nikdy neustoupím před přesilou..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Temné tajemství</label>
                  <textarea
                    value={darkSecret}
                    onChange={e => setDarkSecret(e.target.value)}
                    rows={2}
                    className="w-full bg-fl-card border border-fl-border rounded px-3 py-2 text-xs text-fl-surface focus:border-fl-primary focus:outline-none placeholder:text-fl-border/50"
                    placeholder="Např. Ve skutečnosti jsem ukradl rodinný klenot..."
                  />
                </div>
              </div>

              {/* Appearance and Reputation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Vzhled postavy</label>
                  <input
                    type="text"
                    value={appearance}
                    onChange={e => setAppearance(e.target.value)}
                    className="w-full bg-fl-card border border-fl-border rounded px-3 py-2 text-xs text-fl-surface focus:border-fl-primary focus:outline-none"
                    placeholder="Např. Jizva přes oko, dlouhé vousy..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-fl-primary mb-1 tracking-wider">Počáteční Reputace</label>
                  <input
                    type="number"
                    value={reputation}
                    onChange={e => setReputation(e.target.value)}
                    className="w-full bg-fl-card border border-fl-border rounded px-3 py-2 text-xs text-fl-surface focus:border-fl-primary focus:outline-none"
                    placeholder="Např. 1"
                  />
                </div>
              </div>

              {/* Starting Gear */}
              <div className="bg-fl-card border border-fl-border p-4 rounded-sm space-y-4">
                <div>
                  <h4 className="font-serif text-sm font-bold text-fl-primary uppercase">Startovní Výstroj</h4>
                  <p className="text-xs text-fl-text-muted">Vyberte si ze doporučených předmětů nebo vyhledejte jakýkoli předmět.</p>
                </div>

                {/* Recommended gear quick buttons */}
                <div className="flex flex-wrap gap-1">
                  {(PROF_GEAR_RECOMMENDED[profession] || []).map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStartingItems(prev => [...prev, { name: item, weight: 1 }])}
                      className="px-2 py-1 bg-fl-primary/10 hover:bg-fl-primary/30 border border-fl-primary/30 text-fl-primary text-[10px] rounded font-bold uppercase transition-colors"
                    >
                      + {item}
                    </button>
                  ))}
                </div>

                {/* Add custom item search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Vyhledat předmět v katalogu..."
                    className="w-full pl-3 pr-4 py-1.5 text-xs bg-fl-paper-bright border border-fl-border rounded text-fl-surface focus:border-fl-primary focus:outline-none"
                    value={itemSearch}
                    onChange={e => setItemSearch(e.target.value)}
                  />
                  {filteredGearSearch.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-fl-card border border-fl-primary rounded-b z-10 shadow-lg max-h-[150px] overflow-y-auto">
                      {filteredGearSearch.map(item => (
                        <div
                          key={item['Předmět']}
                          onClick={() => {
                            addStartingItem(item);
                            setItemSearch('');
                          }}
                          className="px-3 py-1.5 text-xs hover:bg-fl-paper cursor-pointer text-fl-surface border-b border-fl-border/50 flex justify-between"
                        >
                          <span className="font-bold">{item['Předmět']}</span>
                          <span className="text-[10px] text-fl-primary">{item.Category} • Váha {item['Váha']}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Starting items list */}
                <div className="space-y-1 bg-fl-paper-bright/40 p-2 rounded border border-fl-border max-h-[180px] overflow-y-auto">
                  {startingItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-1 bg-fl-card border border-fl-border/50 rounded-sm">
                      <span className="font-serif font-bold text-fl-surface">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-fl-text-muted">Váha: {item.weight}</span>
                        <button
                          type="button"
                          onClick={() => removeStartingItem(idx)}
                          className="text-red-700 hover:text-red-500 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {startingItems.length === 0 && (
                    <div className="text-center py-4 text-xs italic text-fl-text-muted">
                      Žádné předměty nezvoleny.
                    </div>
                  )}
                </div>

                {/* Starting Money */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-fl-primary uppercase">Zlaťáky</label>
                    <input
                      type="number"
                      value={startingGold}
                      onChange={e => setStartingGold(parseInt(e.target.value) || 0)}
                      className="w-full bg-fl-card border border-fl-border rounded px-2 py-1 text-xs text-fl-surface focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-fl-primary uppercase">Stříbrňáky</label>
                    <input
                      type="number"
                      value={startingSilver}
                      onChange={e => setStartingSilver(parseInt(e.target.value) || 0)}
                      className="w-full bg-fl-card border border-fl-border rounded px-2 py-1 text-xs text-fl-surface focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-fl-primary uppercase">Měďáky</label>
                    <input
                      type="number"
                      value={startingCopper}
                      onChange={e => setStartingCopper(parseInt(e.target.value) || 0)}
                      className="w-full bg-fl-card border border-fl-border rounded px-2 py-1 text-xs text-fl-surface focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-fl-border bg-fl-card flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 border border-fl-border rounded text-sm text-fl-surface-hover hover:text-white hover:border-fl-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={16} /> Zpět
          </button>

          {step === (isSpellcaster ? 6 : 6) ? (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2 bg-fl-primary hover:bg-fl-primary-hover text-fl-bg font-bold rounded shadow-lg transition-colors border border-fl-primary"
            >
              <Check size={16} /> Vytvořit Postavu
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 px-6 py-2 bg-fl-primary hover:bg-fl-primary-hover text-fl-bg font-bold rounded shadow-lg transition-colors border border-fl-primary"
            >
              Dále <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
