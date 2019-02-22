#!/usr/bin/env node

// Get environment variables from .env configuration file.
require("dotenv").config();

const getProjectMapping = require("./mappings/project");
const elasticsearch = require("elasticsearch");

/**
 * Creates an Elasticsearch index.
 */
const createIndex = async () => {
  const { ES_LOCAL_ENDPOINT, INDEX: index } = process.env;
  const projectMapping = getProjectMapping();

  try {
    const client = elasticsearch.Client({ host: ES_LOCAL_ENDPOINT, index });

    const exists = await client.indices.exists({ index });

    if (!exists) {
      await client.indices.create({
        index,
        body: projectMapping
      });
    }
  } catch (e) {
    return console.error(e);
  }
};

createIndex();
