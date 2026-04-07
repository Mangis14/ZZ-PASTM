import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import zboziGeneral from '../../data/zbozi_general.json';
import zboziMelee from '../../data/zbozi_weapons_melee.json';
import zboziRanged from '../../data/zbozi_weapons_ranged.json';
import zboziArmor from '../../data/zbozi_armor.json';
import zboziClothing from '../../data/zbozi_clothing.json';
import zboziMaterials from '../../data/zbozi_materials.json';
import zboziPotions from '../../data/zbozi_potions.json';
import zboziServices from '../../data/zbozi_services.json';

const allItems = [
    ...zboziGeneral, ...zboziMelee, ...zboziRanged, ...zboziArmor,
    ...zboziClothing, ...zboziMaterials, ...zboziPotions
];

const ItemAutocomplete = ({ value, onChange, onSelect, placeholder, className }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside); // Support touch
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInput = (e) => {
        const val = e.target.value;
        onChange(val);

        if (val.length > 1) {
            const filtered = allItems.filter(item =>
                item.Předmět && item.Předmět.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (item) => {
        onSelect(item);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                className={className}
                placeholder={placeholder}
                value={value}
                onChange={handleInput}
                onFocus={() => value.length > 1 && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[var(--fl-card)] border border-fl-primary/50 rounded shadow-lg z-[9999] max-h-48 overflow-y-auto w-full min-w-[200px]">
                    {suggestions.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-2 hover:bg-fl-primary hover:text-white cursor-pointer text-xs flex justify-between items-center border-b border-fl-border last:border-0"
                            onClick={() => handleSelect(item)}
                        >
                            <span className="font-bold">{item.Předmět}</span>
                            <span className="opacity-70 text-[9px]">{item.Váha !== '–' ? item.Váha : '0'}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemAutocomplete;
