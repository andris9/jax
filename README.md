# jax

Convert JSON to XML. Useful for converting Google API JSON structures back to XML.

## Installation

    npm install jax

## Usage

    var jax = require("jax");

    inputJSON = fs.readFileSync("data.json", "utf-8");
    outputXML = jax(input);

## License

MIT