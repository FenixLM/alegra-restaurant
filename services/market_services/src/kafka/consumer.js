const kafka = require('./kafkaConfig');
const {sendMessage} = require('./producer');
const marketService = require('../services/marketService');

const consumer = kafka.consumer({ groupId: 'market_group' });

const consumeMarketOrders = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'market_orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      console.log('Conectado al topic:', topic);
      console.log('Mensaje recibido:', message.value.toString());
      const data = JSON.parse(message.value.toString());
      console.log(`📩 Mensaje recibido en el topic "${topic}":`, data);

     const shoppingResult = await Promise.all(
        data.missingIngredients.map(async (ingredient) => {
          const result = await marketService.buyIngredient(ingredient.name);
          return result;
        })
      );

      console.log('🛒 Resultados de la compra:', shoppingResult);

      await sendMessage('ingredient_deliveries', {
        orderRequest: data.orderRequest,
        ingredients: shoppingResult,
      });
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

module.exports = { consumeMarketOrders, disconnectConsumer };