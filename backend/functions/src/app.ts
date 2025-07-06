import express from "express";
import authRouter from "./routes/auth";
import statusRouter from "./routes/status"
import applicationRouter from "./routes/application";
import interviewRouter from "./routes/interview";
import bodyParser from "body-parser";
// import { uploadMockData } from "./utils/mockData";

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/status", statusRouter);
app.use("/application", applicationRouter);
app.use("/interview", interviewRouter);

app.get("/", (_, res) => {
  // uploadMockData()
  res.status(200).json({
    status: "OK"
  })
})

export default app;

