import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema, validateAuth } from "../middleware/validation";
import { User, UserRegisterForm, userRegisterFormSchema } from "../models/user";
import { CollectionReference } from "firebase-admin/firestore";

/* eslint new-cap: 0 */
const router = Router();

router.post("/register", [validateAuth, validateSchema(userRegisterFormSchema)], async (req: Request, res: Response) => {
  const registerForm = req.body as UserRegisterForm;

  // make sure that the user requesting to register is logged in and is requesting to register with the same id
  if (req.token == undefined || req.token.uid != registerForm.id) res.status(401).send("Unauthorized!")

  const collection = db.collection("users") as CollectionReference<User>

  const user: User = {
    email: registerForm.email,
    firstName: registerForm.firstName,
    lastName: registerForm.lastName,
    role: "applicant", // by default, everyone is set to applicant. higher privelages can only be assigned by super-reviewers
    activeApplications: [],
    inactiveApplications: []
  }

  await collection.doc(registerForm.id).create(user)

  res.send({
    id: registerForm.id,
    ...user
  });
});

export default router;
