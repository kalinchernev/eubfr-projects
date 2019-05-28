# Case EUBFR-267

Taking existing information about enrichment loops to a single field `enrichmentResults`.

## Setup

Follow the steps below to reproduce and test the target feature.

Assumes that current working directory is the project root folder.

### Prepare index

The following scripts are involved:

- `./mappings/project.js`
- `./scripts/createIndex.js`
- `./scripts/deleteIndex`

Take `./mappings/project.js` with the target changes regarding `enrichmentResults` and paste it in `./mappings/project.js` of the main project.

Run the index creation script to apply this mapping: `yarn createIndex`

### Create content

You can do this via Postman or other REST client and UI or:

```sh
curl --request POST \
  --url http://127.0.0.1:9200/test-projects/project \
  --header 'content-type: application/json' \
  --data '{
	"enrichmentResults": {
		"budget": {
			"foo": "bar"
		}
	},
	"title": "Field enrichmentResults has a property with a simple value"
}'
```

Where `data` is varying. Please check samples in `./cases/267/records/{1-6}.json` files.

### Iterate on queries

The following folder contains sample queries: `./cases/267/queries/`.

If you have [nodemon](https://nodemon.io/) you can iterate even faster like following:

```sh
$ nodemon ./cases/267/queries/getEnrichedRecords.js
```

You will see results of the queries while you iterate on the given query.
