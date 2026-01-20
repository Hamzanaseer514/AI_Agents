import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read screenshot results
const resultsPath = path.join(__dirname, 'screenshots-results.json');
const screenshotsDir = path.join(__dirname, 'screenshots');

if (!fs.existsSync(resultsPath)) {
  console.error('screenshots-results.json not found. Please run capture-screenshots.js first.');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

async function generateDocumentation() {
  const sections = [];

  // Title Page
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Pay Per Project',
          bold: true,
          size: 72,
        }),
      ],
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Project Documentation',
          size: 48,
        }),
      ],
      spacing: { after: 600 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Documentation Date: ${new Date().toLocaleDateString()}`,
          size: 24,
        }),
      ],
      spacing: { after: 1200 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );

  // Table of Contents (will be manual since auto TOC requires more complex setup)
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Table of Contents',
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    })
  );

  const tocItems = results.map((page, index) => 
    new Paragraph({
      children: [
        new TextRun({
          text: `${index + 1}. ${page.name} - ${page.route}`,
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    })
  );

  sections.push(...tocItems);
  sections.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );

  // Process each page
  for (let i = 0; i < results.length; i++) {
    const page = results[i];
    
    // Page heading
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${i + 1}. ${page.name}`,
            bold: true,
            size: 36,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Route: ${page.route}`,
            size: 24,
            italics: true,
          }),
        ],
        spacing: { after: 400 },
      })
    );

    // Page description
    if (page.description) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Description:',
              bold: true,
              size: 28,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: page.description,
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    // Screenshot
    if (page.screenshotPath && fs.existsSync(page.screenshotPath)) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Screenshot:',
              bold: true,
              size: 28,
            }),
          ],
          spacing: { before: 200, after: 200 },
        })
      );

      try {
        const imageBuffer = fs.readFileSync(page.screenshotPath);
        
        // Use smaller dimensions for better Word compatibility and smaller file size
        // Word uses EMU (English Metric Units): 1 inch = 914400 EMU
        // Using 4.5 inches wide to ensure smaller file size and better compatibility
        // Standard 8.5" page width minus 1" margins = 6.5" available, 4.5" leaves good margins
        const maxWidthInches = 4.5;  // Smaller size for better compatibility
        const aspectRatio = 4/3;  // Assuming roughly 4:3 aspect ratio for screenshots
        const imageWidthEmu = Math.round(maxWidthInches * 914400);
        const imageHeightEmu = Math.round((maxWidthInches / aspectRatio) * 914400);
        
        sections.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: imageWidthEmu,
                  height: imageHeightEmu,
                },
                type: 'png',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      } catch (error) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Error loading screenshot: ${error.message}`,
                size: 20,
                color: 'FF0000',
              }),
            ],
            spacing: { after: 400 },
          })
        );
      }
    } else {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: page.error 
                ? `Screenshot not available: ${page.error}`
                : 'Screenshot not available',
              size: 20,
              color: 'FF0000',
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    // Page break before next page (except last one)
    if (i < results.length - 1) {
      sections.push(
        new Paragraph({
          text: '',
          pageBreakBefore: true,
        })
      );
    }
  }

  // Create document with proper settings for Word compatibility
  const doc = new Document({
    creator: "Pay Per Project Documentation Generator",
    title: "Pay Per Project - Complete Documentation",
    description: "Complete documentation with screenshots for all pages",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch margins (in twips: 1440 = 1 inch)
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: sections,
      },
    ],
  });

  // Generate and save with error handling
  const outputPath = path.join(__dirname, 'PayPerProject_Documentation.docx');
  try {
    console.log('\nGenerating Word document...');
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    const fileSizeMB = (buffer.length / 1024 / 1024).toFixed(2);
    console.log(`\n✓ Documentation generated successfully!`);
    console.log(`  Output: ${outputPath}`);
    console.log(`  Total pages documented: ${results.length}`);
    console.log(`  File size: ${fileSizeMB} MB`);
    
    if (parseFloat(fileSizeMB) > 50) {
      console.warn(`  ⚠ Warning: Large file size (${fileSizeMB} MB). Word may take time to open.`);
    }
  } catch (error) {
    console.error(`\n✗ Error generating document: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

generateDocumentation().catch(console.error);

