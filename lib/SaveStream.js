const stream = require("stream");

class SaveStream extends stream.Writable {
  constructor(options) {
    super(options);
    this.client = options.client;
    this.index = options.index;
  }

  _write(batch, _, next) {
    let body = "";

    batch.forEach(document => {
      const action = {
        index: { _index: this.index, _type: "project" }
      };

      body += `${JSON.stringify(action)}\n`;
      body += `${JSON.stringify(document)}\n`;
    });

    return this.client.bulk({ body }, next);
  }
}

module.exports = SaveStream;
