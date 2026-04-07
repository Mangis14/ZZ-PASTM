import mammoth from 'mammoth';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const inputFile = "import_files/Zboží.docx";
const outputFile = "Zboží.csv";

async function convert() {
    try {
        const result = await mammoth.convertToHtml({ path: inputFile });
        const html = result.value;
        const $ = cheerio.load(html);

        let currentCategory = "";
        const allRows = [];
        const allHeaders = new Set();
        allHeaders.add("Category");

        // Iterate over top-level elements
        const elements = $('body').children();

        elements.each((i, el) => {
            const tagName = $(el).prop('tagName').toLowerCase();

            if (tagName === 'p') {
                const text = $(el).text().trim();
                if (text) {
                    currentCategory = text;
                }
            } else if (tagName === 'table') {
                // Parse table
                const rows = $(el).find('tr');
                let headers = [];

                rows.each((rowIndex, row) => {
                    const cells = $(row).find('td, th');

                    if (rowIndex === 0) {
                        // Header row
                        let colIndex = 0;
                        cells.each((cellIndex, cell) => {
                            let val = $(cell).text().trim();

                            // Normalize headers
                            const headerMap = {
                                "Oděv": "Předmět",
                                "Zbraň": "Předmět",
                                "Surovina": "Předmět",
                                "Služba": "Předmět",
                                "Vlasnosti": "Vlastnosti",
                                "Effekt": "Účinek",
                                "Efekt": "Účinek"
                            };

                            if (headerMap[val]) {
                                val = headerMap[val];
                            }

                            const colspan = parseInt($(cell).attr('colspan') || "1");

                            // Handle empty headers
                            let headerName = val;
                            if (!headerName) {
                                headerName = `Column_${colIndex + 1}`;
                            }

                            headers.push(headerName);
                            allHeaders.add(headerName);

                            for (let k = 1; k < colspan; k++) {
                                headers.push(`${headerName}_${k + 1}`);
                                allHeaders.add(`${headerName}_${k + 1}`);
                            }
                            colIndex += colspan;
                        });
                    } else {
                        // Data row
                        const rowData = {};
                        rowData['Category'] = currentCategory;

                        let colIndex = 0;
                        cells.each((cellIndex, cell) => {
                            const val = $(cell).text().trim();
                            const colspan = parseInt($(cell).attr('colspan') || "1");

                            if (colIndex < headers.length) {
                                rowData[headers[colIndex]] = val;
                            }

                            // If colspan, skip next headers
                            colIndex++;
                            for (let k = 1; k < colspan; k++) {
                                colIndex++;
                            }
                        });

                        // Only add row if it has some data
                        if (Object.keys(rowData).length > 1) { // >1 because Category is always there
                            allRows.push(rowData);
                        }
                    }
                });
            }
        });

        // Generate CSV
        const headerList = Array.from(allHeaders);
        // Ensure Category is first
        const categoryIndex = headerList.indexOf("Category");
        if (categoryIndex > -1) {
            headerList.splice(categoryIndex, 1);
            headerList.unshift("Category");
        }

        // Ensure Předmět is second if it exists
        const predmetIndex = headerList.indexOf("Předmět");
        if (predmetIndex > -1 && predmetIndex !== 1) {
            headerList.splice(predmetIndex, 1);
            headerList.splice(1, 0, "Předmět");
        }

        const csvRows = [];
        // Header
        csvRows.push(headerList.map(escapeCsv).join(','));

        // Data
        allRows.forEach(row => {
            const csvRow = headerList.map(header => {
                return escapeCsv(row[header] || "");
            });
            csvRows.push(csvRow.join(','));
        });

        fs.writeFileSync(outputFile, csvRows.join('\n'));
        console.log(`Successfully converted to ${outputFile}`);
        console.log(`Total rows: ${allRows.length}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

function escapeCsv(text) {
    if (text === null || text === undefined) return "";
    let stringText = String(text);
    // If contains quote, comma or newline, wrap in quotes and escape quotes
    if (stringText.includes('"') || stringText.includes(',') || stringText.includes('\n') || stringText.includes('\r')) {
        stringText = '"' + stringText.replace(/"/g, '""') + '"';
    }
    return stringText;
}

convert();
