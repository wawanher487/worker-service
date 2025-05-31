const { saveLog, saveTrash } = require("../../service/database");
const { error: logError } = require("../../util/logger");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { broadcast } = require("../../service/webSocket");
const { publishToRabbitMQ } = require("../../service/messageBroker");
const ftp = require("basic-ftp");

class LogController {
  // Mengecek apakah file ada dan ukurannya > 0 byte
  async checkFileExistsOnFTP(filename) {
    const client = new ftp.Client();
    try {
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
      });

      const files = await client.list(process.env.FTP_FOLDER);
      const file = files.find(f => f.name === filename);
      return file && file.size > 0;
    } catch (err) {
      console.error(`[FTP ERROR] ${err.message}`);
      return false;
    } finally {
      client.close();
    }
  }

  // Proses data dari pesan queue
  async processData(channel, message) {
    const data = JSON.parse(message.content.toString());
    console.log(`[RECEIVED] ${JSON.stringify(data)}`);

    const filename = data.filename;
    const guidDevice = data.guid_camera;
    const captureTime = data.capture_time;

    const timestamp = Math.floor(new Date(captureTime).getTime() / 1000).toString();
    const datetime = moment(captureTime).format("DD-MM-YYYY HH:mm:ss");

    const payload = {
      guid: uuidv4(),
      guid_device: guidDevice,
      value: filename,
      timestamp,
      datetime,
    };

    try {
      await saveLog(payload);
      // broadcast(payload.guid_device, JSON.stringify(payload));
      // await publishToRabbitMQ(channel, 'service.ai', payload, parseInt(process.env.QUEUE_TTL, 10) || 60000);
      // console.log(`[LOGGED] ${filename}`);
    } catch (err) {
      console.error(`[PROCESS ERROR] ${err.message}`);
    }
  }
}

module.exports = new LogController();
