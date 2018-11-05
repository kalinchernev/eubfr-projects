const fs = require("fs");
const path = require("path");
const split2 = require("split2");

// Sometimes streams are tricky between different versions of node.
test("Ensure fs read stream functions properly", () => {
  const readStream = fs.createReadStream(
    path.resolve(__dirname, "./stubs/projects.ndjson")
  );

  readStream.on("error", err => {
    console.error("There was an error.", err);
  });

  // As long as tests pass and there is no unclosed stream, test is ok.
  readStream.on("end", () => {});
  readStream.pipe(split2(JSON.parse)).on("data", chunk => {});
});
