import fs from 'fs';
import path from 'path';

const inputFile = 'Zboží.csv';
const outputDir = 'import_files';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const categoryMap = {
    'Zboží': 'zbozi_general.csv',
    'Zbraně nablízko': 'zbozi_weapons_melee.csv',
    'Střelné zbraně': 'zbozi_weapons_ranged.csv',
    'Zbroj': 'zbozi_armor.csv',
    'Oblečení': 'zbozi_clothing.csv',
    'Suroviny': 'zbozi_materials.csv',
    'Lektvary': 'zbozi_potions.csv',
    'Služby': 'zbozi_services.csv'
};

function splitCsv() {
    try {
        const data = fs.readFileSync(inputFile, 'utf8');
        const lines = data.split('\n');

        if (lines.length === 0) return;

        const headers = lines[0].trim().split(',');
        const categorizedData = {};

        // Initialize arrays for each category
        Object.keys(categoryMap).forEach(cat => {
            categorizedData[cat] = [];
        });

        // Parse data
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple CSV parser that handles quotes
            const row = [];
            let inQuote = false;
            let currentCell = "";

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    if (j + 1 < line.length && line[j + 1] === '"') {
                        currentCell += '"';
                        j++;
                    } else {
                        inQuote = !inQuote;
                    }
                } else if (char === ',' && !inQuote) {
                    row.push(currentCell);
                    currentCell = "";
                } else {
                    currentCell += char;
                }
            }
            row.push(currentCell);

            const category = row[0]; // First column is Category
            if (categorizedData[category]) {
                categorizedData[category].push(row);
            }
        }

        // Write files
        Object.entries(categorizedData).forEach(([category, rows]) => {
            if (rows.length === 0) return;

            const filename = categoryMap[category];
            const filePath = path.join(outputDir, filename);

            // Determine which columns are not empty for this category
            const activeIndices = new Set();
            // Always keep Category (0) and Item Name (1)
            activeIndices.add(0);
            activeIndices.add(1);

            rows.forEach(row => {
                row.forEach((cell, index) => {
                    if (cell && cell.trim() !== '' && cell.trim() !== '–') {
                        activeIndices.add(index);
                    }
                });
            });

            const sortedIndices = Array.from(activeIndices).sort((a, b) => a - b);

            // Filter headers
            const filteredHeaders = sortedIndices.map(i => headers[i]);

            // Filter rows
            const filteredRows = rows.map(row => {
                return sortedIndices.map(i => {
                    let cell = row[i] || "";
                    // Re-quote if needed
                    if (cell.includes(',') || cell.includes('"')) {
                        return `"${cell.replace(/"/g, '""')}"`;
                    }
                    return cell;
                }).join(',');
            });

            const fileContent = [filteredHeaders.join(','), ...filteredRows].join('\n');
            fs.writeFileSync(filePath, fileContent);
            console.log(`Created ${filename} with ${rows.length} items.`);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

splitCsv();
