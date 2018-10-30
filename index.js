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
 * Get all records/projects out of a given Elsaticsearch index.
 */
const getAllProjects = async () => {
  const { ENDPOINT, INDEX, TYPE } = process.env;
  const results = [];

  try {
    // Get user's AWS credentials and region
    const credentials = await getUserCredentials();

    const { region } = credentials;
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    // Elasticsearch client configuration
    const options = {
      host: ENDPOINT,
      connectionClass,
      apiVersion: "6.2",
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
      scroll: "10s",
      body: {
        query: {
          match_all: {}
        }
      }
    });

    let { hits, _scroll_id } = start;

    while (hits && hits.hits.length) {
      // Append all new hits
      results.push(...hits.hits);

      console.log(`${results.length} of ${hits.total}`);

      const next = await client.scroll({
        scroll_id: _scroll_id,
        scroll: "10s"
      });

      hits = next.hits;
      _scroll_id = next._scroll_id;
    }

    return fs.writeFileSync(
      "./results.json",
      JSON.stringify({ data: results })
    );
  } catch (e) {
    return console.error(e);
  }
};

getAllProjects();
