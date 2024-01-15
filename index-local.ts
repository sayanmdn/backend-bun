import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose, { Connection } from "mongoose";
import authRouter from "./src/routes/auth";
import postRoute from "./src/routes/private";
import teachersRouter from "./src/routes/teachers";
import studentRouter from "./src/routes/students";
import { DEFAULT_SERVER_RESPONSE } from "./src/constant";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8080;

app.use("/user", authRouter);
app.use("/post", postRoute);
app.use("/teachers", teachersRouter);
app.use("/students", studentRouter);

app.get("/", (_req, res) => {
  res.send(DEFAULT_SERVER_RESPONSE);
});

const username: string | undefined = process.env.MONGO_USERNAME;
const mongo_password: string | undefined = process.env.MONGO_PASSWORD;

const uri: string = `mongodb+srv://${username}:${mongo_password}@backend-serverless.3e0kv62.mongodb.net/portfolio-db?retryWrites=true&w=majority`;

try {
  mongoose.connect(uri);

  const dbConnection: Connection = mongoose.connection;
  dbConnection.once("open", function () {
    console.log("MongoDB database connection established successfully");
  });
} catch (error) {
  console.log("Error while connection Mongodb Atlas ", error);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
