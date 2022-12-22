"use strict";

const { EventHubProducerClient, EventHubConsumerClient, earliestEventPosition } = require("@azure/event-hubs");
import { Constants } from "@azure/core-amqp";
import "dotenv/config"
// TODO: Comments

const EVENTHUB_CONNECTION_STRING =
    process.env.EVENTHUB_CONNECTION_STRING;
if (!EVENTHUB_CONNECTION_STRING) {
    throw Error('Azure Event Hub connection string not found');
}

const EVENTHUB_NAME =
    process.env.EVENTHUB_NAME;
if (!EVENTHUB_NAME) {
    throw Error('Azure Event Hub name not found');
}

async function produceEventHubMessage(eventsToSend: string[]): Promise<void> {
    console.log("\nAuthenticating credentials for Azure Event Hubs and creating a producer client");
    const producer = new EventHubProducerClient(EVENTHUB_CONNECTION_STRING, EVENTHUB_NAME);

    const batchOptions = {
        maxSizeInBytes: 100 * 1024
    }
    const batch = await producer.createBatch(batchOptions);

    let i = 0;
    while (i < eventsToSend.length) {
        const isAdded = batch.tryAdd({ body: eventsToSend[i] });
        if (isAdded) {
            console.log(`Added eventsToSend[${i}] to the batch`);
            ++i;
            continue;
        }
    }
    console.log("\nSending Event Hub message");
    await producer.sendBatch(batch);

    await producer.close();
}

async function consumeEventHubMessage(): Promise<void> {
    console.log("\nAuthenticating credentials for Azure Event Hubs and creating a consumer client");
    const consumerClient = new EventHubConsumerClient(Constants.defaultConsumerGroup, EVENTHUB_CONNECTION_STRING, EVENTHUB_NAME);

    const subscription = consumerClient.subscribe(
        {
            processEvents: async (events, context) => {
                for (const event of events) {
                    console.log(
                        `Received event: '${event.body}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`
                    );
                }
            },
            processError: async (err, context) => {
                console.log(`Error on partition "${context.partitionId}": ${err}`);
            },
        },
        { startPosition: earliestEventPosition }
    );

    setTimeout(async () => {
        await subscription.close();
        await consumerClient.close();
        console.log(`Exiting consume events`);
    }, 30 * 1000);

}


let dateTime = new Date().toISOString();
const eventsToSend = [
    `First (${dateTime})`,
    `Second (${dateTime})`,
    `Third (${dateTime})`,
    `Fourth (${dateTime})`,
    `Fifth (${dateTime})`,
    `Sixth (${dateTime})`,
    `Seventh (${dateTime})`,
    `Eighth (${dateTime})`,
    `Nineth (${dateTime})`,
    `Tenth (${dateTime})`
];
produceEventHubMessage(eventsToSend);
consumeEventHubMessage();