# Playbook for America - Static Site

A simple, static website built with Astro and Tailwind CSS for the Playbook for America civic platform.

## Tech Stack

- Astro - Static site framework
- FormKit - Vue 3 form library with multi-step forms
- Tailwind v4 - Utility-first CSS framework
- Google Fonts - Jost sans-serif and Libertinus Serif serif font families

## Report Intake Form

The site includes a public 4-step anonymous report intake form (`/file-a-report`) that submits to the Python backend:

- **Step 1:** The Problem (what, where, category, who's affected)
- **Step 2:** Context (scope, institution, timing, pattern)
- **Step 3:** Details (observations, why it matters, supporting links)
- **Step 4:** Privacy & Submit (confirmations, optional follow-up email)

Form submissions POST to the FastAPI backend at `PUBLIC_REPORT_ENDPOINT_URL` (configured in `.env`).

### Environment Variables

Create a `.env` file with:
```
PUBLIC_REPORT_ENDPOINT_URL='http://localhost:8000/report'
```

The form creates anonymous report submissions that staff can review and process.

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd /path/to/static
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Building for Production

Build the static site:

```bash
npm run build
```

This will generate the production-ready files in the `dist/` directory.

### Preview the Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment to Apache (via FTP)

1. Build the production site:
   ```bash
   npm run build
   ```

2. Upload the contents of the `dist/` directory to your Apache web server via FTP:
   - Connect to your server using an FTP client (FileZilla, Cyberduck, etc.)
   - Navigate to your web root directory (typically `public_html/` or `www/`)
   - Upload all files and folders from the `dist/` directory
   - Ensure the directory structure is preserved

3. The site should now be live at your domain

### Important Notes for Apache Deployment

- Make sure your Apache server has `mod_rewrite` enabled if you add routing in the future
- The `dist/` directory contains all the static assets needed to run the site
- No server-side processing is required - these are pure static HTML, CSS, and JavaScript files

## Project Structure

```
/
├── src/
│   ├── layouts/
│   │   └── Layout.astro       # Base layout with font configuration
│   └── pages/
│       └── index.astro        # Main landing page
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Color System

Defined in `src/styles/global.css` under `@theme inline`. All tokens are prefixed `p4a-` and available as Tailwind utilities (e.g. `bg-p4a-surface`, `text-p4a-ink`).

The palette is a single blue ramp. Light and dark mode values are set via `light-dark()`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `p4a-bg` | `#d4defc` | `#111d40` | Page background |
| `p4a-surface` | `#e6ebfa` | `#1e3066` | Card / panel background (sits above bg) |
| `p4a-navy` | `#1e3066` | `#0a1228` | Nav bar, hero section |
| `p4a-deep` | `#111d40` | `#e6ebfa` | Darkest anchor; dark mode nav depth |
| `p4a-ink` | `#32498f` | `#9fb5f5` | Headings, section titles |
| `p4a-body-text` | `#3d5bb8` | `#7494f2` | Body / paragraph text |
| `p4a-link` | `#305adb` | `#5176e8` | Clickable links, CTA outlines |
| `p4a-accent` | `#5176e8` | `#5176e8` | Primary buttons, hero title, step numbers |
| `p4a-muted` | `#7494f2` | `#3d5bb8` | Supporting / label text |
| `p4a-pale` | `#9fb5f5` | `#32498f` | Light text on dark backgrounds |
| `p4a-subtle` | `#374151` | `#d1d5db` | Form labels, table headers |
| `p4a-faint` | `#6b7280` | `#9ca3af` | Help text, secondary descriptive text |
| `p4a-disabled` | `#9ca3af` | `#4b5563` | Disabled button backgrounds |
| `p4a-danger` | `#dc2626` | `#f87171` | Error messages, destructive actions |

### Usage notes
- `p4a-bg` vs `p4a-surface`: `p4a-bg` is the page canvas; `p4a-surface` is for elements that sit on top of it (cards, panels). The slight value difference creates a subtle lift without a hard border.
- `p4a-navy` / `p4a-deep`: Both are dark navies used for the nav bar and dark backgrounds. `p4a-deep` is the darkest value, primarily useful in dark mode.
- `p4a-accent`: Intentionally the same in both modes — test contrast if adjusting.
- Dark mode is toggled by adding the `.dark` class to `<html>` and setting `color-scheme` to match.

### Fine-tuning guidelines

**Tweak hex values in `global.css`** — the common case. Use when a token is semantically correct but the shade feels off (e.g. "ink is too blue in dark mode"). Both light and dark values live on the same line, edit them as a pair.

**Change color assignment in markup** — use when the wrong token is applied to an element. The semantic meaning is wrong, not the shade (e.g. a heading styled as body text, or a surface that should be a background).

**Add a new token** — only when there is a genuinely new semantic role that no existing token covers, and it will be used in at least 2–3 places. One-off colors don't need a token; use the hex value inline.

## Original requirements
- Astro static site framework
- Tailwind CSS styles and colors
- Google Jost font family, light, regular, semibold, bold, extrabold
- Just one page: index.html
- Clone this page: johnknapp.com/playbook-for-america
- An appropriate .gitignore
- A README.md with setup and usage instructions
- Suitable to run on apache uploaded via ftp

## License

ISC
