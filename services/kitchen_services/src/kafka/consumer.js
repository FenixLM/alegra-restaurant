const kafka = require('./kafkaConfig');
const kitchenService = require('../services/kitchenService');

const consumer = kafka.consumer({ groupId: 'kitchen_group' });

const consumeOrders = async () => {
  await consumer.connect();
  await consumer.subscribe({ topics: ['orders', 'ingredient_deliveries'], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`📩 Mensaje recibido en el topic "${topic}":`, data);

      if (topic === 'orders') {
        await kitchenService.processOrder(data);
      } else if (topic === 'ingredient_deliveries' && data.status === 'ready') {
        await kitchenService.startCooking(data.orderId);
      }
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