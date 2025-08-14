import express from "express";
import authRouter from "./routes/auth";
import statusRouter from "./routes/status"
import applicationRouter from "./routes/application";
import interviewRouter from "./routes/interview";
import bodyParser from "body-parser";
import cors from "cors"
// import { uploadMockData } from "./utils/mockData";

const app = express();

const ALLOWED_ORIGINS = [
  "https://h4i-applications.web.app",
  "https://apply.umd.hack4impact.org",
  "https://h4i-applications--pr54-reviewer-side-testin-9exyqrca.web.app",
  "http://localhost:5173"
]

app.use(cors({
  origin: ALLOWED_ORIGINS
}))

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

