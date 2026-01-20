# Pay Per Project - Documentation Generation Guide

This guide explains how to generate comprehensive Word documentation with screenshots for all pages in the Pay Per Project application.

## Prerequisites

1. **Install Project Dependencies**
   ```bash
   npm install
   ```

2. **Install Documentation Dependencies**
   ```bash
   npm install puppeteer docx --save-dev
   ```

## Steps to Generate Documentation

### Step 1: Start the Development Server

First, you need to start the development server so that the screenshot capture script can access all pages:

```bash
npm run dev
```

The server should start on `http://localhost:3000`. Keep this running in one terminal window.

### Step 2: Capture Screenshots

In a new terminal window, run the screenshot capture script:

```bash
npm run docs:capture
```

Or directly:
```bash
node capture-screenshots.js
```

This script will:
- Wait for the dev server to be ready
- Navigate to each page in the application
- Take full-page screenshots
- Save them to the `screenshots/` directory
- Generate a `screenshots-results.json` file with metadata

**Note:** The script will capture screenshots for all 30 pages defined in the `capture-screenshots.js` file.

### Step 3: Generate Word Document

Once screenshots are captured, generate the Word document:

```bash
npm run docs:generate
```

Or directly:
```bash
node generate-documentation.js
```

This will create `PayPerProject_Documentation.docx` in the project root directory.

### Step 4: All-in-One Command

You can also run both steps sequentially:

```bash
npm run docs:all
```

## Pages Included in Documentation

The documentation includes screenshots and details for the following 30 pages:

1. **HomePage** (`/`) - Main landing page
2. **HowItWorksPage** (`/how-it-works`) - Process explanation
3. **IndustriesPage** (`/industries`) - Industry listings
4. **IndustryDetailPage** (`/industries/agriculture`) - Example industry detail
5. **ReviewsPage** (`/reviews`) - Customer reviews
6. **ContactPage** (`/contact`) - Contact information and forms
7. **ConsultationPage** (`/consultation`) - Consultation booking
8. **FeaturesPage** (`/features`) - Feature showcase
9. **PricingPage** (`/pricing`) - Pricing plans
10. **HireTalentPage** (`/hire-talent`) - Talent request form
11. **PostProjectPage** (`/post-project`) - Project posting
12. **StartProjectPage** (`/start-project`) - Project initiation
13. **WhiteLabelPage** (`/white-label-products`) - White label products
14. **ExpertAdvicePage** (`/expert-advice`) - Expert consultations
15. **QuizPage** (`/quiz`) - Interactive quiz
16. **PaymentOptionsPage** (`/payment-options`) - Payment methods
17. **ResourcesPage** (`/resources`) - Resource hub
18. **BlogPage** (`/blog`) - Blog listing
19. **BlogPostPage** (`/blog/upwork-fiverr-alternative-zero-commission`) - Example blog post
20. **AiAutomationsPage** (`/solutions/ai-automations`) - AI automation solutions
21. **N8nAutomationsPage** (`/solutions/n8n-automations`) - N8N automations
22. **ItSolutionsPage** (`/solutions/it-consulting-solutions`) - IT consulting
23. **SellBuyBusinessesPage** (`/solutions/sell-buy-businesses`) - Business marketplace
24. **CareersPage** (`/careers`) - Career opportunities
25. **AiPredictorPage** (`/ai-predictor`) - AI predictor tool
26. **StartupsPage** (`/startups`) - Startup solutions
27. **ReferralsPage** (`/referrals`) - Referral program
28. **ValueAndPricingPage** (`/value-and-pricing`) - Value proposition
29. **AgenticAiModelsPage** (`/agentic-ai-models`) - AI models showcase
30. **AgenticAiResourcePage** (`/resources/agentic-ai-explained`) - Agentic AI resource
31. **ApplyForProjectsPage** (`/apply-for-projects`) - Project applications

## Document Structure

The generated Word document includes:

1. **Title Page** - Project name and documentation date
2. **Table of Contents** - List of all documented pages
3. **Page Sections** - For each page:
   - Page name and route
   - Detailed description
   - Full-page screenshot

## Troubleshooting

### Dev Server Not Running
If you see "Dev server is not running" error:
- Make sure `npm run dev` is running in another terminal
- Wait for the server to fully start before running the capture script
- Check that the server is accessible at `http://localhost:3000`

### Screenshot Capture Failures
If some screenshots fail to capture:
- Check the browser console for JavaScript errors
- Ensure all dependencies are installed
- Some pages may take longer to load - the script includes retry logic

### Image Loading Errors in Word Document
If images don't appear in the Word document:
- Verify that screenshot files exist in the `screenshots/` directory
- Check file permissions
- Ensure the `screenshots-results.json` file was generated correctly

## Customization

### Adding/Removing Pages

Edit `capture-screenshots.js` and modify the `pages` array:

```javascript
const pages = [
  { 
    route: '/your-route', 
    name: 'YourPageName', 
    description: 'Your detailed page description here...' 
  },
  // ... more pages
];
```

### Changing Screenshot Settings

In `capture-screenshots.js`, you can modify:
- Viewport size: `defaultViewport: { width: 1920, height: 1080 }`
- Wait times: Adjust `setTimeout` values
- Screenshot format: Change `type: 'png'` to `'jpeg'` if needed

### Modifying Document Format

Edit `generate-documentation.js` to customize:
- Font sizes
- Image dimensions
- Document structure
- Additional sections

## Output Files

After running the documentation generation:

- `screenshots/` - Directory containing all page screenshots
- `screenshots-results.json` - Metadata about captured screenshots
- `PayPerProject_Documentation.docx` - Final Word document

## Notes

- Screenshots are captured at 1920x1080 viewport size
- Full-page screenshots capture the entire scrollable content
- The script includes automatic scrolling to load lazy-loaded content
- Each page waits for network idle before capturing screenshots
- Error handling is included for pages that may fail to load

