const Otp = require('../models/Otp');
const sendOtpEmail = require('../services/mailService');
const User = require('../models/User'); // Assuming you have a User model
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.deleteMany({ email }); // remove old OTPs
        await Otp.create({
            email,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min expiry
        });
        // Send email using the reusable service
        await sendOtpEmail(email, otpCode);

        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending OTP', error });
    }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    // Update user to active & verified
    await User.updateOne(
      { email },
      { $set: { status: '1', isEmailVerified: true } }
    );

    // Remove used OTP
    await Otp.deleteMany({ email });

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP', error });
  }
};


module.exports = { sendOtp, verifyOtp };
