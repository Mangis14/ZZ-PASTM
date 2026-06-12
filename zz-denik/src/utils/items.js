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
