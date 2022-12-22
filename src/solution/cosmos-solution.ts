"use strict";

import { CosmosClient, Container } from "@azure/cosmos";
import "dotenv/config"
// TODO: Comments

async function getCosmosDBContainerClient(): Promise<Container> {
    console.log("\nAuthenticating credentials for Azure CosmosDB and creating a container client");

    const COSMOS_ENDOINT =
        process.env.COSMOS_ENDOINT;
    if (!COSMOS_ENDOINT) {
        throw Error('Azure CosmosDB Endpoint not found');
    }
    const COSMOS_KEY =
        process.env.COSMOS_KEY;
    if (!COSMOS_KEY) {
        throw Error('Azure CosmosDB Key not found');
    }
    const client = new CosmosClient({
        key: COSMOS_KEY,
        endpoint: COSMOS_ENDOINT
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
    const container = await getCosmosDBContainerClient();

    console.log("\nFinding the object in CosmosDB");
    const querySpec = {
        query: "SELECT * FROM collection c WHERE c.Elevation = @elevation ORDER BY c.Country ASC OFFSET 0 LIMIT @limit",
        parameters: [
            {
                name: "@elevation",
                value: elevation
            },
            {
                name: "@limit",
                value: limit
            }
        ]
    };

    const { resources: results } = await container.items.query(querySpec).fetchAll();

    if (results.length === 0) {
        throw Error('No items found matching');
    }
    for (const item of results) {
        console.log(item);
    }
}

upsertObject("7408d446-fb51-e70e-9955-560a0c966b68", 0);
findObjectsByElevation(0, 5);