import { Request, Response, NextFunction } from "express";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin"

// from the code sample here: https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/authorized-https-endpoint/functions/index.js
// NOTE: When a request is successfully authenticated, this middleware will set the `req.token` property
// to the decoded authentication token (DecodedIdToken)
export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  logger.log("Check if request is authorized with Firebase ID token");

  if ((!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)) {
    logger.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      "or by passing a \"__session\" cookie."
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    logger.log("Found \"Authorization\" header");
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    logger.log("Found \"__session\" cookie");
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    logger.log("ID Token correctly decoded", decodedIdToken);
    req.token = decodedIdToken;
    next();
    return;
  } catch (error) {
    logger.error("Error while verifying Firebase ID token:", error);
    res.status(403).send("Unauthorized");
    return;
  }
}
