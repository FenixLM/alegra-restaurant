const kafka = require('./kafkaConfig');
const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer conectado');
};

const sendMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
  }
};

const disconnectProducer = async () => {
    try {
        await producer.disconnect();
        console.log('Kafka Producer desconectado');
    } catch (error) {
        console.error('Error desconectando el productor de Kafka:', error);
    }
}

module.exports = { connectProducer, sendMessage, disconnectProducer };