// cloudfunction.js
import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import { createRequire } from "module";
import express from "express";
import cors from "cors";

// Create an Express application
const app = express();

// Enable JSON parsing and allow cross-origin requests (if needed)
app.use(express.json());
app.use(cors());

// Use createRequire to load the service account JSON file
const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin using your service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Uncomment and update if you need the database URL:
  // databaseURL: "https://your-project-id.firebaseio.com"
});

// Set your SendGrid API key (best practice: store this as an environment variable)
sgMail.setApiKey(import.meta.env.TWILIO_API);

//
// Endpoint to send donation details to organizations
//
app.post('/sendDonationEmail', async (req, res) => {
  try {
    // Get donation data from the request body; expect all necessary fields.
    const donationData = req.body;

    // Query Firestore for users with the role "receiver"
    const usersSnapshot = await admin.firestore()
      .collection("organizations")
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
      return res.status(404).send("No receiver emails found");
    }

    // Construct the email message with detailed donation fields
    const emailText = `
New Food Donation Details:

Food Type: ${donationData.foodType}
Quantity: ${donationData.quantity}
Expiry Date: ${donationData.expiryDate}
Pickup Address: ${donationData.pickupAddress}
Pickup Time: ${donationData.pickupTime}
Organization: ${donationData.organization || 'N/A'}
Description: ${donationData.description}
Phone: ${donationData.phone}
Email: ${donationData.email}
UPI ID: ${donationData.upiId}
    `;

    const emailHtml = `
      <h3>New Food Donation Details</h3>
      <ul>
        <li><strong>Food Type:</strong> ${donationData.foodType}</li>
        <li><strong>Quantity:</strong> ${donationData.quantity}</li>
        <li><strong>Expiry Date:</strong> ${donationData.expiryDate}</li>
        <li><strong>Pickup Address:</strong> ${donationData.pickupAddress}</li>
        <li><strong>Pickup Time:</strong> ${donationData.pickupTime}</li>
        <li><strong>Organization:</strong> ${donationData.organization || 'N/A'}</li>
        <li><strong>Description:</strong> ${donationData.description}</li>
        <li><strong>Phone:</strong> ${donationData.phone}</li>
        <li><strong>Email:</strong> ${donationData.email}</li>
        <li><strong>UPI ID:</strong> ${donationData.upiId}</li>
      </ul>
    `;

    // Compose the email message using the donation details
    const msg = {
      to: emails,
      from: "adityalalhere@gmail.com", // Replace with your verified sender email
      subject: "New Food Donation Available",
      text: emailText,
      html: emailHtml,
    };

    // Send the email via SendGrid
    await sgMail.sendMultiple(msg);
    console.log("Donation email sent successfully");
    res.status(200).send("Donation email sent successfully");
  } catch (error) {
    console.error("Error sending donation email:", error);
    res.status(500).send("Error sending donation email");
  }
});

//
// Endpoint to send acceptance email to the donor
//
app.post('/sendAcceptanceEmail', async (req, res) => {
  try {
    // Expect a payload containing at least the donor's email and donation details.
    const { email, donationDetails } = req.body;

    if (!email) {
      console.log("Donor email not provided");
      return res.status(400).send("Donor email is required");
    }

    // Construct the acceptance email content.
    const emailText = `
Dear Donor,

Your food donation has been accepted. Here are the details of your donation:

Food Type: ${donationDetails.foodType}
Quantity: ${donationDetails.quantity}
Expiry Date: ${donationDetails.expiryDate}
Pickup Address: ${donationDetails.pickupAddress}
Pickup Time: ${donationDetails.pickupTime}
Organization: ${donationDetails.organization || 'N/A'}
Description: ${donationDetails.description}

Thank you for your generous contribution.

Regards,
The Food Donation Team
    `;

    const emailHtml = `
      <h3>Food Donation Accepted</h3>
      <p>Dear Donor,</p>
      <p>Your food donation has been accepted. Here are the details:</p>
      <ul>
        <li><strong>Food Type:</strong> ${donationDetails.foodType}</li>
        <li><strong>Quantity:</strong> ${donationDetails.quantity}</li>
        <li><strong>Expiry Date:</strong> ${donationDetails.expiryDate}</li>
        <li><strong>Pickup Address:</strong> ${donationDetails.pickupAddress}</li>
        <li><strong>Pickup Time:</strong> ${donationDetails.pickupTime}</li>
        <li><strong>Organization:</strong> ${donationDetails.organization || 'N/A'}</li>
        <li><strong>Description:</strong> ${donationDetails.description}</li>
      </ul>
      <p>Thank you for your generous contribution.</p>
      <p>Regards,<br/>The Food Donation Team</p>
    `;

    // Compose the acceptance email message to the donor.
    const msg = {
      to: email,
      from: "adityalalhere@gmail.com", // Replace with your verified sender email
      subject: "Your Food Donation Has Been Accepted",
      text: emailText,
      html: emailHtml,
    };

    // Send the email via SendGrid
    await sgMail.send(msg);
    console.log("Acceptance email sent successfully to donor");
    res.status(200).send("Acceptance email sent successfully");
  } catch (error) {
    console.error("Error sending acceptance email:", error);
    res.status(500).send("Error sending acceptance email");
  }
});

// Catch-all route so that any request to the cloud function receives a response
app.all("*", (req, res) => {
  res.status(200).send("Cloud function is live and listening for requests!");
});

// Export the Express app as a Cloud Function (if deploying as cloud function)
export const sendDonationEmailFunction = app;

// For local development, continuously listen on port 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server is continuously listening on port ${PORT}`);
});
