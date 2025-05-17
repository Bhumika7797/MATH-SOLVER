const ocrController = require('./ocrController');
const solveController = require('./solveController');
const whatsappController = require('./whatsappController');

exports.handleProblem = async (req, res) => {
  try {
    const { phoneNumber, problem } = req.body;
    const file = req.file;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    let expression;

    if (file) {
      expression = await ocrController.extract(file.path);
    } else if (problem) {
      expression = problem;
    } else {
      return res.status(400).json({ error: 'Provide a math problem or image file' });
    }

    console.log('Extracted Expression:', expression);

    const solution = await solveController.solve(expression);
    await whatsappController.sendMessage(phoneNumber, solution);

    res.status(200).json({
      message: 'Solution sent via WhatsApp successfully',
      expression,
      solution,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
