import pypdf

pdf_path = "import_files/Forbidden Lands - Player's Handbook (2nd printing) [2019] (2024_02_29 19_24_08 UTC).pdf"

reader = pypdf.PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")
for idx, page in enumerate(reader.pages):
    print(f"--- PAGE {idx+1} ---")
    print(page.extract_text()[:2000]) # first 2000 chars of each page
