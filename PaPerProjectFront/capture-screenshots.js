import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All pages to capture
const pages = [
  { 
    route: '/', 
    name: 'HomePage', 
    description: 'Landing page featuring hero section, quick value grid, how it works section, trust badges, company pitch, key features, unique benefits, solutions showcase, benchmark slider, AI predictor CTA, social proof, zero fees section, referral program, and FAQ section. This is the main entry point for the platform.' 
  },
  { 
    route: '/how-it-works', 
    name: 'HowItWorksPage', 
    description: 'Comprehensive explanation of the platform process from idea to invoice. Includes hero section, problem statement, step-by-step process flow, why it works section, results and team section, comparison table, project showcase, FAQ section, and final CTA. Explains the managed project delivery approach.' 
  },
  { 
    route: '/industries', 
    name: 'IndustriesPage', 
    description: 'Lists all available industries served by the platform. Displays industry cards organized by categories including Primary Sectors, Manufacturing & Engineering, Finance & Legal, Health & Science, Consumer & Services, Media & Communications, and Transportation & Logistics. Each card shows industry name, description, and navigation to detail pages.' 
  },
  { 
    route: '/industries/agriculture', 
    name: 'IndustryDetailPage', 
    description: 'Detailed page for Agriculture industry. Shows industry-specific challenges, market trends, tech innovations, regulatory landscape, and solutions. Includes hero section with industry icon, challenges section, insights section, and CTA. This page is dynamically generated based on the industry slug.' 
  },
  { 
    route: '/reviews', 
    name: 'ReviewsPage', 
    description: 'Customer reviews and testimonials page. Displays client feedback, ratings, case studies, and success stories. Helps build trust and credibility by showcasing real client experiences and project outcomes.' 
  },
  { 
    route: '/contact', 
    name: 'ContactPage', 
    description: 'Contact page with multiple contact options including contact form, contact info bar (email, phone, office address), complaints form section, and business hours information. Provides various ways for users to reach out including general inquiries and complaint filing.' 
  },
  { 
    route: '/consultation', 
    name: 'ConsultationPage', 
    description: 'Book a consultation page with AI predictor form. Allows users to schedule consultations and get AI-powered project estimates. Includes form fields for project details and requirements to provide personalized consultation.' 
  },
  { 
    route: '/features', 
    name: 'FeaturesPage', 
    description: 'Comprehensive features page showcasing all platform capabilities. Includes hero section with taglines, feature comparison table, detailed feature cards (Outcome-based pricing, Growth & scaling, Business health, IP protection, B2B marketplace, White-label products, Startup & enterprise solutions, Reporting & analytics, LPNPL model, Project vault, Credits system, Project cloning, Upgrade flexibility, Miles program, BIP system, Referral program, Project insurance, EaaS model), and combined CTA sections for quiz and payment options.' 
  },
  { 
    route: '/pricing', 
    name: 'PricingPage', 
    description: 'Membership plans and pricing page. Shows three tiers: Basic (free), Standard (£199/mo), and Pro (£699/mo) with detailed feature comparison table. Includes project opportunities, merit & checks, platform usage limits, white-label product listings, and extras. Features accordion with feature explanations and CTA buttons for each plan.' 
  },
  { 
    route: '/hire-talent', 
    name: 'HireTalentPage', 
    description: 'Hire talent request form page. Allows clients to submit requests for hiring specialized talent. Includes form with project requirements, skills needed, timeline, and budget information to match with appropriate talent.' 
  },
  { 
    route: '/post-project', 
    name: 'PostProjectPage', 
    description: 'Post a new project page. Provides interface for clients to create and post project listings. Includes project details form, scope definition, budget setting, timeline selection, and submission workflow.' 
  },
  { 
    route: '/start-project', 
    name: 'StartProjectPage', 
    description: 'Start a new project page. Guides users through the initial project setup process. Includes project scoping wizard, requirement gathering, team matching information, and next steps.' 
  },
  { 
    route: '/white-label-products', 
    name: 'WhiteLabelPage', 
    description: 'White label products information page. Explains the white-label product catalog system where partners can list their pre-packaged services. Includes product listing options, branding customization, and marketplace integration details.' 
  },
  { 
    route: '/expert-advice', 
    name: 'ExpertAdvicePage', 
    description: 'Expert advice and guidance page. Provides access to expert consultations, advisory services, and professional guidance for project planning and execution. Includes expert profiles and consultation booking.' 
  },
  { 
    route: '/quiz', 
    name: 'QuizPage', 
    description: 'Interactive quiz page. Helps users determine their project needs and get personalized recommendations. Includes multiple-choice questions, progress tracking, and results with suggested solutions based on answers.' 
  },
  { 
    route: '/payment-options', 
    name: 'PaymentOptionsPage', 
    description: 'Available payment options page. Details all accepted payment methods including credit cards, bank transfers, payment plans, and credits system. Includes security information and payment terms.' 
  },
  { 
    route: '/resources', 
    name: 'ResourcesPage', 
    description: 'Resources hub page. Central location for all learning materials including blog articles, customer stories, featured videos, academy courses, Agentic AI resources (what is agentic AI, AI agent vs agentic AI, business use cases, how to build an AI agent), and connection options. Organized by categories: Learn, Agentic AI, and Connect.' 
  },
  { 
    route: '/blog', 
    name: 'BlogPage', 
    description: 'Blog listing page displaying all blog posts. Shows post cards with featured images, categories, titles, descriptions, author information, publication dates, and read more links. Posts are sorted by date with grid layout.' 
  },
  { 
    route: '/blog/upwork-fiverr-alternative-zero-commission', 
    name: 'BlogPostPage', 
    description: 'Individual blog post page. Displays full blog article content with hero image, title, author, date, category, article body content with formatted text, images, and related posts section. This is a dynamic route that displays any blog post based on slug. This example shows the "Upwork & Fiverr Alternative" blog post.' 
  },
  { 
    route: '/solutions/ai-automations', 
    name: 'AiAutomationsPage', 
    description: 'AI automation solutions page. Showcases AI automation services and capabilities including custom AI solutions, workflow automation, intelligent process automation, and integration services. Includes use cases, benefits, and CTA sections.' 
  },
  { 
    route: '/solutions/n8n-automations', 
    name: 'N8nAutomationsPage', 
    description: 'N8N automation solutions page. Details N8N-based automation services for workflow automation, API integrations, data processing pipelines, and business process automation. Includes N8N platform benefits and implementation services.' 
  },
  { 
    route: '/solutions/it-consulting-solutions', 
    name: 'ItSolutionsPage', 
    description: 'IT consulting solutions page. Provides IT consulting services including architecture design, technology selection, implementation planning, and technical advisory. Includes service offerings, methodologies, and case studies.' 
  },
  { 
    route: '/solutions/sell-buy-businesses', 
    name: 'SellBuyBusinessesPage', 
    description: 'Sell and buy businesses platform page. Marketplace for buying and selling businesses with listing management, valuation services, due diligence support, and transaction facilitation. Includes marketplace features and success stories.' 
  },
  { 
    route: '/careers', 
    name: 'CareersPage', 
    description: 'Career opportunities and job listings page. Displays available positions, job descriptions, requirements, benefits, and application forms. Includes company culture information, team testimonials, and career growth opportunities.' 
  },
  { 
    route: '/ai-predictor', 
    name: 'AiPredictorPage', 
    description: 'AI predictor tool page. Interactive tool that uses AI to predict project costs, timelines, and resource requirements based on project parameters. Includes input form, prediction results, and detailed breakdowns with confidence scores.' 
  },
  { 
    route: '/startups', 
    name: 'StartupsPage', 
    description: 'Startup solutions and services page. Tailored offerings for startups including MVP development, funding support, growth strategies, and startup-specific features. Includes startup success stories, packages, and special programs.' 
  },
  { 
    route: '/referrals', 
    name: 'ReferralsPage', 
    description: 'Referral program information page. Details the referral program including referral rewards, how it works, referral links, tracking dashboard, and terms & conditions. Includes CTA to share referral links and earn rewards.' 
  },
  { 
    route: '/value-and-pricing', 
    name: 'ValueAndPricingPage', 
    description: 'Value and pricing information page. Explains the value proposition, pricing model, cost breakdown, ROI calculator, and comparison with alternatives. Helps users understand the value they receive for their investment.' 
  },
  { 
    route: '/agentic-ai-models', 
    name: 'AgenticAiModelsPage', 
    description: 'Agentic AI models showcase page. Displays available Agentic AI models, their capabilities, use cases, and integration options. Includes model comparisons, performance metrics, and selection guides for choosing the right AI model.' 
  },
  { 
    route: '/resources/agentic-ai-explained', 
    name: 'AgenticAiResourcePage', 
    description: 'Agentic AI explained resource page. Comprehensive educational resource covering what Agentic AI is, what "agentic" means, differences between AI agents and agentic AI, how to build AI agents, available tools, frameworks (LangChain, AutoGPT, BabyAGI, etc.), business use cases, and implementation guides.' 
  },
  { 
    route: '/apply-for-projects', 
    name: 'ApplyForProjectsPage', 
    description: 'Apply for available projects page. Allows freelancers/teams to browse open projects, view project details, submit applications, and track application status. Includes project filters, application form, portfolio upload, and application history.' 
  },
];

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

