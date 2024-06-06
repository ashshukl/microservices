import "reflect-metadata";
import { Kafka, EachMessagePayload } from "kafkajs";
import Container from "typedi";
import { MailSvc } from "./services/MailSvc";

const kafka = new Kafka({
  clientId: "loggingSvc",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "notify-group" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "notify", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      const msgValue = message.value?.toString();
      let mailSvc = Container.get(MailSvc);
      mailSvc.sendMail(msgValue || "");
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
