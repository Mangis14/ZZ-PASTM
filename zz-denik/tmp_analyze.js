const fs = require('fs');
const glob = require('glob');

const files = fs.readdirSync('./src/data').filter(f => f.startsWith('zbozi_') && f.endsWith('.json'));
let weights = new Set();
let rarities = new Set();

files.forEach(f => {
    const data = JSON.parse(fs.readFileSync('./src/data/' + f, 'utf8'));
    data.forEach(item => {
        if (item['Váha']) weights.add((item['Váha']).trim());
        if (item['Dostupnost']) rarities.add((item['Dostupnost']).trim());
    });
});

console.log("Weights:", Array.from(weights));
console.log("Rarities:", Array.from(rarities));
