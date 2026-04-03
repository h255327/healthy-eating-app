const chatbotService = require('../services/chatbot.service');

async function sendMessage(req, res) {
  // TODO: forward user message to AI service, return response
  res.json({ message: 'sendMessage – not implemented' });
}

module.exports = { sendMessage };
