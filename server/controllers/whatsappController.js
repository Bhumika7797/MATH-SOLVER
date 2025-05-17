const sendWhatsApp = require('../utils/sendWhatsApp');

exports.sendMessage = async (to, message) => {
  try {
    // Basic validation
    if (!to || !message) {
      throw new Error('Phone number and message are required');
    }

    // Call the actual sending logic (defined in utils/sendWhatsApp.js)
    const response = await sendWhatsApp(to, message);
    return response;

  } catch (error) {
    console.error('WhatsApp send error:', error.response?.data || error.message);
    throw new Error(`WhatsApp send error: ${error.message}`);
  }
};
