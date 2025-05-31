const amqp = require("amqplib");
const mongoose = require("mongoose");

async function RabbitMConnection() {
  try {
    const connectionString = `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/${process.env.RMQ_VHOST}?heartbeat=60`;
    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();
    console.log("Connected to Broker...");
    return channel;
  } catch (error) {
    console.error(error);
  }
}

async function connectToMongoDB() {
  try {
    const uri = process.env.DATABASE;
    mongoose.set("strictQuery", true);
    mongoose.connect(uri);
    console.log("Connection Database Successful...");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  RabbitMConnection,
  connectToMongoDB,
};
