require('dotenv').config();
const sendOtpEmail = require('./services/mailService');

(async () => {
    try {
        const testRecipient = "kals.devhub@gmail.com"; // Replace with your email
        const otp = Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP
        const info = await sendOtpEmail(testRecipient, otp);
        console.log("✅ Email sent:", info.response);
    } catch (err) {
        console.error("❌ Failed to send email:", err);
    }
})();
