
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load Gemini API key from environment or paste directly
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API"); // replace this with your actual key

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
