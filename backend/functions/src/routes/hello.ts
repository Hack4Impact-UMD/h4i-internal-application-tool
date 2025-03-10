import { Router } from "express";

/* eslint new-cap: 0 */
const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from express!");
});

export default router;

