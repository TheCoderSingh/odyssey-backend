const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
