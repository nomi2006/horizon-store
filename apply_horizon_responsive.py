from pathlib import Path

ROOT = Path(__file__).resolve().parent

def read(path):
    return path.read_text(encoding="utf8")

def write(path, text):
    path.write_text(text, encoding="utf8")

def replace_first_of(text, options, new, label):
    for old in options:
        if old in text:
            return text.replace(old, new, 1)
    raise RuntimeError(f"Could not find expected code for {label}")

path = ROOT / "src/pages/HomePage.jsx"
text = read(path)
text = replace_first_of(text, [
    '<div className="max-w-[1170px] mx-auto px-0">',
    '<div className="max-w-[1170px] mx-auto px-4">',
], '<div className="max-w-[1170px] mx-auto px-4 lg:px-0">', "HomePage main container")
text = text.replace('<div className="flex">', '<div className="home-hero flex flex-col lg:flex-row">', 1)
text = replace_first_of(text, [
    '<div className="flex-1 min-w-0 pl-[30px] pt-[27px]">',
    '<div className="pl-[30px] pt-[27px]">',
], '<div className="home-hero-content w-full min-w-0 pt-4 lg:pl-[30px] lg:pt-[27px]">', "HomePage hero content")
text = replace_first_of(text, [
    "width: '100%',\n                    height: '344px',",
    "width: '892px',\n                    height: '344px',",
], "width: '100%',\n                    height: '344px',", "HomePage hero size")
text = text.replace('className="absolute object-contain"', 'className="home-hero-image absolute object-contain"', 1)
text = replace_first_of(text, [
    '<div className="max-w-[1170px] mx-auto px-0 pt-[70px] pb-[70px]">',
    '<div className="max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]">',
], '<div className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-10 md:pt-[70px] pb-10 md:pb-[70px]">', "HomePage category container")
text = text.replace('className="\n        grid\n        grid-cols-2', 'className="category-grid\n        grid\n        grid-cols-2', 1)
write(path, text)

path = ROOT / "src/components/Navbar.tsx"
text = read(path)
text = replace_first_of(text, [
    '<div className="max-w-[1170px] mx-auto px-0 h-full">',
    '<div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 h-full">',
], '<div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 h-full">', "Navbar container")
text = text.replace('className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-down"', 'className="mobile-nav-panel md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-down"', 1)
write(path, text)

path = ROOT / "src/components/TopBar.tsx"
text = read(path)
text = replace_first_of(text, [
    '<div className="max-w-[1170px] h-full mx-auto px-0 flex items-center justify-between">',
    '<div className="max-w-[1170px] h-full mx-auto px-4 flex items-center justify-between">',
], '<div className="max-w-[1170px] h-full mx-auto px-4 lg:px-0 flex items-center justify-between">', "TopBar container")
text = text.replace('<div className="flex-1 text-center text-[12px] leading-none">', '<div className="topbar-message flex-1 text-center text-[12px] leading-none">', 1)
write(path, text)

path = ROOT / "src/components/FlashSales.tsx"
text = read(path)
text = replace_first_of(text, ['max-w-[1170px]', 'max-w-[1308px]'], 'max-w-[1170px]', "FlashSales width")
text = text.replace('            px-0', '            px-4\n            lg:px-0', 1)
text = text.replace('<div className="flex items-end justify-between mb-[28px]">', '<div className="flash-header flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-[28px]">', 1)
text = text.replace('<div className="flex items-end gap-[70px]">', '<div className="flash-header-left flex flex-col md:flex-row md:items-end gap-6 md:gap-[70px]">', 1)
text = text.replace('className="\n            flex\n            overflow-x-auto', 'className="flash-products\n            flex\n            overflow-x-auto', 1)
write(path, text)

path = ROOT / "src/components/BestSelling.tsx"
text = read(path)
text = replace_first_of(text, [
    '<div className="max-w-[1170px] mx-auto px-0 pt-[70px] pb-[70px]">',
    '<div className="max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]">',
], '<div className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-10 md:pt-[70px] pb-10 md:pb-[70px]">', "BestSelling container")
text = text.replace('<div className="flex items-end justify-between mb-[30px]">', '<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-[30px]">', 1)
text = text.replace('grid-cols-1\n            sm:grid-cols-2\n            lg:grid-cols-4', 'grid-cols-2\n            md:grid-cols-3\n            lg:grid-cols-4', 1)
text = text.replace('gap-[30px]', 'gap-4 md:gap-[30px]', 1)
text = text.replace('w-[270px]\n                h-[350px]', 'w-full\n                min-w-0\n                h-auto')
write(path, text)

path = ROOT / "src/components/ExploreProducts.tsx"
text = read(path)
text = replace_first_of(text, [
    '<div className="max-w-[1170px] mx-auto px-0 pt-[70px] pb-[70px]">',
    '<div className="max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]">',
], '<div className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-10 md:pt-[70px] pb-10 md:pb-[70px]">', "ExploreProducts container")
text = text.replace('<div className="flex items-start justify-between mb-[44px]">', '<div className="flex items-start justify-between gap-4 mb-8 md:mb-[44px]">', 1)
text = text.replace('grid-cols-1\n            sm:grid-cols-2\n            lg:grid-cols-4', 'grid-cols-2\n            md:grid-cols-3\n            lg:grid-cols-4', 1)
text = text.replace('gap-x-[30px]\n            gap-y-[70px]', 'gap-x-4 md:gap-x-[30px]\n            gap-y-8 md:gap-y-[70px]', 1)
write(path, text)

