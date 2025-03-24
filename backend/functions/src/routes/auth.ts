import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { UserProfile, UserRegisterForm, userRegisterFormSchema } from "../models/user";
import { CollectionReference } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin"
import { isAuthenticated } from "../middleware/authentication";
import { FirebaseAuthError } from "firebase-admin/auth";

/* eslint new-cap: 0 */
const router = Router();

router.post("/register", [validateSchema(userRegisterFormSchema)], async (req: Request, res: Response) => {
  const registerForm = req.body as UserRegisterForm;

  try {
    const userRecord = await admin.auth().createUser({
      email: registerForm.email,
      password: registerForm.password,
      displayName: `${registerForm.firstName} ${registerForm.lastName}`,
      disabled: false,
      emailVerified: false
    })
    logger.info(`Auth user created with UID ${userRecord.uid}`)

    const collection = db.collection("users") as CollectionReference<UserProfile>

    const user: UserProfile = {
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
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      res.status(500).send(error.message)
    } else {
      res.status(500).send()
    }
  }
});

// example of an authenticated endpoint to update the user's profile
router.post("/update", [isAuthenticated, validateSchema(userRegisterFormSchema)], async (req: Request, res: Response) => {
  const registerForm = req.body as UserRegisterForm;

  const updatedUserRecord = await admin.auth().updateUser(req.token!.uid, {
    email: registerForm.email,
    password: registerForm.password,
    displayName: `${registerForm.firstName} ${registerForm.lastName}`,
    emailVerified: false
  })

  const collection = db.collection("users") as CollectionReference<UserProfile>
  await collection.doc(updatedUserRecord.uid).update({
    email: registerForm.email,
    firstName: registerForm.firstName,
    lastName: registerForm.lastName
  })

  res.status(200).send()
})

export default router;
