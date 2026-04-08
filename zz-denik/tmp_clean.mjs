import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const files = fs.readdirSync('./src/data').filter(f => f.startsWith('zbozi_') && f.endsWith('.json'));

const cleanWeight = (w) => {
    if (!w) return "–";
    w = String(w).toLowerCase().trim();
    if (w.includes('drobn')) return "Drobná";
    if (w.includes('lehk')) return "Lehká";
    if (w.includes('norm')) return "Normální";
    if (w.includes('těžk') || w.includes('tezka')) return "Těžká";
    return "–";
};

const cleanRarity = (r) => {
    if (!r) return "–";
    r = String(r).toLowerCase().trim();
    if (r.includes('běžn') || r.includes('běžk') || r.includes('bezn')) return "Běžná";
    if (r.includes('neobvykl')) return "Neobvyklá";
    if (r.includes('vzácn') || r.includes('vzacn')) return "Vzácná";
    if (r.includes('epick')) return "Epická";
    return "–";
};

files.forEach(f => {
    const filePath = './src/data/' + f;
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove headers
    data = data.filter(item => item.Předmět && item.Předmět.toLowerCase() !== 'předmět');

    data = data.map(item => {
        item.Váha = cleanWeight(item.Váha);
        item.Dostupnost = cleanRarity(item.Dostupnost);
        
        return item;
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Cleaned ${f}`);
});
