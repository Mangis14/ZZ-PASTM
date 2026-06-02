import React, { useEffect, useRef, useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';

const ItemAutocomplete = ({ value, onChange, onSelect, placeholder, className }) => {
    const { allItems } = useCatalog();
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const handleInput = (event) => {
        const nextValue = event.target.value;
        onChange(nextValue);

        if (nextValue.length > 1) {
            const lowerValue = nextValue.toLowerCase();
            const filtered = allItems
                .filter(item =>
                    item.Category !== 'Služby' &&
                    item.Předmět &&
                    item.Předmět.toLowerCase().includes(lowerValue)
                )
                .slice(0, 5);
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
                <div className="absolute left-0 right-0 top-full mt-1 bg-fl-card border border-fl-primary/50 rounded shadow-lg z-[9999] max-h-48 overflow-y-auto w-full min-w-[200px]">
                    {suggestions.map((item, index) => (
                        <div
                            key={`${item.Předmět}-${index}`}
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
