const kafka = require('./kafkaConfig');
const kitchenService = require('../services/kitchenService');

const consumer = kafka.consumer({ groupId: 'kitchen_group' });

const consumeOrders = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log(`Received order:`, order);
      await kitchenService.processOrder(order);
    },
  });
};

const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('Kafka Consumer disconnected');
  } catch (error) {
    console.error('Error disconnecting Kafka Consumer:', error);
  }
}

module.exports = { consumeOrders, disconnectConsumer };