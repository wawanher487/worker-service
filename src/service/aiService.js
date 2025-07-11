const axios = require("axios");
const logger = require("../util/logger");

class AIService {
  async sendToAI(payload) {
    try {
      const response = await axios.post(process.env.AI_SERVICE_URL, payload);
      logger.info("Data berhasil dikirim ke AI Service", response.data);
      return response.data;
    } catch (error) {
      logger.error("Gagal mengirim ke AI Service", error.message);
      return null;
    }
  }
}

module.exports = new AIService();
