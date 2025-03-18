import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { User, UserRegisterForm, userRegisterFormSchema } from "../models/user";
import { CollectionReference } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin"

/* eslint new-cap: 0 */
const router = Router();

router.post("/register", [validateSchema(userRegisterFormSchema)], async (req: Request, res: Response) => {
  const registerForm = req.body as UserRegisterForm;

  const userRecord = await admin.auth().createUser({
    email: registerForm.email,
    password: registerForm.password,
    displayName: `${registerForm.firstName} ${registerForm.lastName}`,
    disabled: false,
    emailVerified: false
  })

  logger.info(`Auth user created with UID ${userRecord.uid}`)

  const collection = db.collection("users") as CollectionReference<User>

  const user: User = {
    id: userRecord.uid,
    email: registerForm.email,
    firstName: registerForm.firstName,
    lastName: registerForm.lastName,
    role: "applicant", // by default, everyone is set to applicant. higher privelages can only be assigned by super-reviewers
    activeApplications: [],
    inactiveApplications: []
  }

  await collection.doc(userRecord.uid).create(user)

  logger.info(`Successfully created user doc for ${user.firstName} ${user.lastName} (${user.email}) with ID: ${user.id}`)

  res.status(200).send(user);
});

export default router;
