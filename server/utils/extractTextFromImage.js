// const Tesseract = require('tesseract.js');
// const fs = require('fs');

// module.exports = async function extractTextFromImage(imagePath) {
//   try {
//     const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
//     return text.replace(/\n/g, ' ').trim();
//   } finally {
//     fs.unlink(imagePath, () => {});
//   }
// };

// const Tesseract = require('tesseract.js');
// const fs = require('fs');

// module.exports = async function extractTextFromImage(imagePath) {
//   try {
//     const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');

//     let expression = text.replace(/\n/g, ' ').trim();

//     // Fix Unicode superscript: convert ² → ^2, ³ → ^3
//     const superscriptMap = {
//       '⁰': '0', '¹': '1', '²': '^2', '³': '^3',
//       '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7',
//       '⁸': '^8', '⁹': '^9'
//     };
//     expression = expression.replace(/[\u00B2\u00B3\u2070-\u2079]/g, ch => superscriptMap[ch] || '');

//     // Remove extra whitespace
//     expression = expression.replace(/\s+/g, '');

//     // Replace common OCR misreads
//     expression = expression.replace(/–/g, '-'); // en-dash to minus

//     console.log("Cleaned OCR Expression:", expression);
//     return expression;
//   } finally {
//     fs.unlink(imagePath, () => {});
//   }
// };

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load Gemini API key from environment or paste directly
const genAI = new GoogleGenerativeAI("AIzaSyD2xKuOiwG2kjNfWZUZ8xlOJ7_dYKW5OxE"); // replace this with your actual key

// Convert file to base64
function fileToBase64(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
}

module.exports = async function extractTextFromImage(imagePath) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const imageBase64 = fileToBase64(imagePath);

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/png', // or 'image/jpeg' depending on input
          data: imageBase64,
        },
      },
      {
        text: `Extract and clean the math expression from this image. Output only the raw math expression like "3x^2 - 10x + 8 = 0" without explanation.`,
      },
    ]);

    const text = result.response.text().trim();

    // Clean up unicode superscripts just in case
    const superscriptMap = {
      '⁰': '0', '¹': '1', '²': '^2', '³': '^3',
      '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7',
      '⁸': '^8', '⁹': '^9'
    };
    const expression = text
      .replace(/[\u00B2\u00B3\u2070-\u2079]/g, ch => superscriptMap[ch] || '')
      .replace(/\s+/g, '')
      .replace(/–/g, '-');

    console.log("🧠 Gemini Extracted Expression:", expression);
    return expression;
  } catch (err) {
    console.error("❌ Gemini Vision API failed:", err);
    return '';
  } finally {
    fs.unlink(imagePath, () => {});
  }
};
