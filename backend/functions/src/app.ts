import express from "express";
import helloRouter from "./routes/hello";

const app = express();

app.use("/hello", helloRouter);

export default app;

