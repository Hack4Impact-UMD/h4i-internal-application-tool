import { Router, Request, Response } from "express";
import { db } from "../index";
import { validateSchema } from "../middleware/validation";
import { ApplicationResponse, AppResponseForm, appResponseFormSchema } from "../models/appResponse";
import { CollectionReference } from "firebase-admin/firestore";

const router = Router();

// should i add isAuthenticated here?
router.post("/submit", [validateSchema(appResponseFormSchema)], async (req: Request, res: Response) => {
  const applicationResponse = req.body as AppResponseForm;

  const collection = db.collection("applications") as CollectionReference<ApplicationResponse>
  await collection.doc(applicationResponse.id).update({
    status: "submitted",
    dateSubmitted: new Date().toISOString(),
  })

  res.status(200).send()
})


export default router;
