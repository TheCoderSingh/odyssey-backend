import express from "express";
import connectToDb from "./db/connection.js";
import { signup, login, logout } from "./controllers/auth.controller.js";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use("/signup", signup);
app.use("/login", login);
app.use("/logout", logout);

app.listen(port, () => {
  connectToDb();
  console.log(`Listening on port ${port}.`);
});
