import fs from 'fs';
import path from 'path';

const inputDir = 'import_files';
const outputDir = 'src/data';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function csvToJson() {
    try {
        const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.csv'));

        files.forEach(file => {
            const filePath = path.join(inputDir, file);
            const csvData = fs.readFileSync(filePath, 'utf8');
            const lines = csvData.split('\n');

            if (lines.length === 0) return;

            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const result = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // Handle quotes in CSV
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

                const obj = {};
                headers.forEach((header, index) => {
                    let val = row[index] || "";
                    // Clean up quotes if they wrap the value
                    val = val.trim();
                    if (val.startsWith('"') && val.endsWith('"')) {
                        val = val.substring(1, val.length - 1);
                    }
                    // Replace double quotes with single quotes inside the string
                    val = val.replace(/""/g, '"');

                    obj[header] = val;

                    // Parse Price
                    if (header === 'Cena') {
                        obj.price = parsePrice(val);
                    }
                });

                result.push(obj);
            }

            const jsonFileName = file.replace('.csv', '.json');
            const jsonFilePath = path.join(outputDir, jsonFileName);

            fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, 2));
            console.log(`Converted ${file} to ${jsonFilePath} (${result.length} items)`);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

function parsePrice(priceStr) {
    if (!priceStr) return null;
    let cleanStr = priceStr.toLowerCase().replace(',', '.').trim();
    let value = parseFloat(cleanStr);

    if (isNaN(value)) return { value: 0, currency: 'silver', original: priceStr };

    let currency = 'silver';

    if (cleanStr.includes('zlať') || cleanStr.includes('gold')) {
        currency = 'gold';
    } else if (cleanStr.includes('měď') || cleanStr.includes('copper')) {
        currency = 'copper';
    } else {
        if (value < 1 && value > 0) {
            value = value * 10;
            currency = 'copper';
        } else if (value >= 10) {
            value = value / 10;
            currency = 'gold';
        }
    }

    // Round to avoid floating point errors
    value = Math.round(value * 100) / 100;

    return { value, currency };
}

csvToJson();
