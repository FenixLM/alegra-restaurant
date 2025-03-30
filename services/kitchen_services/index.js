const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'kitchen-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'kitchen-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log(`Processing order: ${order.orderId} - Item: ${order.item}`);
      
      // Simular preparación del pedido
      setTimeout(async () => {
        console.log(`Order ready: ${order.orderId}`);
      }, 3000);
    }
  });
};

run().catch(console.error);
