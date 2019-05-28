#!/usr/bin/env node

// Get environment variables from .env configuration file.
require("dotenv").config();

const { promisify } = require("util");
const AWS = require("aws-sdk");
const awscred = require("awscred");
const connectionClass = require("http-aws-es");
const elasticsearch = require("elasticsearch");

const getUserCredentials = promisify(awscred.load);

/**
 * Get count of enriched records.
 */
const countEnrichedRecords = async () => {
  const { ES_REMOTE_ENDPOINT, INDEX, TYPE } = process.env;

  if (!ES_REMOTE_ENDPOINT) {
    console.log("The environment variable ES_REMOTE_ENDPOINT is not set.");
    console.log("You are currently working with localhost:9200, the default.");
  }

  try {
    // Get user's AWS credentials and region
    const credentials = await getUserCredentials();

    const { region } = credentials;
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    // Elasticsearch client configuration
    const options = {
      host: ES_REMOTE_ENDPOINT,
      connectionClass,
      apiVersion: "6.5",
      requestTimeout: 300000,
      awsConfig: new AWS.Config({
        accessKeyId,
        secretAccessKey,
        region
      })
    };

    const client = elasticsearch.Client(options);

    // @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_count
    const results = await client.count({
      index: INDEX,
      type: TYPE,
      body: {
        query: {
          exists: {
            field: "enrichmentResults"
          }
        }
      }
    });

    console.log(results);
  } catch (e) {
    return console.error(e);
  }
};

countEnrichedRecords();
