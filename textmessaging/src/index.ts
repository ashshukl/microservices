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

  //This is for consuming messages one by one

  // await consumer.run({
  //   eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
  //     const msgValue = message.value?.toString();
  //     let mailSvc = Container.get(MailSvc);
  //     mailSvc.sendMail(msgValue || "");
  //   },
  // });

  //This is for consuming messages in Batches

  await consumer.run({
    eachBatchAutoResolve: true,
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat,
      commitOffsetsIfNecessary,
      uncommittedOffsets,
      isRunning,
      isStale,
      pause,
    }) => {
      for (let message of batch.messages) {
        const msgValue = message.value?.toString();
        let mailSvc = Container.get(MailSvc);
        mailSvc.sendMail(msgValue || "");

        resolveOffset(message.offset);
        await heartbeat();
      }
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
