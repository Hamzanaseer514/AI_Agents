# Quick Start - Generate Documentation

## Prerequisites Check

First, install all dependencies:

```bash
npm install
npm install puppeteer docx --save-dev
```

## Generate Documentation (3 Simple Steps)

### 1. Start the Development Server

Open a terminal and run:

```bash
npm run dev
```

Wait until you see: `Local: http://localhost:3000/`

**Keep this terminal window open!**

### 2. Capture Screenshots

Open a **new terminal window** and run:

```bash
npm run docs:capture
```

This will:
- Wait for the dev server
- Visit all 30 pages
- Take full-page screenshots
- Save to `screenshots/` folder
- Takes approximately 5-10 minutes

### 3. Generate Word Document

After screenshots are captured, run:

```bash
npm run docs:generate
```

This creates: **`PayPerProject_Documentation.docx`** in the project root.

## Or Run Everything at Once

If you have the dev server running, you can do steps 2 and 3 together:

```bash
npm run docs:all
```

## Troubleshooting

**Issue:** "Dev server is not running"
- Solution: Make sure `npm run dev` is running in another terminal

**Issue:** Screenshots are blank or pages don't load
- Solution: Wait longer for the dev server to fully start, then try again

**Issue:** Missing dependencies
- Solution: Run `npm install` and `npm install puppeteer docx --save-dev`

## What Gets Documented?

✅ All 30 pages with:
- Page name and route
- Detailed description
- Full-page screenshot
- Organized in a professional Word document

## Output

- 📁 `screenshots/` - All page screenshots (PNG format)
- 📄 `screenshots-results.json` - Metadata file
- 📘 `PayPerProject_Documentation.docx` - Final Word document

The documentation will be saved in the same directory as this project.

