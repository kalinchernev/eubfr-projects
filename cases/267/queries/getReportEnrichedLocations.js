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
 * Scroll through records and accumulate information about:
 * - overall number of locations
 * - number of enriched locations
 */
const getReportEnrichedLocations = async () => {
  const { ES_REMOTE_ENDPOINT, INDEX, TYPE } = process.env;

  if (!ES_REMOTE_ENDPOINT) {
    console.log("The environment variable ES_REMOTE_ENDPOINT is not set.");
    console.log("You are currently working with localhost:9200, the default.");
  }

  try {
    let pagination = 0;
    let locationsCount = 0;
    let locationsEnrichedCount = 0;
    // Either take this from an example demo dashboard or deduct it via producer + file name of raw ingested file.
    const computedKey = "euinvest/cfb25a6c-b1b6-4499-8839-bded773554b4.csv";

    // Get user's AWS credentials and region
    const credentials = await getUserCredentials();

    const { region } = credentials;
    const { accessKeyId, secretAccessKey } = credentials.credentials;

    // Elasticsearch client configuration.
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

    // @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_search
    const results = await client.search({
      index: INDEX,
      type: TYPE,
      scroll: "10m",
      q: `computed_key:"${computedKey}.ndjson"`,
      body: {
        size: 1000,
        query: {
          exists: {
            field: "project_locations"
          }
        }
      }
    });

    let { hits, _scroll_id } = results;

    while (hits && hits.hits.length) {
      pagination += hits.hits.length;
      console.log(`${pagination} of ${hits.total}`);

      hits.hits.forEach(record => {
        const locations = record._source.project_locations;

        const locationsInRecord = locations.length;
        locationsCount += locationsInRecord;

        const enrichedLocationsInRecord = locations.filter(
          location => location.enriched
        ).length;
        locationsEnrichedCount += enrichedLocationsInRecord;
      });

      const next = await client.scroll({
        scroll_id: _scroll_id,
        scroll: "10m"
      });

      hits = next.hits;
      _scroll_id = next._scroll_id;
    }

    console.log(`# locations: ${locationsCount}`);
    console.log(`# enriched: ${locationsEnrichedCount}`);
  } catch (e) {
    return console.error(e);
  }
};

getReportEnrichedLocations();
