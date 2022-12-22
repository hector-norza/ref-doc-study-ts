"use strict";

const { EventHubProducerClient } = require("@azure/event-hubs");
import "dotenv/config"

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

// Function produces 10 messages in a batch and sends to Event Hub
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
    // TODO: consume and print all the messages in the event hub
    // To consume the messages first run the produceEventHubMessage function 
    // and then run the consume function
    // Consumer group = "$Default"
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
//consumeEventHubMessage();