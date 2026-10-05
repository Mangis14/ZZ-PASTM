export const parseCombatValue = (value) => {
    const match = String(value ?? '').match(/-?\d+/);
    return match ? Number(match[0]) : 0;
};

export const calculateAttackDamage = ({
    successes,
    weaponDamage,
    pendingBonus = 0,
    berserkerBonus = 0
}) => {
    const safeSuccesses = Math.max(0, Number(successes) || 0);
    if (safeSuccesses < 1) return 0;
    return Math.max(
        0,
        parseCombatValue(weaponDamage)
            + Math.max(0, safeSuccesses - 1)
            + Math.max(0, Number(pendingBonus) || 0)
            + Math.max(0, Number(berserkerBonus) || 0)
    );
};

export const clearPreparedCombatEffects = (talentState = {}) => ({
    ...talentState,
    bonusCombatActions: 0,
    bonusCombatActionTalentId: '',
    extraAttackReady: false,
    ignoreArmorNextMelee: false,
    pendingAttackBonus: 0,
    pendingAttackBonusLabel: '',
    pendingAttackTalentId: '',
    lastAttackSummary: ''
});