path = ROOT / "src/components/NewArrival.tsx"
text = read(path)
text = replace_first_of(text, [
    '<div className="max-w-[1170px] mx-auto px-0 pt-[70px] pb-[70px]">',
    '<div className="max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]">',
], '<div className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-10 md:pt-[70px] pb-10 md:pb-[70px]">', "NewArrival container")
text = text.replace('className="\n            grid\n            grid-cols-1\n            lg:grid-cols-[570px_570px]', 'className="new-arrival-grid\n            grid\n            grid-cols-1\n            lg:grid-cols-[570px_570px]', 1)
text = text.replace('w-full\n               h-[600px]', 'w-full\n               h-[420px] sm:h-[520px] lg:h-[600px]', 1)
text = text.replace('left-[40px]\n                 bottom-[40px]', 'left-5 sm:left-[40px]\n                 bottom-5 sm:bottom-[40px]', 1)
text = text.replace('h-[285px]', 'h-[260px] sm:h-[285px]')
write(path, text)

path = ROOT / "src/components/MusicBanner.tsx"
text = read(path)
text = text.replace('max-w-[1170px]\n           h-[570px]', 'max-w-[1170px]\n           h-[430px] sm:h-[500px] lg:h-[570px]')
text = replace_first_of(text, ['w-full\n           h-[500px]', 'w-[1170px]\n           h-[500px]'], 'music-banner-card w-full\n           h-full lg:h-[500px]', "MusicBanner card")
text = text.replace('className="\n               absolute\n               top-[37px]', 'className="music-banner-visual\n               absolute\n               top-[37px]', 1)
text = text.replace('className="\n               absolute\n               top-[69px]', 'className="music-banner-category\n               absolute\n               top-[69px]', 1)
text = text.replace('className="\n               absolute\n               top-[121px]', 'className="music-banner-title\n               absolute\n               top-[121px]', 1)
text = text.replace('className="\n               absolute\n               top-[273px]', 'className="music-banner-timer\n               absolute\n               top-[273px]', 1)
write(path, text)

path = ROOT / "src/components/FeaturesBar.tsx"
text = read(path)
text = text.replace('w-full\n           h-[301px]', 'w-full\n           min-h-[301px]\n           h-auto', 1)
text = text.replace('w-[943px]\n           h-[161px]\n           flex', 'features-group w-full max-w-[943px]\n           min-h-[161px]\n           h-auto\n           flex', 1)
text = text.replace('gap-[88px]', 'gap-10 md:gap-[88px]', 1)
write(path, text)

css_path = ROOT / "src/index.css"
if not css_path.exists():
    css_path = ROOT / "src/index.scss"
if not css_path.exists():
    raise FileNotFoundError("Could not find src/index.css or src/index.scss")

css = read(css_path)
marker = "HORIZON STORE RESPONSIVE PASS"
if marker in css:
    raise RuntimeError("Responsive CSS already exists. Remove the previous block before running again.")

css += '''

/* HORIZON STORE RESPONSIVE PASS */

html,
body {
  overflow-x: hidden;
}

img {
  max-width: 100%;
}

@media (max-width: 1023px) {
  .home-hero {
    padding-bottom: 24px;
  }

  .home-hero-content > div:first-child {
    width: 100% !important;
  }

  .home-hero-image {
    width: min(58vw, 496px) !important;
    height: auto !important;
    left: auto !important;
    right: 4% !important;
    top: 50% !important;
    transform: translateY(-50%);
  }

  .music-banner-visual {
    left: 48% !important;
    transform: scale(.9);
    transform-origin: left center;
  }
}

@media (max-width: 767px) {
  .topbar-message {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .home-hero-content > div:first-child {
    height: 300px !important;
  }

  .home-hero-content h1 {
    font-size: 32px !important;
    line-height: 40px !important;
    letter-spacing: .02em !important;
  }

  .home-hero-content > div:first-child > div:first-child {
    left: 24px !important;
  }

  .home-hero-image {
    width: min(62vw, 330px) !important;
    right: -2% !important;
    opacity: .9;
  }

  .flash-header-left h2,
  main h2 {
    font-size: 28px !important;
    line-height: 36px !important;
  }

  .flash-products {
    scroll-padding-left: 16px;
  }

  .flash-products > * {
    width: min(72vw, 270px) !important;
  }

  .new-arrival-grid {
    gap: 16px !important;
  }

  .music-banner-card {
    height: 430px !important;
  }

  .music-banner-visual {
    left: 42% !important;
    top: 50px !important;
    transform: scale(.56);
    transform-origin: left top;
    opacity: .65;
  }

  .music-banner-category {
    top: 36px !important;
    left: 24px !important;
  }

  .music-banner-title {
    top: 72px !important;
    left: 24px !important;
    width: calc(100% - 48px) !important;
    height: auto !important;
    font-size: 32px !important;
    line-height: 40px !important;
  }

  .music-banner-title span {
    white-space: normal !important;
    width: auto !important;
  }

  .music-banner-timer {
    top: 205px !important;
    left: 24px !important;
    gap: 10px !important;
    width: calc(100% - 48px) !important;
  }

  .music-banner-timer > div {
    width: 52px !important;
    height: 52px !important;
  }

  .music-banner-card a {
    top: 310px !important;
    left: 24px !important;
    width: 150px !important;
    height: 50px !important;
    padding: 0 !important;
  }

  .features-group {
    flex-direction: column !important;
    align-items: center !important;
    gap: 36px !important;
    padding: 24px 0 48px;
  }

  .features-group > div {
    width: min(100%, 320px) !important;
    height: auto !important;
  }

  .features-group h3,
  .features-group p {
    white-space: normal !important;
  }
}

@media (max-width: 479px) {
  .category-grid {
    gap: 12px !important;
  }

  .category-grid > a {
    height: 120px !important;
  }
}
'''
write(css_path, css)

print("Responsive implementation applied successfully.")
