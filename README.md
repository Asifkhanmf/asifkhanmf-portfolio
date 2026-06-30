# Asif Khan — Portfolio

A modern, premium graphic design portfolio website built with pure HTML, CSS, and JavaScript. Features a cinematic dark theme with warm orange accents, parallax particle animations, category-based project filtering, and smooth scroll-triggered reveals.

![Portfolio Preview](images/vedhify%20logo-white.png)

## ✨ Features

- **Cinematic Dark Theme** — Deep dark backgrounds with warm orange (`#FF6B35`) gradient glow accents
- **Particle Constellation** — Animated canvas with 80 floating particles connected by lines
- **Category Filtering** — Filter 38 projects across 8 categories with smooth staggered animations
- **Lightbox with Navigation** — Click any project for fullscreen preview with prev/next navigation
- **3D Card Tilt** — Subtle perspective tilt effect on project cards following the cursor
- **Scroll Reveal Animations** — Elements animate in as they enter the viewport
- **Cursor Glow** — Warm radial gradient follows the cursor on desktop
- **Stat Counter Animation** — Numbers animate from 0 to their target value
- **Fully Responsive** — 4 breakpoints (1200px, 1024px, 768px, 480px)
- **Accessibility** — ARIA attributes, `prefers-reduced-motion` support, visible focus states, keyboard navigation

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0c0c0c` |
| Card | `#161616` |
| Accent | `#FF6B35` (warm orange) |
| Heading Font | [Syne](https://fonts.google.com/specimen/Syne) (800 weight) |
| Body Font | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) |
| Border Radius | 10px / 16px / 24px / 32px system |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |

## 📁 Project Structure

```
portfolio/
├── index.html       # Main HTML (all sections, 38 project cards)
├── style.css        # Complete stylesheet (~700 lines)
├── script.js        # Interactions & animations (~650 lines)
├── README.md        # This file
└── images/          # 38 design project images
    ├── vedhify logo-white.png
    ├── TouchTraks_BusinessCard_[Asif khan]-front.png
    ├── black mamba.jpg
    └── ... (35 more files)
```

## 🗂️ Project Categories

| Category | Count | Highlights |
|----------|-------|------------|
| Branding & Logos | 4 | Vedhify, Baby Tent, Easy Box, Curb The Urge |
| Business Cards | 4 | TouchTraks, BigFormula, Corporate designs |
| Social Media | 8 | Canadian Home App, DSS-AI/Clymet, ABC Study Abroad |
| Posters & Ads | 7 | TTBUK Travel, Black Pepper restaurant series |
| Sports Graphics | 4 | Black Mamba basketball team |
| Signage | 5 | Menu boards, combined sign designs |
| UI/UX Design | 4 | 1CLICK4E, Portfolio mockups |
| Packaging | 1 | QR Sticker Design |

## 🚀 Getting Started

Simply open `index.html` in your browser, or use a local server:

```bash
# Using npx
npx serve

# Using Python
python -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **HTML5** — Semantic markup with ARIA attributes
- **CSS3** — Custom properties, grid, flexbox, animations, `@media` queries
- **Vanilla JavaScript** — No frameworks or dependencies
- **Google Fonts** — Syne + Space Grotesk

## 📱 Responsive Breakpoints

- **1200px** — 2-column project grid
- **1024px** — Single column about/contact sections
- **768px** — Mobile navigation, compact layout
- **480px** — Single column grid, simplified hero

## ♿ Accessibility

- `prefers-reduced-motion` — All animations disabled when user prefers reduced motion
- ARIA labels on all interactive elements
- Keyboard navigation for lightbox (Escape, Arrow keys)
- Focus-visible outlines on buttons and cards
- SVG icons (no emojis) for consistent rendering

## 📬 Contact

- **Email**: [asifkhanmf@gmail.com](mailto:asifkhanmf@gmail.com)
- **LinkedIn**: [linkedin.com/in/asif-khan](https://www.linkedin.com/in/asif-khan-234009176)
- **Location**: Kochi, India

---

Designed & Developed by **Asif Khan** · © 2025
