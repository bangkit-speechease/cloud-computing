const nodemailer = require("nodemailer");

// Create a Transporter for Sending Emails (via Gmail)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to Send Verification Email
const sendVerificationEmail = async (email, verificationLink) => {
  const mailOptions = {
    from: '"SpeechEase" <entalk3@gmail.com>',
    to: email,
    subject: "Email Verification",
    html: `<p>Hi,</p>
           <p>Thank you for registering. Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">Verify Email</a>
           <p>If you didn’t request this, you can safely ignore this email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

module.exports = sendVerificationEmail;
