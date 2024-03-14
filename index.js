import express from "express";
import { config } from "dotenv";
import connectToDb from "./db/connection.js";

config();

const app = express();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  connectToDb();
  console.log(`Listening on port ${port}.`);
});
