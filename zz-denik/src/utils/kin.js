import { KIN_TALENT_BY_KIN, KIN_TALENTS } from '../data/kin_talents';
import { confirmAction } from '../components/common/ConfirmDialog';

const normalize = (value) => String(value || '')
    .toLocaleLowerCase('cs-CZ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s-]+/g, '');

// Rod je v deníku volný text – přijímáme i ženské tvary, slovenštinu a angličtinu.
const KIN_ALIASES = {
    'Člověk': ['clovek', 'lide', 'human'],
    'Elf': ['elf', 'elfka', 'elfove'],
    'Trpaslík': ['trpaslik', 'trpaslice', 'trpaslicka', 'dwarf'],
    'Půlelf': ['pulelf', 'pulelfka', 'poloelf', 'poloelfka', 'halfelf'],
    'Půlčík': ['pulcik', 'pulcice', 'polocik', 'halfling'],
    'Vlken': ['vlken', 'vlkenka', 'wolfkin'],
    'Ork': ['ork', 'orcice', 'orkyne', 'orc'],
    'Skřet': ['skret', 'skretice', 'goblin']
};

// Vrátí kanonický název rodu („Půlelf“), nebo null, když text žádnému rodu neodpovídá.
export const resolveKin = (kinText) => {
    const kin = normalize(kinText);
    if (!kin) return null;
    return Object.keys(KIN_ALIASES).find(key => KIN_ALIASES[key].includes(kin)) || null;
};

export const getKinTalent = (kinText) => {
    const kin = resolveKin(kinText);
    return kin ? KIN_TALENT_BY_KIN[kin] : null;
};

/* Postava má mít rodový talent svého rodu. Automaticky přidaný talent nese
   `autoKin`, aby se při změně rodu dal zase odebrat; ručně přidané rodové
   talenty jiných rodů zůstávají. Vrací stejné pole, když se nic nemění. */
export const syncKinTalents = (char) => {
    const talents = Array.isArray(char?.talents) ? char.talents : [];
    const kinTalent = getKinTalent(char?.kin);
    let changed = false;

    const next = talents.flatMap(talent => {
        if (kinTalent && talent?.id === kinTalent.id) {
            if (talent.autoKin) return [talent];
            changed = true;
            return [{ ...talent, autoKin: true }];
        }
        if (talent?.autoKin) {
            changed = true;
            return [];
        }
        return [talent];
    });

    if (kinTalent && !next.some(talent => talent?.id === kinTalent.id)) {
        changed = true;
        next.push({
            id: kinTalent.id,
            name: kinTalent.name,
            rank: 1,
            description: kinTalent.ranks[0].description,
            profession: '',
            autoKin: true
        });
    }

    return changed ? next : talents;
};

// Před ručním přidáním rodového talentu jiného rodu se zeptáme, jestli je to záměr.
export const confirmKinTalent = async (char, talent) => {
    const kinTalent = KIN_TALENTS.find(item => item.id === talent?.id);
    if (!kinTalent || resolveKin(char?.kin) === kinTalent.kin) return true;

    const kinLabel = String(char?.kin || '').trim();
    return confirmAction({
        title: 'Rod se neshoduje',
        message: `${kinTalent.name} je rodový talent pro rod ${kinTalent.kin}, ale tvoje postava ${kinLabel ? `je ${kinLabel}` : 'nemá vyplněný rod'}. Jsi si jistý, že ho chceš přidat?`,
        confirmLabel: 'Přidat',
        cancelLabel: 'Zrušit'
    });
};

/* Půlelf má rodový talent Duševní síla (Psychic Power, Průvodce hráče str. 62): při utracení bodů vůle
   na talent nebo kouzlo se první bod počítá za dva (2 body za tři atd.). */
export const hasPsychicPower = (char) => {
    if (resolveKin(char?.kin) === 'Půlelf') return true;
    return (Array.isArray(char?.talents) ? char.talents : []).some(talent =>
        talent.id === 'magicka_sila' || ['dusevnisila', 'magickasila'].includes(normalize(talent.name))
    );
};

// Kolik bodů vůle se započítá při utracení `spent` bodů.
export const effectiveWillpower = (spent, psychicPower) => (
    psychicPower && spent > 0 ? spent + 1 : spent
);
