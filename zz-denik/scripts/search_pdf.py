import pypdf
import sys

pdf_path = "import_files/Forbidden Lands - Player's Handbook (2nd printing) [2019] (2024_02_29 19_24_08 UTC).pdf"

def search_pdf(query):
    reader = pypdf.PdfReader(pdf_path)
    print(f"Total pages: {len(reader.pages)}")
    matches = []
    for idx, page in enumerate(reader.pages):
        text = page.extract_text()
        if query.lower() in text.lower():
            matches.append(idx + 1)
    print(f"Query '{query}' found on pages: {matches}")

if len(sys.argv) > 1:
    search_pdf(sys.argv[1])
else:
    search_pdf("tvorba postavy")
