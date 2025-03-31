import express from "express";
import helloRouter from "./routes/hello";
import authRouter from "./routes/auth";
import applicationRouter from "./routes/application";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.use("/hello", helloRouter);
app.use("/auth", authRouter);
app.use("/application", applicationRouter)

app.get("/", (_, res) => {
  res.status(200).json({
    status: "OK"
  })
})

export default app;

