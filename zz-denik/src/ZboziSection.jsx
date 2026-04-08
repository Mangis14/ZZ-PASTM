import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ShoppingBag, ShoppingCart, Hammer, Clock, Star, Shield, Zap, Sword, Crosshair, Shirt, FlaskConical, HandCoins, Circle, X, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './components/common/Card';
import SectionHeader from './components/common/SectionHeader';
import MoneyInput from './components/common/MoneyInput';

// Import data files
import zboziGeneral from './data/zbozi_general.json';
import zboziMelee from './data/zbozi_weapons_melee.json';
import zboziRanged from './data/zbozi_weapons_ranged.json';
import zboziArmor from './data/zbozi_armor.json';
import zboziClothing from './data/zbozi_clothing.json';
import zboziMaterials from './data/zbozi_materials.json';
import zboziPotions from './data/zbozi_potions.json';
import zboziServices from './data/zbozi_services.json';

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
                        className={`fill-current ${price.currency === 'gold' ? 'text-[#FFD700]' :
                            price.currency === 'copper' ? 'text-[#9E6649]' :
                                'text-gray-400'
                            }`}
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

    const totalCopper = useMemo(() => {
        return cart.reduce((sum, item) => sum + getCopperValue(item.price) * item.qty, 0);
    }, [cart]);

    const totalPrice = formatPrice(totalCopper);
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const handleCheckout = () => {
        // Add all items to inventory
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
    };

    if (cart.length === 0) return null;

    return (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 max-w-3xl mx-auto">
            {/* Cart Summary Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-fl-nav text-white py-3 px-4 rounded-lg shadow-xl border border-fl-primary flex items-center justify-between hover:bg-fl-nav-hover transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-fl-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        </div>
                        <span className="font-bold uppercase text-sm tracking-wider">Košík</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PriceDisplay price={totalPrice} size="lg" />
                        <ChevronUp size={18} />
                    </div>
                </button>
            )}

            {/* Expanded Cart */}
            {isOpen && (
                <div className="bg-fl-card border border-fl-primary rounded-lg shadow-2xl overflow-hidden animate-slide-in-left">
                    {/* Cart Header */}
                    <div className="bg-fl-nav p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <ShoppingCart size={20} />
                            <span className="font-bold uppercase text-sm tracking-wider">Košík ({itemCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={clearCart} className="text-red-400 hover:text-red-300 p-1" title="Vysypat košík">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-white hover:text-fl-primary p-1">
                                <ChevronDown size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="max-h-48 overflow-y-auto p-3 space-y-2">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-fl-paper-bright p-2 rounded border border-fl-paper text-sm">
                                <div className="flex-1 min-w-0">
                                    <span className="font-bold text-fl-surface truncate block">{item.Předmět}</span>
                                    <span className="text-[10px] text-fl-text-muted">
                                        {item.qty > 1 ? `${item.qty}× ` : ''}
                                        <PriceDisplay price={item.price} cena={item.Cena} />
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 ml-2">
                                    <div className="flex items-center bg-fl-paper-light rounded border border-fl-border">
                                        <button onClick={() => removeFromCart(idx)} className="w-5 h-5 flex items-center justify-center text-fl-primary hover:bg-fl-primary hover:text-white transition-colors">-</button>
                                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                                        <button onClick={() => incrementCart(idx)} className="w-5 h-5 flex items-center justify-center text-fl-primary hover:bg-fl-primary hover:text-white transition-colors">+</button>
                                    </div>
                                    <div className="text-right flex items-center gap-2">
                                        <PriceDisplay price={item.price ? { ...item.price, value: item.price.value * item.qty } : null} cena={item.Cena} />
                                        <button onClick={() => completelyRemoveCart(idx)} className="text-red-500 hover:text-red-700 p-1">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Area */}
                    <div className="p-3 border-t border-fl-paper space-y-3">
                        {/* Default Total */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-fl-text-muted font-bold uppercase text-xs">Katalogová cena:</span>
                            <div className="bg-fl-paper-light px-3 py-1 rounded border border-fl-paper">
                                <PriceDisplay price={totalPrice} size="lg" />
                            </div>
                        </div>

                        {/* Agreed Price */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-fl-text-muted font-bold uppercase">Dohodnutá cena:</label>
                            <MoneyInput money={agreedPrice} onChange={setAgreedPrice} />
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-3 bg-green-700 dark:bg-green-800 text-white hover:bg-green-800 dark:hover:bg-green-700 rounded font-bold uppercase text-sm tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                        >
                            <Check size={18} />
                            Přidat vše do batohu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ZboziSection = ({ addItemToInventory }) => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("Vše");
    const [talentFilter, setTalentFilter] = useState("All");
    const [materialFilter, setMaterialFilter] = useState("All");
    const [weightFilter, setWeightFilter] = useState("All");
    const [rarityFilter, setRarityFilter] = useState("All");
    const [zbrojFilter, setZbrojFilter] = useState("All");
    const [damageFilter, setDamageFilter] = useState("All");
    const [timeFilter, setTimeFilter] = useState("All");
    const [handsFilter, setHandsFilter] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState("asc");
    const [cart, setCart] = useState([]);

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

    // Data mapping
    const dataMap = useMemo(() => ({
        "Vše": [
            ...zboziGeneral, ...zboziMelee, ...zboziRanged, ...zboziArmor,
            ...zboziClothing, ...zboziMaterials, ...zboziPotions, ...zboziServices
        ],
        "Zboží": zboziGeneral,
        "Zbraně nablízko": zboziMelee,
        "Střelné zbraně": zboziRanged,
        "Zbroj": zboziArmor,
        "Oblečení": zboziClothing,
        "Suroviny": zboziMaterials,
        "Lektvary": zboziPotions,
        "Služby": zboziServices
    }), []);

    const tabs = [
        { id: "Vše", icon: ShoppingBag },
        { id: "Zboží", icon: ShoppingBag },
        { id: "Zbraně nablízko", icon: Sword },
        { id: "Střelné zbraně", icon: Crosshair },
        { id: "Zbroj", icon: Shield },
        { id: "Oblečení", icon: Shirt },
        { id: "Suroviny", icon: Hammer },
        { id: "Lektvary", icon: FlaskConical },
        { id: "Služby", icon: HandCoins },
    ];

    // Extract unique talents for filters based on current tab
    const talents = useMemo(() => {
        const currentData = dataMap[activeTab] || [];
        const tals = new Set(currentData.map(item => item.Talent).filter(Boolean).filter(t => t !== "–"));
        return ["All", ...Array.from(tals).sort()];
    }, [activeTab, dataMap]);

    // Extract basic materials categories
    const materials = useMemo(() => {
        const mats = new Set();
        const currentData = dataMap[activeTab] || [];
        currentData.forEach(item => {
            if (item.Suroviny && item.Suroviny !== "–") {
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
        return ["All", ...Array.from(mats).sort()];
    }, [activeTab, dataMap]);

    const weights = useMemo(() => {
        const currentData = dataMap[activeTab] || [];
        const wghts = new Set(currentData.map(item => item.Váha).filter(Boolean).filter(t => t !== "–" && t !== "-"));
        return ["All", ...Array.from(wghts).sort((a,b) => {
            const getRank = (s) => {
                const l = s.toLowerCase();
                if (l.includes('drobn')) return 1;
                if (l.includes('lehk')) return 2;
                if (l.includes('norm')) return 3;
                if (l.includes('těžk')) return 4;
                return 5;
            }
            return getRank(a) - getRank(b);
        })];
    }, [activeTab, dataMap]);

    const rarities = useMemo(() => {
        const currentData = dataMap[activeTab] || [];
        const rars = new Set(currentData.map(item => item.Dostupnost).filter(Boolean).filter(t => t !== "–" && t !== "-"));
        return ["All", ...Array.from(rars).sort((a,b) => {
            const getRank = (str) => {
                const s = str.toLowerCase();
                 if (s.includes('běžn')) return 1;
                 if (s.includes('neobvyk')) return 2;
                 if (s.includes('vzácn')) return 3;
                 return 0;
            }
            return getRank(a) - getRank(b);
        })];
    }, [activeTab, dataMap]);

    const zbrojValues = useMemo(() => {
        const currentData = dataMap[activeTab] || [];
        const vals = new Set(currentData.map(item => item.Zbroj).filter(Boolean).filter(t => t !== "–" && t !== "-"));
        return ["All", ...Array.from(vals).sort((a,b) => parseInt(a) - parseInt(b))];
    }, [activeTab, dataMap]);

    const damages = useMemo(() => {
        const currentData = dataMap[activeTab] || [];
        const vals = new Set(currentData.map(item => item.Zranění).filter(Boolean).filter(t => t !== "–" && t !== "-"));
        return ["All", ...Array.from(vals).sort((a,b) => parseInt(a) - parseInt(b))];
    }, [activeTab, dataMap]);

    const hands = useMemo(() => {
        const currentData = dataMap[activeTab] || [];
        const vals = new Set(currentData.map(item => item.Ruce).filter(Boolean).filter(t => t !== "–" && t !== "-"));
        return ["All", ...Array.from(vals).sort()];
    }, [activeTab, dataMap]);

    const times = useMemo(() => {
        const currentData = dataMap[activeTab] || [];
        const tms = new Set(currentData.map(item => item.Čas).filter(Boolean).filter(t => t !== "–" && t !== "-"));
        return ["All", ...Array.from(tms).sort((a,b) => {
            const getRank = (str) => {
                const s = String(str).toLowerCase();
                if (s.includes('čtvrt')) return 1;
                if (s.includes('den') || s.includes('dny')) return 2;
                if (s.includes('týden') || s.includes('týdny')) return 3;
                return 4;
            }
            return getRank(a) - getRank(b);
        })];
    }, [activeTab, dataMap]);

    // Filter and Sort Data
    const filteredData = useMemo(() => {
        let data = dataMap[activeTab] || [];

        data = data.filter(item => {
            // Filter out header rows if any remain
            if (item.Předmět === "Předmět") return false;

            // Search
            const searchLower = search.toLowerCase();
            const matchesSearch =
                (item.Předmět && item.Předmět.toLowerCase().includes(searchLower)) ||
                (item.Účinek && item.Účinek.toLowerCase().includes(searchLower)) ||
                (item.Vlastnosti && item.Vlastnosti.toLowerCase().includes(searchLower)) ||
                (item.Poznámky && item.Poznámky.toLowerCase().includes(searchLower));

            // All Filters combined
            const matchesTalent = talentFilter === "All" || (item.Talent && item.Talent.includes(talentFilter));
            const matchesWeight = weightFilter === "All" || (item.Váha && item.Váha === weightFilter);
            const matchesRarity = rarityFilter === "All" || (item.Dostupnost && item.Dostupnost === rarityFilter);
            const matchesZbroj = zbrojFilter === "All" || (item.Zbroj && item.Zbroj === zbrojFilter);
            const matchesDamage = damageFilter === "All" || (item.Zranění && item.Zranění === damageFilter);
            const matchesHands = handsFilter === "All" || (item.Ruce && item.Ruce === handsFilter);
            const matchesTime = timeFilter === "All" || (item.Čas && item.Čas === timeFilter);
            
            let matchesMaterial = true;
            if (materialFilter !== "All") {
                const s = (item.Suroviny || "").toLowerCase();
                if (materialFilter === 'Železo/Ocel') matchesMaterial = s.includes('želez') || s.includes('ocel');
                else if (materialFilter === 'Dřevo') matchesMaterial = s.includes('dřev');
                else if (materialFilter === 'Kůže/Useň') matchesMaterial = s.includes('usn') || s.includes('kůž');
                else if (materialFilter === 'Látka/Příze') matchesMaterial = s.includes('látk') || s.includes('příz');
                else if (materialFilter === 'Zlato') matchesMaterial = s.includes('zlat');
                else if (materialFilter === 'Stříbro') matchesMaterial = s.includes('stříb');
                else if (materialFilter === 'Byliny') matchesMaterial = s.includes('bylin') || s.includes('rostlin');
                else if (materialFilter === 'Kámen/Písek') matchesMaterial = s.includes('kám') || s.includes('kamen') || s.includes('písek');
                else if (materialFilter === 'Živočišná (maso/kosti)') matchesMaterial = s.includes('maso') || s.includes('tuk') || s.includes('kost') || s.includes('roh');
                else matchesMaterial = false;
            }

            return matchesSearch && matchesTalent && matchesWeight && matchesRarity && matchesMaterial &&
                   matchesZbroj && matchesDamage && matchesHands && matchesTime;
        });

        // Sort by Price
        data.sort((a, b) => {
            const valA = getCopperValue(a.price);
            const valB = getCopperValue(b.price);
            return sortOrder === "asc" ? valA - valB : valB - valA;
        });

        return data;
    }, [search, activeTab, talentFilter, sortOrder, materialFilter, weightFilter, rarityFilter, zbrojFilter, damageFilter, handsFilter, timeFilter, dataMap]);

    return (
        <section id="zbozi-section" className="scroll-mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Zboží a Služby" icon={ShoppingBag} />

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { 
                            setActiveTab(tab.id); 
                            setTalentFilter("All");
                            setMaterialFilter("All");
                            setWeightFilter("All");
                            setRarityFilter("All");
                            setZbrojFilter("All");
                            setDamageFilter("All");
                            setHandsFilter("All");
                            setTimeFilter("All");
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all
                            ${activeTab === tab.id
                                ? 'bg-fl-primary text-white shadow-md scale-105'
                                : 'bg-fl-paper text-fl-text-muted hover:bg-fl-border hover:text-fl-surface'}`}
                    >
                        <tab.icon size={14} />
                        {tab.id}
                    </button>
                ))}
            </div>

            <Card className="mb-6">
                <div className="flex flex-col gap-3">
                    {/* Search and Buttons */}
                    <div className="flex gap-2 h-10">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={16} />
                            <input
                                type="text"
                                placeholder="Hledat předmět, účinek..."
                                className="w-full h-full pl-9 pr-3 bg-fl-paper-bright border border-fl-border rounded-sm focus:outline-none focus:border-fl-primary text-fl-surface text-sm placeholder:text-fl-border"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                            className="px-3 border border-fl-border rounded-sm text-fl-surface-hover hover:bg-fl-border hover:text-fl-surface transition-colors flex items-center justify-center gap-1 font-bold text-xs uppercase tracking-wider min-w-[70px]"
                            title="Řadit podle ceny"
                        >
                            <ArrowUpDown size={14} />
                            <span className="hidden sm:inline">Cena</span> {sortOrder === "asc" ? "▲" : "▼"}
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`relative px-3 border rounded-sm flex items-center justify-center transition-colors shadow-sm ${
                                showFilters || talentFilter !== "All" || materialFilter !== "All" || weightFilter !== "All" || rarityFilter !== "All" 
                                    ? 'bg-fl-primary text-white border-fl-primary' 
                                    : 'bg-fl-paper text-fl-surface hover:bg-fl-border border-fl-border'
                            }`}
                            title="Podrobné filtrování"
                        >
                            <Filter size={16} />
                            {(talentFilter !== "All" || materialFilter !== "All" || weightFilter !== "All" || rarityFilter !== "All" || zbrojFilter !== "All" || damageFilter !== "All" || handsFilter !== "All" || timeFilter !== "All") && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-600 border border-white text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">!</span>
                            )}
                        </button>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 mt-1 border-t border-fl-paper animate-in fade-in slide-in-from-top-2 duration-200">
                            {[
                                { label: 'Talent', icon: Star, value: talentFilter, setter: setTalentFilter, options: talents },
                                { label: 'Suroviny', icon: Hammer, value: materialFilter, setter: setMaterialFilter, options: materials },
                                { label: 'Váha', icon: Shield, value: weightFilter, setter: setWeightFilter, options: weights },
                                { label: 'Dostupnost', icon: Clock, value: rarityFilter, setter: setRarityFilter, options: rarities },
                                { label: 'Zbroj', icon: Shield, value: zbrojFilter, setter: setZbrojFilter, options: zbrojValues },
                                { label: 'Zranění', icon: Sword, value: damageFilter, setter: setDamageFilter, options: damages },
                                { label: 'Výroba (Čas)', icon: Clock, value: timeFilter, setter: setTimeFilter, options: times },
                                { label: 'Ruce', icon: HandCoins, value: handsFilter, setter: setHandsFilter, options: hands }
                            ].filter(f => f.options && f.options.length > 1).map(filter => (
                                <div key={filter.label} className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase text-fl-primary">{filter.label}</label>
                                    <div className="relative">
                                        <filter.icon className="absolute left-2 top-1/2 -translate-y-1/2 text-fl-primary" size={12} />
                                        <select
                                            className="w-full pl-6 pr-2 py-1.5 bg-fl-paper-bright border border-fl-border rounded-sm focus:outline-none focus:border-fl-primary text-xs text-fl-surface appearance-none"
                                            value={filter.value}
                                            onChange={(e) => filter.setter(e.target.value)}
                                        >
                                            {filter.options.map(opt => <option key={opt} value={opt}>{opt === "All" ? "Vše" : opt}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <div className="space-y-2">
                {filteredData.map((item, index) => (
                    <div key={index} className="bg-fl-card border border-fl-paper p-3 rounded-sm shadow-sm hover:border-fl-primary transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-fl-surface text-lg">{item.Předmět}</h3>
                                <div className="text-[10px] uppercase text-fl-primary tracking-wide flex flex-wrap gap-2 items-center mt-1">
                                    <span className="bg-fl-paper-light px-1.5 py-0.5 rounded">{item.Category}</span>
                                    {item.Dostupnost && <span>• {item.Dostupnost}</span>}
                                    {item.Váha && item.Váha !== "–" && <span>• Váha: {item.Váha}</span>}
                                    {item.Ruce && <span>• Ruce: {item.Ruce}</span>}
                                </div>
                            </div>
                            <div className="bg-fl-paper-light px-2 py-1 rounded text-sm border border-fl-paper">
                                <PriceDisplay price={item.price} cena={item.Cena} />
                            </div>
                        </div>

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
                            {item.Talent && item.Talent !== "–" && (
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
                        </div>

                        {(item.Účinek || item.Vlastnosti || item.Poznámky || item.Efekt) && (
                            <div className="mt-2 pt-2 border-t border-fl-paper-light text-xs text-fl-surface-hover italic bg-fl-paper-bright p-2 rounded">
                                {item.Účinek && <div className="mb-1"><span className="font-bold not-italic text-fl-primary">Účinek:</span> {item.Účinek}</div>}
                                {item.Vlastnosti && <div className="mb-1"><span className="font-bold not-italic text-fl-primary">Vlastnosti:</span> {item.Vlastnosti}</div>}
                                {item.Poznámky && <div className="mb-1"><span className="font-bold not-italic text-fl-primary">Poznámky:</span> {item.Poznámky}</div>}
                                {item.Efekt && <div><span className="font-bold not-italic text-fl-primary">Efekt:</span> {item.Efekt}</div>}
                            </div>
                        )}

                        {/* Two action buttons */}
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (addItemToInventory) {
                                        addItemToInventory({
                                            name: item.Předmět,
                                            weight: parseWeight(item.Váha)
                                        });
                                    }
                                }}
                                className="flex-1 py-2.5 bg-fl-primary text-white hover:bg-fl-primary-hover border border-fl-primary-hover rounded text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <ShoppingBag size={14} /> Do batohu
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(item);
                                }}
                                className="flex-1 py-2.5 bg-fl-nav dark:bg-fl-nav text-white hover:bg-fl-nav-hover border border-fl-nav-hover rounded text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <ShoppingCart size={14} /> Do košíku
                            </button>
                        </div>
                    </div>
                ))}

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-fl-primary italic bg-fl-paper-bright rounded border border-fl-paper">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Žádné předměty nenalezeny.</p>
                    </div>
                )}
            </div>

            {/* Cart Panel */}
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
