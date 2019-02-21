#!/usr/bin/env node

// Get environment variables from .env configuration file.
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const split2 = require("split2");
const elasticsearch = require("elasticsearch");

/**
 * Push records/projects to a given Elasticsearch index.
 */
const pushRecords = async () => {
  const { ES_LOCAL_ENDPOINT, INDEX: index, TYPE } = process.env;

  try {
    const options = { host: ES_LOCAL_ENDPOINT, index };
    const client = elasticsearch.Client(options);

    // We'll read results continuously in order to save memory.
    const fileRead = fs.createReadStream(path.resolve("./results.ndjson"));

    return new Promise((resolve, reject) => {
      fileRead
        .pipe(split2(JSON.parse))
        .on("error", e => reject(e))
        .on("data", async chunk => {
          const body = chunk._source;

          await client.index({
            index,
            type: TYPE,
            body
          });
        })
        .on("error", e => reject(e))
        .on("finish", () => resolve("Results uploaded successfully."));
    });
  } catch (e) {
    return console.error(e);
  }
};

pushRecords();
