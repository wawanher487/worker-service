// const logger = require("../../util/logger");

// class RMQ {
//   async publishToRabbitMQ(channel, queueName, payload) {
//     try {
//       // const queueName = process.env.QUEUE_NAME;
//       await channel.assertQueue(queueName, { durable: true });
//       await channel.sendToQueue(
//         queueName,
//         Buffer.from(JSON.stringify(payload)),
//         { persistent: true }
//       );

//       logger.info("Message published to RabbitMQ", payload);
//     } catch (error) {
//       console.log(error);
//       logger.error("Error publishing message to RabbitMQ", error);
//     }
//   }
// }

// module.exports = new RMQ();
const logger = require("../../util/logger");

class RMQ {
  /**
   * Publishes a message to RabbitMQ.
   * @param {object} channel - The RabbitMQ channel instance.
   * @param {string} queueName - The name of the RabbitMQ queue.
   * @param {object} payload - The message payload to send.
   * @param {number} [ttl] - Optional TTL (in milliseconds) for the message.
   */
  async publishToRabbitMQ(channel, queueName, payload, ttl) {
    try {
      // Ensure the queue exists with proper arguments
      await channel.assertQueue(queueName, {
        durable: false,
        arguments: ttl ? { "x-message-ttl": ttl } : {}, // Add TTL if provided
      });

      // Send the message with persistence
      const options = { persistent: true };
      await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), options);

      logger.info(`Message published to queue: ${queueName}`, payload);
    } catch (error) {
      logger.error("Error publishing to RabbitMQ", error);
      throw error;
    }
  }
}

module.exports = new RMQ();

