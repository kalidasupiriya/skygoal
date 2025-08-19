const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 const Otp = require('../models/Otp');
 const  sendOtpEmail = require('../services/mailService');
// Register a new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user with email not verified & inactive
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      isEmailVerified: false,
      status: '2' // inactive until OTP verified
    });

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any old OTP for same email
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // expires in 10 mins
    });

    // Send OTP email
    await sendOtpEmail(email, otpCode);

    res.status(201).json({
      success: true,
      message: 'User registered. OTP sent to email.',
      userId: newUser._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check for login block
    const now = new Date();
    if (user.loginAttempts >= 3 && user.lastAttemptTime && (now - user.lastAttemptTime) < 3 * 60 * 60 * 1000) {
      const remaining = 3 * 60 * 60 * 1000 - (now - user.lastAttemptTime);
      const minutes = Math.ceil(remaining / (60 * 1000));
      return res.status(403).json({
        success: false,
        message: `Account locked due to too many failed attempts. Try again in ${minutes} minutes.`
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      // Increment loginAttempts and set lastAttemptTime
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      user.lastAttemptTime = new Date();
      await user.save();
      let attemptsLeft = 3 - user.loginAttempts;
      let msg = 'Invalid credentials';
      if (attemptsLeft > 0) {
        msg += `. You have ${attemptsLeft} attempt(s) left.`;
      } else {
        msg = 'Account locked due to too many failed attempts. Try again in 180 minutes.';
      }
      return res.status(401).json({ success: false, message: msg });
    }

    // Reset loginAttempts on successful login
    user.loginAttempts = 0;
    user.lastAttemptTime = null;
    await user.save();

    // Check status
    if (user.status === '2') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }
    if (user.status === '3') {
      return res.status(403).json({ success: false, message: 'Account is banned' });
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );
    console.log('User logged in successfully:', user);
    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .status(200)
      .json({
        success: true,
        message: 'User logged in successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status
        }
      });

  } catch (error) {
    console.log('Error logging in user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware after verifying token
  const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const logoutUser = (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
	});
	res.json({ success: true, message: 'Logged out successfully' });
}
// Update password for logged-in user
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating password', error });
  }
};

// Reset password for users who hit retry limit
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // Only allow if retry limit was hit
    if (user.loginAttempts < 3) return res.status(400).json({ success: false, message: 'Retry limit not reached' });
    user.password = await bcrypt.hash(newPassword, 10);
    user.loginAttempts = 0;
    user.lastAttemptTime = null;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password', error });
  }
};

module.exports = { registerUser, loginUser, getProfile, logoutUser, updatePassword, resetPassword }