import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { isAuthenticated } from "../middleware/authentication"
import { User, UserRegisterForm, userRegisterFormSchema } from "../models/user";
import { CollectionReference } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

/* eslint new-cap: 0 */
const router = Router();

router.post("/register", [isAuthenticated, validateSchema(userRegisterFormSchema)], async (req: Request, res: Response) => {
  const registerForm = req.body as UserRegisterForm;

  // make sure that the user requesting to register is logged in and is requesting to register with their actual id
  if (req.token == undefined || req.token.uid != registerForm.id) res.status(401).send("Unauthorized!")

  const collection = db.collection("users") as CollectionReference<User>

  const user: User = {
    id: registerForm.id,
    email: registerForm.email,
    firstName: registerForm.firstName,
    lastName: registerForm.lastName,
    role: "applicant", // by default, everyone is set to applicant. higher privelages can only be assigned by super-reviewers
    activeApplications: [],
    inactiveApplications: []
  }

  await collection.doc(registerForm.id).create(user)

  logger.info(`Successfully registered user ${user.firstName} ${user.lastName} (${user.email}) with ID: ${user.id}!`)

  res.send(user);
});

export default router;
