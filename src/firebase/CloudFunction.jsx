// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Set your SendGrid API key from functions config
sgMail.setApiKey(functions.config().sendgrid.apikey);

exports.sendDonationEmail = functions.firestore
  .document('donations/{donationId}')
  .onCreate(async (snap, context) => {
    const donationData = snap.data();

    // Query all users with role "receiver" from a "users" collection
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('role', '==', 'receiver')
      .get();

    const emails = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.email) {
        emails.push(userData.email);
      }
    });

    // If no receiver emails, exit.
    if (emails.length === 0) {
      console.log('No receiver emails found');
      return null;
    }

    // Compose the email
    const msg = {
      to: emails,
      from: 'your-email@example.com', // Replace with your verified sender
      subject: 'New Food Donation Available',
      text: `A new food donation is available:\n\n${donationData.description}`,
      html: `<p>A new food donation is available:</p><p>${donationData.description}</p>`
    };

    // Send email to all receivers
    try {
      await sgMail.sendMultiple(msg);
      console.log('Donation email sent successfully');
    } catch (error) {
      console.error('Error sending donation email:', error);
    }

    return null;
  });
