"use strict";

import { CosmosClient, Container } from "@azure/cosmos";
import "dotenv/config"

// Function creates cosmos container client and authenticates
async function getCosmosDBContainerClient(): Promise<Container> {
    console.log("\nAuthenticating credentials for Azure CosmosDB and creating a container client");

    const COSMOS_ENDPOINT =
        process.env.COSMOS_ENDPOINT;
    if (!COSMOS_ENDPOINT) {
        throw Error('Azure CosmosDB Endpoint not found');
    }
    const COSMOS_KEY =
        process.env.COSMOS_KEY;
    if (!COSMOS_KEY) {
        throw Error('Azure CosmosDB Key not found');
    }
    const client = new CosmosClient({
        key: COSMOS_KEY,
        endpoint: COSMOS_ENDPOINT
    });

    const COSMOS_DATABASE =
        process.env.COSMOS_DATABASE;
    if (!COSMOS_DATABASE) {
        throw Error('Azure CosmosDB Database Name not found');
    }

    const COSMOS_CONTAINER =
        process.env.COSMOS_CONTAINER;
    if (!COSMOS_CONTAINER) {
        throw Error('Azure CosmosDB Container Name not found');
    }
    const container = await client.database(COSMOS_DATABASE).container(COSMOS_CONTAINER);
    return container;
}

// Function upserts aka updates an exisiting entry in cosmos db
// Finds object based on id and partion key value
// id is uuid and partition key is Elevation
// current value id: 7408d446-fb51-e70e-9955-560a0c966b68 
// corresponding elevation i.e. partion key: 0
async function upsertObject(id: string, partitionKey: number): Promise<void> {
    const container = await getCosmosDBContainerClient();

    console.log("\nUpdating an object in CosmosDB");
    const item = await container.item(id, partitionKey);
    const { resource: volcano } = await item.read();
    let dateTime = new Date().toISOString();
    volcano.Region = `Chile-S (${dateTime})`

    const { resource: updatedVolcano } = await container.items.upsert(volcano)
    console.log(updatedVolcano);
}

async function findObjectsByElevation(elevation: number, limit: number): Promise<void> {
    // TODO: query top 5 items from collection
    // where Elevation = input parameter (a number) in our case 0
    // order by ascending on Country
    // OFFSET 0 is to start at the begining
    // LIMIT 5 cuts off the result at 5 items
    // elevation and limit should be parameterized
    // The cosmos query to run
    // SELECT * FROM collection c WHERE c.Elevation = 0 ORDER BY c.Country ASC OFFSET 0 LIMIT 5
    // 
}

upsertObject("7408d446-fb51-e70e-9955-560a0c966b68", 0);
// findObjectsByElevation(0, 5);