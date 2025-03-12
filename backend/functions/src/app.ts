import express from "express";
import helloRouter from "./routes/hello";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser);

app.use("/hello", helloRouter);
app.use("/auth", authRouter);

export default app;

