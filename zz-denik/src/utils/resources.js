export const SUPPLY_DICE = [0, 'K6', 'K8', 'K10', 'K12'];

export const adjustSupply = (value, steps) => {
    const currentIndex = Math.max(0, SUPPLY_DICE.indexOf(value));
    const nextIndex = Math.max(0, Math.min(SUPPLY_DICE.length - 1, currentIndex + steps));
    return SUPPLY_DICE[nextIndex];
};
