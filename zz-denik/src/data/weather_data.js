
// Orsvärn Weather System v0.1.0 Constants and Data

export const SEASONS = {
    WINTER: {
        id: 'winter',
        label: 'Zima',
        baseTemp: 1,
        description: 'Grade 1 (-10°C / 14°F)'
    },
    SPRING_FALL: {
        id: 'spring_fall',
        label: 'Jaro / Podzim',
        baseTemp: 2, // "Springrise/Fallwane" -> 2, "Springwane/Fallrise" -> 3. Selecting 2 as base for simplicity, or we can split.
        // The PDF has:
        // Springrise/Fallwane: 2 (0°C)
        // Springwane/Fallrise: 3 (10°C)
        // Let's implement all 4 from the PDF to be precise.
    },
    SUMMER: {
        id: 'summer',
        label: 'Léto',
        baseTemp: 4,
        description: 'Grade 4 (20°C / 68°F)'
    }
};

export const SEASON_TYPES = [
    { id: 'winter', label: 'Zima', baseTemp: 1, desc: '-10°C' },
    { id: 'spring_rise', label: 'Jaro (Rané) / Podzim (Pozdní)', baseTemp: 2, desc: '0°C' },
    { id: 'spring_wane', label: 'Jaro (Pozdní) / Podzim (Raný)', baseTemp: 3, desc: '10°C' },
    { id: 'summer', label: 'Léto', baseTemp: 4, desc: '20°C' }
];

export const QUARTER_DAYS = [
    { id: 'morning', label: 'Ráno', isNight: false },
    { id: 'day', label: 'Den', isNight: false },
    { id: 'evening', label: 'Večer', isNight: false },
    { id: 'night', label: 'Noc', isNight: true } // -1 Temp modifier
];

export const TEMPERATURE_SCALE = {
    1: { c: -10, f: 14, label: 'Tuhý mráz', effect: 'COLD risk if not in camp' },
    2: { c: 0, f: 32, label: 'Mráz', effect: '' },
    3: { c: 10, f: 50, label: 'Chladno', effect: '' },
    4: { c: 20, f: 68, label: 'Příjemně', effect: '' },
    5: { c: 30, f: 86, label: 'Horko', effect: 'THIRSTY risk for hikers' },
    6: { c: 40, f: 104, label: 'Výhheň', effect: 'THIRSTY risk (Extreme)' } // Extrapolated
};

