import express from "express";
import connectToDb from "./db/connection.js";
import authController from "./controllers/auth.controller.js";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use("/signup", authController);

app.listen(port, () => {
  connectToDb();
  console.log(`Listening on port ${port}.`);
});
