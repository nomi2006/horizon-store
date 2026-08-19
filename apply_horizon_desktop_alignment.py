from pathlib import Path

ROOT = Path(__file__).resolve().parent

replacements = {
    "src/pages/HomePage.jsx": [
        ("<div className=\"max-w-[1170px] mx-auto px-4\">", "<div className=\"max-w-[1170px] mx-auto px-0\">"),
        ("<div className=\"pl-[30px] pt-[27px]\">", "<div className=\"flex-1 min-w-0 pl-[30px] pt-[27px]\">"),
        ("width: '892px',", "width: '100%',"),
        ("left: '396px',", "left: '388px',"),
        ("<div className=\"max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]\">", "<div className=\"max-w-[1170px] mx-auto px-0 pt-[70px] pb-[70px]\">"),
    ],
    "src/components/FlashSales.tsx": [
        ("max-w-[1308px]", "max-w-[1170px]"),
    ],
    "src/components/BestSelling.tsx": [
        ("<div className=\"max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]\">", "<div className=\"max-w-[1170px] mx-auto px-0 pt-[70px] pb-[70px]\">"),
        ("w-[270px]\n                h-[350px]", "w-full\n                min-w-0\n                h-[350px]"),
    ],
    "src/components/ExploreProducts.tsx": [
        ("<div className=\"max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]\">", "<div className=\"max-w-[1170px] mx-auto px-0 pt-[70px] pb-[70px]\">"),
    ],
    "src/components/NewArrival.tsx": [
        ("<div className=\"max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]\">", "<div className=\"max-w-[1170px] mx-auto px-0 pt-[70px] pb-[70px]\">"),
    ],
    "src/components/MusicBanner.tsx": [
        ("w-[1170px]\n            h-[500px]", "w-full\n            h-[500px]"),
    ],
    "src/components/TopBar.tsx": [
        ("<div className=\"max-w-[1170px] h-full mx-auto px-4 flex items-center justify-between\">", "<div className=\"max-w-[1170px] h-full mx-auto px-0 flex items-center justify-between\">"),
    ],
    "src/components/Navbar.tsx": [
        ("<div className=\"max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 h-full\">", "<div className=\"max-w-[1170px] mx-auto px-0 h-full\">"),
    ],
}

for relative_path, pairs in replacements.items():
    path = ROOT / relative_path
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {relative_path}")

    text = path.read_text(encoding="utf8")

    for old, new in pairs:
        if old not in text:
            raise RuntimeError(f"Expected text was not found in {relative_path}: {old!r}")
        text = text.replace(old, new, 1)

    path.write_text(text, encoding="utf8")
    print(f"Updated {relative_path}")

print()
print("Desktop alignment changes applied.")
print("Run the project normally and compare the homepage at desktop width.")
print("Do not apply responsive changes yet.")
