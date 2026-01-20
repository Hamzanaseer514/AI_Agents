import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsPath = path.join(__dirname, 'screenshots-results.json');
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

async function generateTestDocument() {
  const sections = [];
  const testPage = results[0]; // Just first page for testing

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Test Document - Single Page',
          bold: true,
          size: 48,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Testing: ${testPage.name}`,
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    })
  );

  if (testPage.screenshotPath && fs.existsSync(testPage.screenshotPath)) {
    const imageBuffer = fs.readFileSync(testPage.screenshotPath);
    const imageWidthEmu = Math.round(4.5 * 914400);
    const imageHeightEmu = Math.round((4.5 / (4/3)) * 914400);
    
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
      })
    );
  }

  const doc = new Document({
    sections: [{ children: sections }],
  });

  const outputPath = path.join(__dirname, 'Test_Single_Page.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Test document created: ${outputPath}`);
  console.log(`  Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\nPlease try opening this test file first.`);
  console.log(`If this opens successfully, the issue is with the large file size.`);
  console.log(`If this also fails, there may be a Word compatibility issue.`);
}

generateTestDocument().catch(console.error);



