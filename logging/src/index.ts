import { Kafka, EachMessagePayload } from "kafkajs";

const kafka = new Kafka({
  clientId: "loggingSvc",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "log-group" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "log", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      const msgValue = message.value?.toString();
      console.log(`Logged message ${msgValue}`);
    },
  });
};

runConsumer().catch((e) =>
  console.error(`[kafka/log-consumer] ${e.message}`, e)
);

process.on("SIGNT", async () => {
  console.log("Disconnecting log-Consumer...");
  await consumer.disconnect();
  process.exit(0);
});
