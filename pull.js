#!/usr/bin/env node

// Get environment variables from .env configuration file.
require("dotenv").config();

const fs = require("fs");
const { promisify } = require("util");
const AWS = require("aws-sdk");
const awscred = require("awscred");
const connectionClass = require("http-aws-es");
const elasticsearch = require("elasticsearch");

const getUserCredentials = promisify(awscred.load);

/**
 * Get all records/projects out of a given Elasticsearch index.
 */
const getAllProjects = async () => {
  const { ES_REMOTE_ENDPOINT, INDEX, TYPE } = process.env;
  let pagination = 0;

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

    const start = await client.search({
      index: INDEX,
      type: TYPE,
      scroll: "10m",
      body: {
        size: 3000,
        query: {
          match_all: {}
        }
      }
    });

    let { hits, _scroll_id } = start;

    // We'll put results continuously in order to save memory.
    const file = fs.createWriteStream("./results.ndjson");

    while (hits && hits.hits.length) {
      pagination += hits.hits.length;
      console.log(`${pagination} of ${hits.total}`);

      hits.hits.forEach(result => file.write(`${JSON.stringify(result)}\n`));

      const next = await client.scroll({
        scroll_id: _scroll_id,
        scroll: "10m"
      });

      hits = next.hits;
      _scroll_id = next._scroll_id;
    }

    return file.end();
  } catch (e) {
    return console.error(e);
  }
};

getAllProjects();
