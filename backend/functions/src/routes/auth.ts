import { Router } from "express";
import { UserRegisterForm } from "../models/userRegisterForm";

/* eslint new-cap: 0 */
const router = Router();

router.get("/register", (req, res) => {
  const registerForm = req.body as UserRegisterForm;
  res.send("hello");
});

export default router;
