# ref-doc-study
Repository to run study on Microsoft Reference docs

# Tasks
You need to run 3 tasks for this study, for each task a sample task has been provided.
|#|Sample|Task|
|---|---|---|
1|[Print contents of a blob in Azure Storage](src/storage.ts?plain=1#L37)| Print name of all blob files in Azure Storage container|
2|[Send 10 messages to Azure Event Hub](src/event-hub.ts?plain=1#19)| Recieve and print messages from Azure Event Hub|
3|[Update an item in Cosmos DB (NoSQL)](src/cosmos.ts?plain=1#45)| Query and print top 5 items, where elevation = 0


# Executing the tasks

## `.env` file
`.env` file has most of the environment variables
```properties
COSMOS_ENDOINT=
COSMOS_DATABASE=
COSMOS_CONTAINER=
EVENTHUB_NAME=
```

Three environment variables must be created before running the code
```bash
export AZURE_STORAGE_CONNECTION_STRING = <value>
export COSMOS_KEY = <value>
export EVENTHUB_CONNECTION_STRING = <value>
```
These values will be provided to you by your study coordinator

## Clean build directories
```bash
npm run clean
```
## Compile
```bash
npm run compile
```
## Executing tasks
```bash
# run storage task
npm run storage

# run event-hub task
npm run event-hub

# run cosmos db task
npm run cosmos
```
# Solutions
If you are stuck check the solutions in the [solution directory](src/solution).
## Executing solutions
```bash
# run storage task
npm run storage-solution

# run event-hub task
npm run event-hub-solution

# run cosmos db task
npm run cosmos-solution
```