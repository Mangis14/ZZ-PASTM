import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ShoppingBag, ShoppingCart, Hammer, Clock, Star, Shield, Zap, Sword, Crosshair, Shirt, FlaskConical, HandCoins, Circle, X, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './components/common/Card';
import SectionHeader from './components/common/SectionHeader';
import MoneyInput from './components/common/MoneyInput';
import { CATEGORY_ORDER, useCatalog } from './context/CatalogContext';
import { registerBackHandler, hapticTick } from './native/platform';

const ALL_CATEGORY = 'Vše';
const BROWSE_STATE_KEY = 'fl_goods_browse_state';

const DEFAULT_BROWSE_STATE = {
    search: '',
    selectedCategories: [ALL_CATEGORY],
    talentFilter: [],
    materialFilter: [],
    weightFilter: [],
    rarityFilter: [],
    zbrojFilter: [],
    damageFilter: [],
    timeFilter: [],
    handsFilter: [],
    showFilters: false,
    sortOrder: 'asc'
};

const loadBrowseState = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(BROWSE_STATE_KEY) || '{}');
        return { ...DEFAULT_BROWSE_STATE, ...saved };
    } catch {
        return DEFAULT_BROWSE_STATE;
    }
};

const CATEGORY_ICONS = {
    [ALL_CATEGORY]: ShoppingBag,
    'Zboží': ShoppingBag,
    'Zbraně nablízko': Sword,
    'Střelné zbraně': Crosshair,
    'Zbroj': Shield,
    'Oblečení': Shirt,
    'Suroviny': Hammer,
    'Lektvary': FlaskConical,
    'Služby': HandCoins
};

const CATEGORY_FILTER_KEYS = {
    [ALL_CATEGORY]: ['weight', 'rarity', 'talent', 'material', 'time', 'zbroj', 'damage', 'hands'],
    'Zboží': ['weight', 'rarity', 'talent', 'material', 'time'],
    'Zbraně nablízko': ['damage', 'hands', 'weight', 'rarity', 'talent'],
    'Střelné zbraně': ['damage', 'hands', 'weight', 'rarity', 'talent'],
    'Zbroj': ['zbroj', 'weight', 'rarity', 'talent'],
    'Oblečení': ['weight', 'rarity', 'talent'],
    'Suroviny': ['material', 'talent', 'time', 'weight', 'rarity'],
    'Lektvary': ['rarity', 'talent', 'material', 'time', 'weight'],
    'Služby': ['rarity', 'time']
};

const QUICK_FILTER_KEYS = {
    [ALL_CATEGORY]: ['weight', 'rarity'],
    'Zboží': ['weight', 'rarity'],
    'Zbraně nablízko': ['damage', 'hands'],
    'Střelné zbraně': ['damage', 'hands'],
    'Zbroj': ['zbroj', 'weight'],
    'Oblečení': ['weight', 'rarity'],
    'Suroviny': ['material', 'talent'],
    'Lektvary': ['rarity', 'talent'],
    'Služby': ['rarity', 'time']
};

const getCopperValue = (price) => {
    if (!price) return 0;
    let val = price.value;
    if (price.currency === 'gold') val *= 100;
    if (price.currency === 'silver') val *= 10;
    return val;
};

export const parseWeight = (w) => {
    if (!w) return 0;
    const str = String(w).toLowerCase().trim();
    if (['–', '-', 'drobné', 'drobný', 'drobná', '', '0'].includes(str)) return 0;
    if (str.includes('lehk') || str.includes('1/2') || str.includes('½')) return 0.5;
    if (str.includes('normální') || str.includes('běžn')) return 1;
    if (str.includes('těžk')) return 2;
    const num = parseFloat(str.replace(',', '.'));
    return isNaN(num) ? 0 : num;
};

const formatPrice = (copperTotal) => {
    if (copperTotal === 0) return { value: 0, currency: 'copper' };
    if (copperTotal >= 100 && copperTotal % 100 === 0) return { value: copperTotal / 100, currency: 'gold' };
    if (copperTotal >= 10 && copperTotal % 10 === 0) return { value: copperTotal / 10, currency: 'silver' };
    return { value: copperTotal, currency: 'copper' };
};

