/* eslint-env node */

// Comment out the unused imports if not currently in use
// import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Example HTTP function (currently commented out)
// export const helloWorld = onRequest((request, response) => {
//   // logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

// Example Firestore-triggered function
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set your SendGrid API key from functions config
sgMail.setApiKey(functions.config().sendgrid.apikey);

export const sendDonationEmail = functions.firestore
  .document("donations/{donationId}")
  .onCreate(async (snap /*, context */) => {
    const donationData = snap.data();

    // Query all users with role "receiver" from the "users" collection
    const usersSnapshot = await admin.firestore()
      .collection("users")
      .where("role", "==", "receiver")
      .get();

    const emails = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email) {
        emails.push(userData.email);
      }
    });

    if (emails.length === 0) {
      console.log("No receiver emails found");
      return null;
    }

    // Compose the email message
    const msg = {
      to: emails,
      from: "your-email@example.com", // Replace with your verified sender email
      subject: "New Food Donation Available",
      text: `A new food donation is available:\n\n${donationData.description}`,
      html: `<p>A new food donation is available:</p><p>${donationData.description}</p>`,
    };

    try {
      await sgMail.sendMultiple(msg);
      console.log("Donation email sent successfully");
    } catch (error) {
      console.error("Error sending donation email:", error);
    }

    return null;
  });