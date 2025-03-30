const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('debug', true);

const RecipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [
    {
      ingredient: String,
      quantity: String,
    }
  ],
  instructions: String
}, { collection: 'recipes' });

const Recipe = mongoose.model('Recipe', RecipeSchema);

const kafka = new Kafka({
  clientId: 'kitchen-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'kitchen-group' });
const producer = kafka.producer();

const prepareDish = async (order) => {
  const recipes = await Recipe.find();

  const selectedRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  console.log(`Preparando plato: ${selectedRecipe.name}`);
    setTimeout(async () => {
      await producer.connect();
      await producer.send({
        topic: 'prepared-orders',
        messages: [{ value: JSON.stringify({ orderId: order.id, dish: selectedRecipe.name }) }],
      });
    }, 5000);
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      prepareDish(order);
    },
  });
};

run().catch(console.error);
