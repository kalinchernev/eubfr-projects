#!/usr/bin/env node

// Get environment variables from .env configuration file.
require("dotenv").config();

const elasticsearch = require("elasticsearch");

/**
 * Creates an Elasticsearch index.
 */
const deleteIndex = async () => {
  const { ES_LOCAL_ENDPOINT, INDEX: index } = process.env;

  try {
    const client = elasticsearch.Client({ host: ES_LOCAL_ENDPOINT, index });

    await client.indices.delete({ index });

    console.log(`Successfully deleted index: ${index}.`);
  } catch (e) {
    return console.error(e);
  }
};

deleteIndex();
