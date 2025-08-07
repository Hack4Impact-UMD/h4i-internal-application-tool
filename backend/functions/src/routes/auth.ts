import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { UserProfile, UserRegisterForm, userRegisterFormSchema, updateUserSchema } from "../models/user";
import { CollectionReference, DocumentReference, Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin"
import { isAuthenticated } from "../middleware/authentication";
import { FirebaseAuthError } from "firebase-admin/auth";

/* eslint new-cap: 0 */
const router = Router();

router.post("/register", [validateSchema(userRegisterFormSchema)], async (req: Request, res: Response) => {
  const registerForm = req.body as UserRegisterForm;

  try {
    if (!registerForm.email.trim().endsWith("umd.edu") && !registerForm.email.trim().endsWith("hack4impact.org")) {
      res.status(400).send("Only emails ending in umd.edu or hack4impact.org are allowed!")
      return;
    }

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
      dateCreated: Timestamp.now(),
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

router.post("/update", [isAuthenticated, validateSchema(updateUserSchema)], async (req: Request, res: Response) => {
  const updateForm = req.body as UserRegisterForm;
  const uid = req.token!.uid;

  try {
    const updatedUserRecord = await admin.auth().updateUser(uid, {
      email: updateForm.email,
      displayName: `${updateForm.firstName} ${updateForm.lastName}`,
    });

    logger.info(`Successfully updated auth user for UID: ${updatedUserRecord.uid}`);

    // will throw if doc doesn't exist
    const userRef = db.collection("users").doc(uid) as DocumentReference<UserProfile>;
    await userRef.update({
      email: updateForm.email,
      firstName: updateForm.firstName,
      lastName: updateForm.lastName
    });

    logger.info(`Successfully updated user doc for UID: ${updatedUserRecord.uid}`);

    // fetch updated user to return, necessary to update app state immediately
    const finalSnap = await userRef.get();
    const finalUser = finalSnap.data();

    if (!finalUser) {
      logger.error(`User doc undefined after update for UID: ${uid}`);
      return res.status(500).send("User profile could not be retrieved after update.");
    }

    return res.status(200).json(finalUser);
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      return res.status(500).send(error.message)
    } else {
      return res.status(500).send()
    }
  }
});


export default router;
