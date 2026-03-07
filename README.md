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
