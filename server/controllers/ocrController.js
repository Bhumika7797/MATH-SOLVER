const extractTextFromImage = require('../utils/extractTextFromImage');

exports.extract = async (imagePath) => {
  try {
    return await extractTextFromImage(imagePath);
  } catch (error) {
    throw new Error(`OCR error: ${error.message}`);
  }
};
