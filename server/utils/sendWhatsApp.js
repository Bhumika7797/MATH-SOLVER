const axios = require('axios');
require('dotenv').config();

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

// console.log("Loaded Token:", token); // Debug
// console.log("Loaded Phone Number ID:", phoneNumberId); // Debug

module.exports = async function sendWhatsApp(to, message) {
  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const res = await axios.post(url, payload, { headers });
    console.log("Message Sent:", res.data); // Optional debug
    return res.data;
  } catch (err) {
    console.error('WhatsApp send error:', err.response?.data || err.message);
    throw err;
  }
};
