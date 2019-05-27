#!/usr/bin/env node

// Get environment variables from .env configuration file.
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const split2 = require("split2");
const through2Batch = require("through2-batch");
const elasticsearch = require("elasticsearch");

const SaveStream = require("./lib/SaveStream");

/**
 * Push records/projects to a given Elasticsearch index.
 */
const pushRecords = async () => {
  const { ES_LOCAL_ENDPOINT, INDEX: index } = process.env;

  try {
    const options = { host: ES_LOCAL_ENDPOINT, index };
    const client = elasticsearch.Client(options);

    const saveStream = new SaveStream({ objectMode: true, client, index });

    // We'll read results continuously in order to save memory.
    const fileRead = fs.createReadStream(path.resolve("./results.ndjson"));

    return new Promise((resolve, reject) => {
      fileRead
        .pipe(split2(JSON.parse))
        .on("error", e => reject(e))
        .pipe(
          through2Batch.obj({ batchSize: 100 }, (batch, _, cb) => {
            const improvedBatch = batch.map(item => item._source);

            saveStream.write(improvedBatch, cb);
          })
        )
        .on("error", e => reject(e))
        .pipe(saveStream)
        .on("finish", () => {
          console.log("Done");
          resolve();
        });
    });
  } catch (e) {
    return console.error(e);
  }
};

pushRecords();
