#!/usr/bin/env node

const fs = require("fs");

/**
 * Get a list of similar projects by a set of criteria.
 */
const getSimilar = file => {
  const similar = [];

  const readStream = fs.createReadStream(file);
};

module.exports = getSimilar;
