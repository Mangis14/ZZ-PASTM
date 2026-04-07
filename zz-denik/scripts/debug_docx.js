import mammoth from 'mammoth';
import fs from 'fs';

mammoth.convertToHtml({ path: "import_files/Zboží.docx" })
    .then(function (result) {
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        fs.writeFileSync('debug.html', html);
        console.log('Converted to debug.html');
    })
    .catch(function (error) {
        console.error(error);
    });
