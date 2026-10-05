export const POISON_TYPES = [
    { id: 'deadly', label: 'Smrtelný jed' },
    { id: 'paralyzing', label: 'Ochromující jed' },
    { id: 'sleeping', label: 'Uspávací jed' },
    { id: 'hallucinogenic', label: 'Halucinogenní jed' }
];

export const getPoisonType = (id) => (
    POISON_TYPES.find(poison => poison.id === id) || POISON_TYPES[0]
);

export const createPoisonInventoryItem = ({ type, potency, quickApply = false }) => {
    const poison = getPoisonType(type);
    const safePotency = Math.max(1, Number(potency) || 1);
    return {
        name: `${poison.label} (účinnost ${safePotency}${quickApply ? ', nanesení bez akce' : ''})`,
        weight: 0
    };
};