const PriceDisplay = ({ price, cena, size = 'sm' }) => {
    const iconSize = size === 'lg' ? 14 : 10;
    return (
        <div className={`flex items-center gap-1 font-mono font-bold ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
            {price ? (
                <>
                    <span>{price.value}</span>
                    <Circle
                        size={iconSize}
                        className={`fill-current ${price.currency === 'gold' ? 'text-[#FFD700]' : price.currency === 'copper' ? 'text-[#9E6649]' : 'text-gray-400'}`}
                    />
                </>
            ) : (
                <span>{cena}</span>
            )}
        </div>
    );
};

// Cart Panel Component
const CartPanel = ({ cart, removeFromCart, incrementCart, completelyRemoveCart, clearCart, addItemToInventory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [agreedPrice, setAgreedPrice] = useState({ gold: 0, silver: 0, copper: 0 });

    // Systémové Späť zatvorí rozbalený košík namiesto opustenia sekcie
    useEffect(() => {
        if (!isOpen) return undefined;
        return registerBackHandler(() => setIsOpen(false));
    }, [isOpen]);

    const totalCopper = useMemo(() => {
        return cart.reduce((sum, item) => sum + getCopperValue(item.price) * item.qty, 0);
    }, [cart]);

    const totalPrice = formatPrice(totalCopper);
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const handleCheckout = () => {
        cart.forEach(item => {
            for (let i = 0; i < item.qty; i++) {
                if (addItemToInventory) {
                    addItemToInventory({
                        name: item.Předmět,
                        weight: parseWeight(item.Váha)
                    });
                }
            }
        });
        clearCart();
        setAgreedPrice({ gold: 0, silver: 0, copper: 0 });
        setIsOpen(false);
        hapticTick(25);
    };

    if (cart.length === 0) return null;

    return (
        <div className="floating-cart-panel fixed left-0 right-0 z-40 px-4 max-w-3xl mx-auto">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    aria-expanded={false}
                    className="w-full min-h-14 bg-fl-nav text-white py-3 px-4 rounded-2xl shadow-xl border border-fl-primary flex items-center justify-between hover:bg-fl-nav-hover active:bg-fl-nav-hover transition-colors animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative" aria-hidden="true">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-fl-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        </div>
                        <span className="font-bold uppercase text-sm tracking-wider">Košík ({itemCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PriceDisplay price={totalPrice} size="lg" />
                        <ChevronUp size={18} aria-hidden="true" />
                    </div>
                </button>
            )}

            {isOpen && (
                <div
                    className="bg-fl-card border border-fl-primary rounded-lg shadow-2xl overflow-hidden flex flex-col"
                    style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-bottom) - 7.5rem)' }}
                >
                    <div className="bg-fl-nav p-2 pl-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <ShoppingCart size={20} aria-hidden="true" />
                            <span className="font-bold uppercase text-sm tracking-wider">Košík ({itemCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={clearCart} aria-label="Vysypat košík" className="flex h-11 w-11 items-center justify-center rounded-full text-red-400 hover:text-red-300 hover:bg-white/10 active:bg-white/10 transition-colors" title="Vysypat košík">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} aria-label="Sbalit košík" className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:text-fl-primary hover:bg-white/10 active:bg-white/10 transition-colors">
                                <ChevronDown size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 max-h-56 overflow-y-auto overscroll-contain p-3 space-y-2">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-fl-paper-bright p-2 rounded-lg border border-fl-paper text-sm">
                                <div className="flex-1 min-w-0">
                                    <span className="font-bold text-fl-surface truncate block">{item.Předmět}</span>
                                    <span className="text-[10px] text-fl-text-muted">
                                        {item.qty > 1 ? `${item.qty}× ` : ''}
                                        <PriceDisplay price={item.price} cena={item.Cena} />
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                    <div className="flex items-center bg-fl-paper-light rounded-lg border border-fl-border overflow-hidden">
                                        <button onClick={() => removeFromCart(idx)} aria-label={`Ubrat ${item.Předmět}`} className="h-10 w-10 flex items-center justify-center text-fl-primary hover:bg-fl-primary hover:text-white active:bg-fl-primary active:text-white transition-colors">−</button>
                                        <span className="text-xs font-bold w-5 text-center tabular-nums">{item.qty}</span>
                                        <button onClick={() => incrementCart(idx)} aria-label={`Přidat ${item.Předmět}`} className="h-10 w-10 flex items-center justify-center text-fl-primary hover:bg-fl-primary hover:text-white active:bg-fl-primary active:text-white transition-colors">+</button>
                                    </div>
                                    <div className="text-right flex items-center gap-1">
                                        <PriceDisplay price={item.price ? { ...item.price, value: item.price.value * item.qty } : null} cena={item.Cena} />
                                        <button onClick={() => completelyRemoveCart(idx)} aria-label={`Odstranit ${item.Předmět} z košíku`} className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 hover:text-red-700 hover:bg-red-900/15 active:bg-red-900/15 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t border-fl-paper space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-fl-text-muted font-bold uppercase text-xs">Katalogová cena:</span>
                            <div className="bg-fl-paper-light px-3 py-1 rounded border border-fl-paper">
                                <PriceDisplay price={totalPrice} size="lg" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-fl-text-muted font-bold uppercase">Dohodnutá cena:</label>
                            <MoneyInput money={agreedPrice} onChange={setAgreedPrice} />
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full min-h-12 py-3 bg-green-700 dark:bg-green-800 text-white hover:bg-green-800 dark:hover:bg-green-700 rounded-xl font-bold uppercase text-sm tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
                        >
                            <Check size={18} aria-hidden="true" />
                            Přidat vše do batohu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const toggleSelection = (selectedValues, value) => (
    selectedValues.includes(value)
        ? selectedValues.filter(item => item !== value)
        : [...selectedValues, value]
);

const materialMatchesCategory = (materialText, category) => {
    const s = (materialText || '').toLowerCase();
    if (category === 'Železo/Ocel') return s.includes('želez') || s.includes('ocel');
    if (category === 'Dřevo') return s.includes('dřev');
    if (category === 'Kůže/Useň') return s.includes('usn') || s.includes('kůž') || s.includes('kúž');
    if (category === 'Látka/Příze') return s.includes('látk') || s.includes('příz');
    if (category === 'Zlato') return s.includes('zlat');
    if (category === 'Stříbro') return s.includes('stříb');
    if (category === 'Byliny') return s.includes('bylin') || s.includes('rostlin');
    if (category === 'Kámen/Písek') return s.includes('kám') || s.includes('kamen') || s.includes('písek');
    if (category === 'Živočišná (maso/kosti)') return s.includes('maso') || s.includes('tuk') || s.includes('kost') || s.includes('roh');
    return false;
};

const FilterPillGroup = ({ label, icon: Icon, options, selectedValues, onToggle, onClear }) => {
    if (!options || options.length === 0) return null;

    const stopSwipePropagation = (e) => e.stopPropagation();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-fl-primary">
                <Icon size={12} />
                <span>{label}</span>
            </div>
            <div
                className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1"
                onTouchStart={stopSwipePropagation}
                onTouchMove={stopSwipePropagation}
            >
                <button
                    type="button"
                    onClick={onClear}
                    aria-pressed={selectedValues.length === 0}
                    className={`min-h-10 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors active:opacity-80 ${
                        selectedValues.length === 0
                            ? 'bg-fl-primary text-white border-fl-primary'
                            : 'bg-fl-paper text-fl-text-muted border-fl-border hover:bg-fl-border hover:text-fl-surface'
                    }`}
                >
                    Vše
                </button>
                {options.map(option => {
                    const isSelected = selectedValues.includes(option);
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onToggle(option)}
                            aria-pressed={isSelected}
                            className={`min-h-10 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors active:opacity-80 ${
                                isSelected
                                    ? 'bg-fl-nav text-white border-fl-nav-hover'
                                    : 'bg-fl-paper-bright text-fl-surface border-fl-border hover:bg-fl-paper hover:border-fl-primary'
                            }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const ZboziSection = ({ addItemToInventory, equipItem }) => {
    const { itemsByCategory, allItems } = useCatalog();
    const [initialBrowseState] = useState(loadBrowseState);
    const [search, setSearch] = useState(initialBrowseState.search);
    const [selectedCategories, setSelectedCategories] = useState(initialBrowseState.selectedCategories);
    const [talentFilter, setTalentFilter] = useState(initialBrowseState.talentFilter);
    const [materialFilter, setMaterialFilter] = useState(initialBrowseState.materialFilter);
    const [weightFilter, setWeightFilter] = useState(initialBrowseState.weightFilter);
    const [rarityFilter, setRarityFilter] = useState(initialBrowseState.rarityFilter);
    const [zbrojFilter, setZbrojFilter] = useState(initialBrowseState.zbrojFilter);
    const [damageFilter, setDamageFilter] = useState(initialBrowseState.damageFilter);
    const [timeFilter, setTimeFilter] = useState(initialBrowseState.timeFilter);
    const [handsFilter, setHandsFilter] = useState(initialBrowseState.handsFilter);
    const [expandedItems, setExpandedItems] = useState({});
    const [showCategories, setShowCategories] = useState(false);
    const [showFilters, setShowFilters] = useState(initialBrowseState.showFilters);
    const [sortOrder, setSortOrder] = useState(initialBrowseState.sortOrder);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        localStorage.setItem(BROWSE_STATE_KEY, JSON.stringify({
            search,
            selectedCategories,
            talentFilter,
            materialFilter,
            weightFilter,
            rarityFilter,
            zbrojFilter,
            damageFilter,
            timeFilter,
            handsFilter,
            showFilters,
            sortOrder
        }));
    }, [search, selectedCategories, talentFilter, materialFilter, weightFilter, rarityFilter, zbrojFilter, damageFilter, timeFilter, handsFilter, showFilters, sortOrder]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.findIndex(c => c.Předmět === item.Předmět);
            if (existing !== -1) {
                const updated = [...prev];
                updated[existing] = { ...updated[existing], qty: updated[existing].qty + 1 };
                return updated;
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (index) => {
        setCart(prev => {
            const updated = [...prev];
            if (updated[index].qty > 1) {
                updated[index] = { ...updated[index], qty: updated[index].qty - 1 };
            } else {
                updated.splice(index, 1);
            }
            return updated;
        });
    };

    const incrementCart = (index) => {
        setCart(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], qty: updated[index].qty + 1 };
            return updated;
        });
    };

    const completelyRemoveCart = (index) => {
        setCart(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            return updated;
        });
    };

    const clearCart = () => setCart([]);

    const toggleExpand = (name) => {
        setExpandedItems(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const dataMap = useMemo(() => ({
        [ALL_CATEGORY]: allItems,
        ...itemsByCategory
    }), [allItems, itemsByCategory]);

    const categories = useMemo(() => {
        const importedCategories = Object.keys(itemsByCategory).filter(id => !CATEGORY_ORDER.includes(id)).sort();
        return [ALL_CATEGORY, ...CATEGORY_ORDER, ...importedCategories].map(id => ({
            id,
            icon: CATEGORY_ICONS[id] || ShoppingBag,
            count: (dataMap[id] || []).filter(item => item.Předmět !== 'Předmět').length
        }));
    }, [dataMap, itemsByCategory]);

    const currentData = useMemo(() => {
        if (selectedCategories.includes(ALL_CATEGORY)) return dataMap[ALL_CATEGORY] || [];
        return selectedCategories.flatMap(category => dataMap[category] || []);
    }, [dataMap, selectedCategories]);

    const talents = useMemo(() => {
        const values = new Set(currentData.map(item => item.Talent).filter(Boolean).filter(t => t !== '–'));
        return Array.from(values).sort();
    }, [currentData]);

    const materials = useMemo(() => {
        const mats = new Set();
        currentData.forEach(item => {
            if (item.Suroviny && item.Suroviny !== '–') {
                const s = item.Suroviny.toLowerCase();
                if (s.includes('želez') || s.includes('ocel')) mats.add('Železo/Ocel');
                if (s.includes('dřev')) mats.add('Dřevo');
                if (s.includes('usn') || s.includes('kúž') || s.includes('kůž')) mats.add('Kůže/Useň');
                if (s.includes('látk') || s.includes('příz')) mats.add('Látka/Příze');
                if (s.includes('zlat')) mats.add('Zlato');
                if (s.includes('stříb')) mats.add('Stříbro');
                if (s.includes('bylin') || s.includes('rostlin')) mats.add('Byliny');
                if (s.includes('kám') || s.includes('kamen') || s.includes('písek')) mats.add('Kámen/Písek');
                if (s.includes('maso') || s.includes('tuk') || s.includes('kost') || s.includes('roh')) mats.add('Živočišná (maso/kosti)');
            }
        });
        return Array.from(mats).sort();
    }, [currentData]);

    const weights = useMemo(() => {
        const values = new Set(currentData.map(item => item.Váha).filter(Boolean).filter(t => t !== '–' && t !== '-'));
        return Array.from(values).sort((a, b) => {
            const getRank = (s) => {
                const l = s.toLowerCase();
                if (l.includes('drobn')) return 1;
                if (l.includes('lehk')) return 2;
                if (l.includes('norm')) return 3;
                if (l.includes('těžk')) return 4;
                return 5;
            };
            return getRank(a) - getRank(b);
        });
    }, [currentData]);

    const rarities = useMemo(() => {
        const values = new Set(currentData.map(item => item.Dostupnost).filter(Boolean).filter(t => t !== '–' && t !== '-'));
        return Array.from(values).sort((a, b) => {
            const sA = a.toLowerCase();
            const sB = b.toLowerCase();
            const getRank = (s) => {
                if (s.includes('běžn')) return 1;
                if (s.includes('neobvyk')) return 2;
                if (s.includes('vzácn')) return 3;
                return 0;
            };
            return getRank(sA) - getRank(sB);
        });
    }, [currentData]);

    const zbrojValues = useMemo(() => {
        const values = new Set(currentData.map(item => item.Zbroj).filter(Boolean).filter(t => t !== '–' && t !== '-'));
        return Array.from(values).sort((a, b) => parseInt(a) - parseInt(b));
    }, [currentData]);

    const damages = useMemo(() => {
        const values = new Set(currentData.map(item => item.Zranění).filter(Boolean).filter(t => t !== '–' && t !== '-'));
        return Array.from(values).sort((a, b) => parseInt(a) - parseInt(b));
    }, [currentData]);

    const hands = useMemo(() => {
        const values = new Set(currentData.map(item => item.Ruce).filter(Boolean).filter(t => t !== '–' && t !== '-'));
        return Array.from(values).sort();
    }, [currentData]);

    const times = useMemo(() => {
        const values = new Set(currentData.map(item => item.Čas).filter(Boolean).filter(t => t !== '–' && t !== '-'));
        return Array.from(values).sort((a, b) => {
            const getRank = (str) => {
                const s = String(str).toLowerCase();
                if (s.includes('čtvrt')) return 1;
                if (s.includes('den') || s.includes('dny')) return 2;
                if (s.includes('týden') || s.includes('týdny')) return 3;
                return 4;
            };
            return getRank(a) - getRank(b);
        });
    }, [currentData]);

    const activeFilterCount =
        talentFilter.length +
        materialFilter.length +
        weightFilter.length +
        rarityFilter.length +
        zbrojFilter.length +
        damageFilter.length +
        handsFilter.length +
        timeFilter.length;

    const resetFilters = () => {
        setTalentFilter([]);
        setMaterialFilter([]);
        setWeightFilter([]);
        setRarityFilter([]);
        setZbrojFilter([]);
        setDamageFilter([]);
        setHandsFilter([]);
        setTimeFilter([]);
    };

    const filteredData = useMemo(() => {
        let data = [...currentData];

        data = data.filter(item => {
            if (item.Předmět === 'Předmět') return false;

            const searchLower = search.toLowerCase();
            const matchesSearch =
                (item.Předmět && item.Předmět.toLowerCase().includes(searchLower)) ||
                (item.Účinek && item.Účinek.toLowerCase().includes(searchLower)) ||
                (item.Vlastnosti && item.Vlastnosti.toLowerCase().includes(searchLower)) ||
                (item.Poznámky && item.Poznámky.toLowerCase().includes(searchLower));

            const matchesTalent = talentFilter.length === 0 || talentFilter.some(value => item.Talent && item.Talent.includes(value));
            const matchesWeight = weightFilter.length === 0 || weightFilter.includes(item.Váha);
            const matchesRarity = rarityFilter.length === 0 || rarityFilter.includes(item.Dostupnost);
            const matchesZbroj = zbrojFilter.length === 0 || zbrojFilter.includes(item.Zbroj);
            const matchesDamage = damageFilter.length === 0 || damageFilter.includes(item.Zranění);
            const matchesHands = handsFilter.length === 0 || handsFilter.includes(item.Ruce);
            const matchesTime = timeFilter.length === 0 || timeFilter.includes(item.Čas);
            const matchesMaterial = materialFilter.length === 0 || materialFilter.some(category => materialMatchesCategory(item.Suroviny, category));

            return matchesSearch && matchesTalent && matchesWeight && matchesRarity && matchesMaterial &&
                   matchesZbroj && matchesDamage && matchesHands && matchesTime;
        });

        data.sort((a, b) => {
            const valA = getCopperValue(a.price);
            const valB = getCopperValue(b.price);
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        return data;
    }, [search, currentData, talentFilter, sortOrder, materialFilter, weightFilter, rarityFilter, zbrojFilter, damageFilter, handsFilter, timeFilter]);

    const filterGroups = [
        { key: 'talent', label: 'Talent', icon: Star, selectedValues: talentFilter, setter: setTalentFilter, options: talents },
        { key: 'material', label: 'Suroviny', icon: Hammer, selectedValues: materialFilter, setter: setMaterialFilter, options: materials },
        { key: 'weight', label: 'Váha', icon: Shield, selectedValues: weightFilter, setter: setWeightFilter, options: weights },
        { key: 'rarity', label: 'Dostupnost', icon: Clock, selectedValues: rarityFilter, setter: setRarityFilter, options: rarities },
        { key: 'zbroj', label: 'Zbroj', icon: Shield, selectedValues: zbrojFilter, setter: setZbrojFilter, options: zbrojValues },
        { key: 'damage', label: 'Zranění', icon: Sword, selectedValues: damageFilter, setter: setDamageFilter, options: damages },
        { key: 'time', label: 'Výroba (Čas)', icon: Clock, selectedValues: timeFilter, setter: setTimeFilter, options: times },
        { key: 'hands', label: 'Ruce', icon: HandCoins, selectedValues: handsFilter, setter: setHandsFilter, options: hands }
    ].filter(group => {
        const allowedKeys = new Set(selectedCategories.flatMap(category => CATEGORY_FILTER_KEYS[category] || CATEGORY_FILTER_KEYS[ALL_CATEGORY]));
        return group.options.length > 0 && allowedKeys.has(group.key);
    });

    const quickKeys = new Set(selectedCategories.flatMap(category => QUICK_FILTER_KEYS[category] || QUICK_FILTER_KEYS[ALL_CATEGORY]));
    const quickFilterGroups = filterGroups.filter(group => quickKeys.has(group.key));
    const additionalFilterGroups = filterGroups.filter(group => !quickKeys.has(group.key));
    const activeFilterChips = filterGroups.flatMap(group => group.selectedValues.map(value => ({
        key: `${group.key}-${value}`,
        label: value,
        remove: () => group.setter(prev => prev.filter(item => item !== value))
    })));
    const categoryLabel = selectedCategories.includes(ALL_CATEGORY)
        ? ALL_CATEGORY
        : selectedCategories.join(', ');
    const selectedItemCount = currentData.filter(item => item.Předmět !== 'Předmět').length;
    const ActiveCategoryIcon = selectedCategories.length === 1
        ? CATEGORY_ICONS[selectedCategories[0]] || ShoppingBag
        : ShoppingBag;

    const toggleCategory = (category) => {
        setSelectedCategories(prev => {
            if (category === ALL_CATEGORY) return [ALL_CATEGORY];
            const withoutAll = prev.filter(item => item !== ALL_CATEGORY);
            const next = withoutAll.includes(category)
                ? withoutAll.filter(item => item !== category)
                : [...withoutAll, category];
            return next.length > 0 ? next : [ALL_CATEGORY];
        });
    };

    return (
        <section id="zbozi-section" className={`scroll-mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500 ${cart.length > 0 ? 'pb-[34rem]' : ''}`}>
            <SectionHeader title="Zboží a Služby" icon={ShoppingBag} />

            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => setShowCategories(prev => !prev)}
                    className="w-full flex items-center justify-between gap-3 rounded-lg border border-fl-primary bg-fl-card p-3 text-left shadow-md transition-colors hover:bg-fl-paper"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fl-primary/15 text-fl-primary">
                            <ActiveCategoryIcon size={21} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-fl-text-muted">Kategorie</div>
                            <div className="truncate font-serif text-lg font-bold text-fl-surface">{categoryLabel}</div>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full border border-fl-border bg-fl-paper px-2 py-1 text-xs font-bold text-fl-primary">
                            {selectedItemCount} položek
                        </span>
                        {showCategories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </button>

                {showCategories && (
                    <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-fl-border bg-fl-card p-2 shadow-lg sm:grid-cols-3">
                        {categories.map(category => {
                            const CategoryIcon = category.icon;
                            const isActive = selectedCategories.includes(category.id);
                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => toggleCategory(category.id)}
                                    className={`flex min-h-[70px] items-center gap-2 rounded-md border p-2 text-left transition-colors ${
                                        isActive
                                            ? 'border-fl-primary bg-fl-primary text-white'
                                            : 'border-fl-border bg-fl-paper-bright text-fl-surface hover:border-fl-primary hover:bg-fl-paper'
                                    }`}
                                >
                                    <CategoryIcon size={18} className="shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold leading-tight">{category.id}</div>
                                        <div className={`mt-1 text-[10px] ${isActive ? 'text-white/75' : 'text-fl-text-muted'}`}>
                                            {category.count} položek
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <Card className="mb-6">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2 h-12">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={16} aria-hidden="true" />
                            <input
                                type="search"
                                placeholder={`Hledat v kategoriích ${categoryLabel}...`}
                                aria-label="Hledat zboží"
                                className="w-full h-full pl-9 pr-3 bg-fl-paper-bright border border-fl-border rounded-lg focus:outline-none focus:border-fl-primary text-fl-surface text-sm placeholder:text-fl-text-muted"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="px-3 border border-fl-border rounded-lg text-fl-surface-hover hover:bg-fl-border hover:text-fl-surface active:bg-fl-border transition-colors flex items-center justify-center gap-1 font-bold text-xs uppercase tracking-wider min-w-[70px]"
                            title="Řadit podle ceny"
                            aria-label={`Řadit podle ceny ${sortOrder === 'asc' ? 'vzestupně' : 'sestupně'}`}
                        >
                            <ArrowUpDown size={14} aria-hidden="true" />
                            <span className="hidden sm:inline">Cena</span> {sortOrder === 'asc' ? '▲' : '▼'}
                        </button>
                        {additionalFilterGroups.length > 0 && (
                            <button
                                onClick={() => setShowFilters(prev => !prev)}
                                aria-label="Další filtry"
                                className={`relative px-3 border rounded-sm flex items-center justify-center transition-colors shadow-sm ${
                                    showFilters || activeFilterCount > 0
                                        ? 'bg-fl-primary text-white border-fl-primary'
                                        : 'bg-fl-paper text-fl-surface hover:bg-fl-border border-fl-border'
                                }`}
                                title="Podrobné filtrování"
                            >
                                <Filter size={16} />
                                <span className="ml-1 hidden text-[10px] font-bold uppercase sm:inline">Další</span>
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 border border-white text-white text-[9px] font-bold min-w-4 h-4 px-1 flex items-center justify-center rounded-full leading-none">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>

                    {quickFilterGroups.length > 0 && (
                        <div className="space-y-4 border-t border-fl-paper pt-3">
                            {quickFilterGroups.map(group => (
                                <FilterPillGroup
                                    key={group.label}
                                    label={group.label}
                                    icon={group.icon}
                                    options={group.options}
                                    selectedValues={group.selectedValues}
                                    onToggle={(option) => group.setter(prev => toggleSelection(prev, option))}
                                    onClear={() => group.setter([])}
                                />
                            ))}
                        </div>
                    )}

                    {showFilters && additionalFilterGroups.length > 0 && (
                        <div className="pt-3 mt-1 border-t border-fl-paper animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-[11px] uppercase tracking-wider text-fl-text-muted">
                                    Další filtry pro vybrané kategorie
                                </div>
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="text-[11px] font-bold uppercase tracking-wider text-fl-primary hover:text-fl-primary-hover transition-colors"
                                    >
                                        Vyčistit
                                    </button>
                                )}
                            </div>

                            {additionalFilterGroups.map(group => (
                                <FilterPillGroup
                                    key={group.label}
                                    label={group.label}
                                    icon={group.icon}
                                    options={group.options}
                                    selectedValues={group.selectedValues}
                                    onToggle={(option) => group.setter(prev => toggleSelection(prev, option))}
                                    onClear={() => group.setter([])}
                                />
                            ))}
                        </div>
                    )}

                    {activeFilterChips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 border-t border-fl-paper pt-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-fl-text-muted">Aktivní:</span>
                            {activeFilterChips.map(chip => (
                                <button
                                    key={chip.key}
                                    type="button"
                                    onClick={chip.remove}
                                    className="flex items-center gap-1 rounded-full border border-fl-primary/40 bg-fl-primary/10 px-2 py-1 text-[10px] font-bold text-fl-primary hover:bg-fl-primary hover:text-white"
                                >
                                    {chip.label} <X size={10} />
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="ml-auto text-[10px] font-bold uppercase text-red-600 hover:text-red-500"
                            >
                                Vyčistit vše
                            </button>
                        </div>
                    )}
                </div>
            </Card>

            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-bold text-fl-surface">
                    {filteredData.length} {filteredData.length === 1 ? 'výsledek' : 'výsledků'}
                </div>
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="text-[10px] font-bold uppercase tracking-wider text-fl-primary hover:text-fl-primary-hover"
                    >
                        Zrušit hledání
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {filteredData.map((item, index) => {
                    const isExpanded = !!expandedItems[item.Předmět];
                    const isEquippable = ['Zbroj', 'Zbraně nablízko', 'Střelné zbraně'].includes(item.Category);

                    return (
                        <div
                            key={index}
                            className="bg-fl-card border border-fl-paper rounded-lg shadow-sm hover:border-fl-primary transition-colors overflow-hidden"
                        >
                            {/* CARD HEADER (Always Visible) */}
                            <button
                                type="button"
                                onClick={() => toggleExpand(item.Předmět)}
                                aria-expanded={isExpanded}
                                className="w-full min-h-14 p-3 flex justify-between items-center text-left active:bg-fl-paper/40 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="font-bold text-fl-surface text-base truncate">{item.Předmět}</h3>
                                        <span className="text-[10px] uppercase text-fl-primary/90 font-bold shrink-0">{item.Category}</span>
                                    </div>
                                    <div className="text-[11px] text-fl-text-muted mt-0.5 flex gap-2">
                                        {item.Váha && item.Váha !== '–' && <span>Váha: {item.Váha}</span>}
                                        {item.Dostupnost && <span>• {item.Dostupnost}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 ml-2">
                                    <div className="bg-fl-paper-light px-2 py-1 rounded text-xs border border-fl-paper font-bold shrink-0">
                                        <PriceDisplay price={item.price} cena={item.Cena} />
                                    </div>
                                    <div className="text-fl-primary" aria-hidden="true">
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {/* CARD BODY (Collapsible Details) */}
                            <div 
                                className={`transition-all duration-300 ease-in-out overflow-hidden border-fl-paper-light ${
                                    isExpanded ? 'max-h-[500px] border-t p-3' : 'max-h-0'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-fl-text-muted mb-2">
                                    {item.Suroviny && (
                                        <div className="flex items-center gap-1">
                                            <Hammer size={12} className="text-fl-primary" />
                                            <span><span className="font-bold">Suroviny:</span> {item.Suroviny}</span>
                                        </div>
                                    )}
                                    {item.Čas && (
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} className="text-fl-primary" />
                                            <span><span className="font-bold">Čas:</span> {item.Čas}</span>
                                        </div>
                                    )}
                                    {item.Talent && item.Talent !== '–' && (
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="text-fl-primary" />
                                            <span><span className="font-bold">Talent:</span> {item.Talent}</span>
                                        </div>
                                    )}
                                    {item.Zbroj && (
                                        <div className="flex items-center gap-1">
                                            <Shield size={12} className="text-fl-primary" />
                                            <span><span className="font-bold">Zbroj:</span> {item.Zbroj}</span>
                                        </div>
                                    )}
                                    {item.Zranění && (
                                        <div className="flex items-center gap-1">
                                            <Zap size={12} className="text-fl-primary" />
                                            <span><span className="font-bold">Zranění:</span> {item.Zranění}</span>
                                        </div>
                                    )}
                                    {item.Bonus && (
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="text-fl-primary" />
                                            <span><span className="font-bold">Bonus:</span> {item.Bonus}</span>
                                        </div>
                                    )}
                                    {item.Ruce && (
                                        <div className="flex items-center gap-1">
                                            <HandCoins size={12} className="text-fl-primary" />
                                            <span><span className="font-bold">Ruce:</span> {item.Ruce}</span>
                                        </div>
                                    )}
                                </div>

                                {(item.Účinek || item.Vlastnosti || item.Poznámky || item.Efekt) && (
                                    <div className="mt-2 pt-2 border-t border-fl-paper-light text-xs text-fl-surface-hover italic bg-fl-paper-bright p-2 rounded">
                                        {item.Účinek && <div className="mb-1"><span className="font-bold not-italic text-fl-primary">Účinek:</span> {item.Účinek}</div>}
                                        {item.Vlastnosti && <div className="mb-1"><span className="font-bold not-italic text-fl-primary">Vlastnosti:</span> {item.Vlastnosti}</div>}
                                        {item.Poznámky && <div className="mb-1"><span className="font-bold not-italic text-fl-primary">Poznámky:</span> {item.Poznámky}</div>}
                                        {item.Efekt && <div><span className="font-bold not-italic text-fl-primary">Efekt:</span> {item.Efekt}</div>}
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 mt-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                if (addItemToInventory) {
                                                    addItemToInventory({
                                                        name: item.Předmět,
                                                        weight: parseWeight(item.Váha)
                                                    });
                                                }
                                            }}
                                            className="flex-1 min-h-11 bg-fl-paper border border-fl-border text-fl-primary hover:text-white hover:border-fl-primary hover:bg-fl-primary rounded-lg text-xs font-bold uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <ShoppingBag size={14} aria-hidden="true" /> Do batohu
                                        </button>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="flex-1 min-h-11 bg-fl-nav text-white hover:bg-fl-nav-hover border border-fl-nav-hover rounded-lg text-xs font-bold uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <ShoppingCart size={14} aria-hidden="true" /> Do košíku
                                        </button>
                                    </div>

                                    {isEquippable && equipItem && (
                                        <button
                                            onClick={() => equipItem(item)}
                                            className="w-full min-h-11 bg-fl-primary text-fl-bg hover:bg-fl-primary-hover rounded-lg text-xs font-bold uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <Shield size={14} aria-hidden="true" /> Koupit & Vybavit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredData.length === 0 && (
                    <div className="text-center py-12 px-4 text-fl-text-muted bg-fl-paper-bright rounded-lg border border-fl-paper">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" aria-hidden="true" />
                        <p className="font-bold text-fl-surface">Žádné předměty nenalezeny</p>
                        <p className="mt-1 text-sm">Zkuste upravit hledaný výraz nebo filtry.</p>
                        {(search || activeFilterCount > 0) && (
                            <button
                                type="button"
                                onClick={() => { setSearch(''); resetFilters(); }}
                                className="mt-4 min-h-11 rounded-full border border-fl-primary/40 px-5 text-xs font-bold uppercase tracking-wider text-fl-primary transition-colors hover:bg-fl-primary hover:text-white active:bg-fl-primary/80"
                            >
                                Vymazat hledání a filtry
                            </button>
                        )}
                    </div>
                )}
            </div>

            <CartPanel
                cart={cart}
                removeFromCart={removeFromCart}
                incrementCart={incrementCart}
                completelyRemoveCart={completelyRemoveCart}
                clearCart={clearCart}
                addItemToInventory={addItemToInventory}
            />
        </section>
    );
};

export default ZboziSection;
