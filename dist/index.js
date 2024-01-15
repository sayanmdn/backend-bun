// import express from "express";
// import serverless from "serverless-http";
// import { connect } from "mongoose";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import cors from "cors";
// import authRouter from "./routes/auth";
// import postRoute from "./routes/private";
// import teachersRouter from "./routes/teachers";
// import studentRouter from "./routes/students";
// import { DEFAULT_SERVER_RESPONSE } from "./constant";
// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/user", authRouter);
// app.use("/post", postRoute);
// app.use("/teachers", teachersRouter);
// app.use("/students", studentRouter);
// app.get("/", (_req, res) => {
//   res.send(DEFAULT_SERVER_RESPONSE);
// });
// const username: string | undefined = process.env.MONGO_USERNAME;
// const mongo_password: string | undefined = process.env.MONGO_PASSWORD;
// const uri: string = `mongodb+srv://${username}:${mongo_password}@backend-serverless.3e0kv62.mongodb.net/portfolio-db?retryWrites=true&w=majority`;
// try {
//   connect(uri);
// } catch (error) {
//   console.log("Error while connection Mongodb Atlas ", error);
// }
// module.exports.handler = serverless(app);
//# sourceMappingURL=index.js.map