import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ShoppingBag, Hammer, Clock, Star, Shield, Zap, Sword, Crosshair, Shirt, FlaskConical, HandCoins, Circle } from 'lucide-react';
import Card from './components/common/Card';
import SectionHeader from './components/common/SectionHeader';

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

const ZboziSection = ({ addItemToInventory }) => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("Vše");
    const [talentFilter, setTalentFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

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

            // Talent Filter
            const matchesTalent = talentFilter === "All" || (item.Talent && item.Talent.includes(talentFilter));

            return matchesSearch && matchesTalent;
        });

        // Sort by Price
        data.sort((a, b) => {
            const valA = getCopperValue(a.price);
            const valB = getCopperValue(b.price);
            return sortOrder === "asc" ? valA - valB : valB - valA;
        });

        return data;
    }, [search, activeTab, talentFilter, sortOrder, dataMap]);

    return (
        <section id="zbozi-section" className="scroll-mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Zboží a Služby" icon={ShoppingBag} />

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setTalentFilter("All"); }}
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
                <div className="flex flex-col gap-4">
                    {/* Search and Sort */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fl-primary" size={18} />
                            <input
                                type="text"
                                placeholder="Hledat předmět, účinek, vlastnost..."
                                className="w-full pl-10 pr-4 py-2 bg-fl-paper-bright border border-fl-border rounded-sm focus:outline-none focus:border-fl-primary text-fl-surface"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                            className="px-4 py-2 bg-fl-paper text-fl-surface-hover font-bold uppercase text-xs tracking-wider rounded-sm hover:bg-fl-border flex items-center gap-2"
                        >
                            <ArrowUpDown size={16} />
                            Cena {sortOrder === "asc" ? "▲" : "▼"}
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold uppercase text-fl-primary mb-1">Talent</label>
                            <div className="relative">
                                <Star className="absolute left-2 top-1/2 -translate-y-1/2 text-fl-primary" size={14} />
                                <select
                                    className="w-full pl-8 pr-2 py-1 bg-fl-paper-bright border border-fl-border rounded-sm focus:outline-none focus:border-fl-primary text-sm text-fl-surface"
                                    value={talentFilter}
                                    onChange={(e) => setTalentFilter(e.target.value)}
                                >
                                    {talents.map(tal => <option key={tal} value={tal}>{tal}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="space-y-2">
                {filteredData.map((item, index) => (
                    <div key={index} className="bg-[var(--fl-card)] border border-fl-paper p-3 rounded-sm shadow-sm hover:border-fl-primary transition-colors group">
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
                            <div className="flex items-center gap-1 font-mono font-bold text-fl-surface-hover bg-fl-paper-light px-2 py-1 rounded text-sm border border-fl-paper">
                                {item.price ? (
                                    <>
                                        <span>{item.price.value}</span>
                                        <Circle
                                            size={10}
                                            className={`fill-current ${item.price.currency === 'gold' ? 'text-[#FFD700]' :
                                                item.price.currency === 'copper' ? 'text-[#9E6649]' :
                                                    'text-gray-400'
                                                }`}
                                        />
                                    </>
                                ) : (
                                    <span>{item.Cena}</span>
                                )}
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
                            className="w-full mt-3 py-3 bg-fl-primary text-white hover:bg-fl-primary-hover border border-fl-primary-hover rounded text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <ShoppingBag size={16} /> Přidat do batohu
                        </button>
                    </div>
                ))}

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-fl-primary italic bg-fl-paper-bright rounded border border-fl-paper">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Žádné předměty nenalezeny.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ZboziSection;
