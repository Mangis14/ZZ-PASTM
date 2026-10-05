export const copperToMoney = (copperTotal) => {
    const safeCopper = Math.max(0, Math.floor(Number(copperTotal) || 0));
    const gold = Math.floor(safeCopper / 100);
    const silver = Math.floor((safeCopper % 100) / 10);
    const copper = safeCopper % 10;
    return { gold, silver, copper };
};

export const calculateBargain = ({ totalCopper, spent, halfElf = false }) => {
    const safeTotal = Math.max(0, Math.floor(Number(totalCopper) || 0));
    const safeSpent = Math.max(0, Math.min(4, Math.floor(Number(spent) || 0)));
    const effectiveWillpower = safeSpent * (halfElf ? 2 : 1);
    const discountPercent = Math.min(80, effectiveWillpower * 20);
    const discountedCopper = Math.ceil(safeTotal * (100 - discountPercent) / 100);

    return {
        spent: safeSpent,
        effectiveWillpower,
        discountPercent,
        discountedCopper,
        savedCopper: safeTotal - discountedCopper
    };
};
