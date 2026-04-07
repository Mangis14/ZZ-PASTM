import React from 'react';

const WeightSelect = ({ value, onChange }) => (
    <select
        className="text-xs bg-transparent border-b border-transparent hover:border-fl-primary/50 focus:border-fl-primary focus:outline-none text-fl-text-muted focus:text-fl-surface cursor-pointer text-right w-14 py-1 transition-colors"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
    >
        <option value={0}>0</option>
        <option value={0.5}>0.5</option>
        <option value={1}>1.0</option>
        <option value={2}>2.0</option>
    </select>
);

export default WeightSelect;