// D66 Table Structure: [Tens][Ones] -> result
// Or simple array lookup if we convert D66 to index, but map is better.
export const WEATHER_TABLE = {
    11: { sky: 'Jasno', wind: 'Bezvětří', tempMod: 1, windMod: 1, desc: '+1 Clear, +1 Calm, +1 High Temp' },
    12: { sky: 'Jasno', wind: 'Vánek', tempMod: 1, windMod: 0, desc: '+1 Clear, Breeze, +1 High Temp' },
    13: { sky: 'Jasno', wind: 'Vánek', tempMod: 1, windMod: 0, desc: '+1 Clear, Breeze, +1 High Temp' },
    14: { sky: 'Jasno', wind: 'Vichřice', tempMod: 0, windMod: -1, desc: '+1 Clear, -1 Gale, Mid Temp' },
    15: { sky: 'Jasno', wind: 'Vichřice', tempMod: 0, windMod: -1, desc: '+1 Clear, -1 Gale, Mid Temp' },
    16: { sky: 'Polojasno', wind: 'Bezvětří', tempMod: 1, windMod: 1, desc: 'Partly Cloudy, +1 Calm, +1 High Temp' },

    21: { sky: 'Polojasno', wind: 'Vánek', tempMod: 1, windMod: 0, desc: 'Partly Cloudy, Breeze, +1 High Temp' },
    22: { sky: 'Polojasno', wind: 'Vánek', tempMod: 1, windMod: 0, desc: 'Partly Cloudy, Breeze, +1 High Temp' },
    23: { sky: 'Polojasno', wind: 'Vánek', tempMod: 1, windMod: 0, desc: 'Partly Cloudy, Breeze, +1 High Temp' },
    24: { sky: 'Polojasno', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Partly Cloudy, Breeze, Mid Temp' },
    25: { sky: 'Polojasno', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Partly Cloudy, Breeze, Mid Temp' },
    26: { sky: 'Polojasno', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Partly Cloudy, Breeze, Mid Temp' },

    31: { sky: 'Polojasno', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Partly Cloudy, Breeze, Mid Temp' },
    32: { sky: 'Polojasno', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Partly Cloudy, Breeze, Mid Temp' },
    33: { sky: 'Polojasno', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Partly Cloudy, Breeze, Mid Temp' },
    34: { sky: 'Polojasno', wind: 'Vichřice', tempMod: 0, windMod: -1, desc: 'Partly Cloudy, -1 Gale, Mid Temp' },
    35: { sky: 'Polojasno', wind: 'Vichřice', tempMod: 0, windMod: -1, desc: 'Partly Cloudy, -1 Gale, Mid Temp' },
    36: { sky: 'Polojasno', wind: 'Vichřice', tempMod: 0, windMod: -1, desc: 'Partly Cloudy, -1 Gale, Mid Temp' },

    41: { sky: 'Polojasno', wind: 'Vichřice', tempMod: -1, windMod: -1, desc: 'Partly Cloudy, -1 Gale, -1 Low Temp' },
    42: { sky: 'Polojasno', wind: 'Vichřice', tempMod: -1, windMod: -1, desc: 'Partly Cloudy, -1 Gale, -1 Low Temp' },
    43: { sky: 'Zataženo', wind: 'Bezvětří', tempMod: 1, windMod: 1, desc: 'Cloudy, +1 Calm, +1 High Temp' },
    44: { sky: 'Zataženo', wind: 'Vánek', tempMod: 1, windMod: 0, desc: 'Cloudy, Breeze, +1 High Temp' },
    45: { sky: 'Zataženo', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Cloudy, Breeze, Mid Temp' },
    46: { sky: 'Zataženo', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Cloudy, Breeze, Mid Temp' },

    51: { sky: 'Zataženo', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Cloudy, Breeze, Mid Temp' },
    52: { sky: 'Zataženo', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Cloudy, Breeze, Mid Temp' },
    53: { sky: 'Zataženo', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Cloudy, Breeze, Mid Temp' },
    54: { sky: 'Zataženo', wind: 'Vánek', tempMod: 0, windMod: 0, desc: 'Cloudy, Breeze, Mid Temp' },
    55: { sky: 'Zataženo', wind: 'Vichřice', tempMod: 0, windMod: -1, desc: 'Cloudy, -1 Gale, Mid Temp' },
    56: { sky: 'Zataženo', wind: 'Vichřice', tempMod: -1, windMod: -1, desc: 'Cloudy, -1 Gale, -1 Low Temp' },

    61: { sky: 'Zataženo', wind: 'Vichřice', tempMod: -1, windMod: -1, desc: 'Cloudy, -1 Gale, -1 Low Temp' },
    62: { sky: 'Déšť', wind: 'Bezvětří', tempMod: -1, windMod: 1, desc: '-1 Rain, +1 Calm, -1 Low Temp' },
    63: { sky: 'Déšť', wind: 'Vánek', tempMod: -1, windMod: 0, desc: '-1 Rain, Breeze, -1 Low Temp' },
    64: { sky: 'Déšť', wind: 'Vánek', tempMod: -1, windMod: 0, desc: '-1 Rain, Breeze, -1 Low Temp' },
    65: { sky: 'Déšť', wind: 'Vichřice', tempMod: -1, windMod: -1, special: 'travel_check', desc: '-1 Rain, -1 Gale, -1 Low Temp, Travel Check' },
    66: { sky: 'Průtrž', wind: 'Bouře', tempMod: -1, windMod: -2, special: 'travel_check_hard', desc: '-2 Deluge, -2 Storm, -1 Low Temp, Travel Check -2' }
};

export const rollD66 = () => {
    const tens = Math.floor(Math.random() * 6) + 1;
    const ones = Math.floor(Math.random() * 6) + 1;
    return parseInt(`${tens}${ones}`);
};

export const rollD6 = () => Math.floor(Math.random() * 6) + 1;

