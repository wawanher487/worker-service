const logModel = require("../../model/log_model");
const trashModel = require("../../model/trash_model");
const logger = require("../../util/logger");

class DatabaseService {
  async saveLog(payload) {
    try {
      await logModel.create(payload);
      logger.info("[DB] Log saved successfully.");
    } catch (error) {
      logger.error(`[DB ERROR] Failed to save log: ${error.message}`);
    }
  }

  async saveTrash(payload) {
    try {
      await trashModel.create(payload);
      logger.info("[DB] Trash log saved.");
    } catch (error) {
      logger.error(`[DB ERROR] Failed to save trash log: ${error.message}`);
    }
  }
}

module.exports = new DatabaseService();