async function captureScreenshots() {
  // Create screenshots directory
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--force-device-scale-factor=2', '--high-dpi-support=1'],  // Force 2x scaling and high DPI
    defaultViewport: { 
      width: 2560,  // Larger viewport for higher resolution
      height: 1440,
      deviceScaleFactor: 2  // Higher pixel density for sharper images (5120x2880 effective)
    }
  });

  const page = await browser.newPage();
  
  // Set higher quality viewport with 2x pixel density for retina-quality screenshots
  await page.setViewport({
    width: 2560,
    height: 1440,
    deviceScaleFactor: 2  // 2x DPI for retina-quality screenshots
  });

  // Wait for dev server to be ready
  console.log('Waiting for dev server...');
  let retries = 30;
  while (retries > 0) {
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 5000 });
      break;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Dev server is not running. Please start it with: npm run dev');
        await browser.close();
        process.exit(1);
      }
      console.log(`Waiting for dev server... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('Dev server is ready! Starting screenshot capture...\n');

  const results = [];

  for (const pageInfo of pages) {
    try {
      console.log(`Capturing ${pageInfo.name} (${pageInfo.route})...`);
      
      await page.goto(`${BASE_URL}${pageInfo.route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait a bit for any animations or dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Scroll to bottom to load lazy content
      await page.evaluate(() => {
        return new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              setTimeout(resolve, 500);
            }
          }, 100);
        });
      });

      // Take full page screenshot with high quality
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageInfo.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: 'png',
        omitBackground: false,  // Include background for better visuals
        captureBeyondViewport: true  // Ensure full page capture
      });

      results.push({
        ...pageInfo,
        screenshotPath: screenshotPath
      });

      console.log(`✓ Captured ${pageInfo.name}\n`);
    } catch (error) {
      console.error(`✗ Failed to capture ${pageInfo.name}: ${error.message}\n`);
      results.push({
        ...pageInfo,
        screenshotPath: null,
        error: error.message
      });
    }
  }

  await browser.close();

  // Save results to JSON
  const resultsPath = path.join(__dirname, 'screenshots-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log(`\n✓ Screenshot capture complete!`);
  console.log(`  Total pages: ${pages.length}`);
  console.log(`  Successful: ${results.filter(r => r.screenshotPath).length}`);
  console.log(`  Failed: ${results.filter(r => !r.screenshotPath).length}`);
  console.log(`\nResults saved to: ${resultsPath}`);
  console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);

  return results;
}

captureScreenshots().catch(console.error);

