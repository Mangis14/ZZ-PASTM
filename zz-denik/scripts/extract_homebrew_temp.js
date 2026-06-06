import mammoth from 'mammoth';
import fs from 'fs';

const docxPath = './import_files/Pravidla - homebrew změny (reforged) (1).docx';
const outputPath = './import_files/homebrew_rules.txt';
const htmlOutputPath = './import_files/homebrew_rules.html';

async function run() {
    try {
        const textResult = await mammoth.extractRawText({ path: docxPath });
        fs.writeFileSync(outputPath, textResult.value, 'utf-8');
        console.log('Successfully extracted raw text to homebrew_rules.txt');

        const htmlResult = await mammoth.convertToHtml({ path: docxPath });
        fs.writeFileSync(htmlOutputPath, htmlResult.value, 'utf-8');
        console.log('Successfully extracted HTML to homebrew_rules.html');
    } catch (err) {
        console.error(err);
    }
}

run();
