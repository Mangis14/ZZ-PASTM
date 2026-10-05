/* Prevod textovej váhy z katalógu („lehká", „1/2", „těžká"…) na číslo
   pre výpočet zaťaženia. Žije mimo ZboziSection, aby denník (inventár,
   zvieratá) nezaťahoval celú sekciu Zboží do hlavného bundle. */
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

/* Číselná hodnota výbavy („+2“, „6“) – null, když to číslo není (např. „+X“). */
export const parseGearValue = (value) => {
    const text = String(value ?? '').trim();
    if (!text) return null;
    const match = text.match(/^[+]?(-?\d+)$/);
    return match ? Number(match[1]) : null;
};

/* Dosah zbraně z katalogu: střelné zbraně mají „max střední vzdálenost“,
   zbraně nablízko „2 (krátká)“ ve sloupci Ruce, jinak dosah paže. */
export const getWeaponRange = (item) => {
    const properties = String(item?.Vlastnosti || '').toLowerCase();
    const maxRange = properties.match(/max\.?\s+(\S+)\s+vzd/);
    if (maxRange) return maxRange[1].charAt(0).toUpperCase() + maxRange[1].slice(1);
    const handsRange = String(item?.Ruce || '').match(/\((.*?)\)/)?.[1];
    if (handsRange) return handsRange.charAt(0).toUpperCase() + handsRange.slice(1);
    return item?.Category === 'Střelné zbraně' ? 'Krátká' : 'Paže';
};

/* Stohování v inventáři: jeden slot unese nejvýš zátěž 2 (např. 4× lehká,
   2× normální, 1× těžká); drobné předměty bez zátěže max. 20 kusů. */
export const MAX_STACK_WEIGHT = 2;
export const MAX_TINY_STACK = 20;

export const itemQty = (item) => Math.max(1, Math.floor(Number(item?.qty) || 1));

export const maxStack = (weight) => {
    const unit = Number(weight) || 0;
    return unit > 0 ? Math.max(1, Math.floor(MAX_STACK_WEIGHT / unit)) : MAX_TINY_STACK;
};

export const stackWeight = (item) => (item?.name?.trim() ? (Number(item.weight) || 0) * itemQty(item) : 0);
