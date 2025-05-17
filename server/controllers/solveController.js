const solveMath = require('../utils/solveMath');

exports.solve = async (expression) => {
  try {
    const cleaned = expression.trim();
    const result = await solveMath(cleaned);
    return result;
  } catch (error) {
    console.error('Solve error:', error);
    throw new Error(`Solve error: ${error.message}`);
  }
};
