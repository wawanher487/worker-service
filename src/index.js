const logger = require("./util/logger");
const controller = require("./controller/logController");
const rmqService = require("./service/messageBroker");

class Worker {
  async workerConsumer(channel) {
    try {
      await channel.assertQueue(process.env.QUE, {
        durable: false,
        arguments: 60000 ? { "x-message-ttl": 60000 } : {
          
        }, // Add TTL if provided
      });

      channel.consume(
        process.env.QUE,
        async (msg) => {
          logger.info("Sensor data detected...");
          controller.processData(channel, msg);
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async workerPublisher(channel) {
    const payload = {
      workerGUID: process.env.GUID,
      status: "OK",
      information: "Worker-xx-run",
    };
    await rmqService.publishToRabbitMQ(channel, payload);
  }
}

module.exports = new Worker();
