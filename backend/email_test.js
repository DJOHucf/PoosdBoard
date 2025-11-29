import nodemailer from 'nodemailer';
const GOOGLE_PASS = process.env.GOOGLE_PASS;

// Create transporter link for email verification
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "renblas.dev@gmail.com",
    pass: GOOGLE_PASS,
  },
});

console.log("Verifying email transporter...");
(async () => {
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Email transporter verification failed:", err);
  }
})();