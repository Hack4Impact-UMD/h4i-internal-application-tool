import express from "express";
import authRouter from "./routes/auth";
import applicationRouter from "./routes/application";
import reviewRouter from "./routes/review";
import bodyParser from "body-parser";
// import { uploadMockData } from "./utils/mockData";

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/application", applicationRouter)
app.use("/review", reviewRouter)

app.get("/", (_, res) => {
  // uploadMockData()
  res.status(200).json({
    status: "OK"
  })
})

export default app;

