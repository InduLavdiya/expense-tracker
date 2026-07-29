const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Login User
// ===============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// Forgot Password
// ===============================
const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Reset Link
       const resetURL =
`http://127.0.0.1:5500/frontend/pages/reset-password.html?token=${resetToken}`;

        // Email Message
        const message = `
            <h2>Password Reset Request</h2>

            <p>You requested to reset your Expense Tracker password.</p>

            <p>Click the button below:</p>

            <a href="${resetURL}"
               style="
               display:inline-block;
               padding:12px 20px;
               background:#2563EB;
               color:#fff;
               text-decoration:none;
               border-radius:6px;
               font-weight:bold;
               ">
               Reset Password
            </a>

            <p>This link will expire in <b>15 minutes</b>.</p>

            <p>If you didn't request this, you can ignore this email.</p>
        `;

        await sendEmail({

            email: user.email,

            subject: "Expense Tracker - Reset Password",

            message

        });

        res.status(200).json({

            success: true,

            message: "Password reset email sent successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ===============================
// Reset Password
// ===============================
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired Token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// Update Profile
// ===============================
const updateProfile = async (req, res) => {

    try {

        const { name } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        user.name = name || user.name;

        await user.save();

        res.status(200).json({

            success: true,
            message: "Profile Updated Successfully",

            user: {

                id: user._id,
                name: user.name,
                email: user.email,
                monthlyLimit: user.monthlyLimit

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// ===============================
// Get Profile
// ===============================
const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        res.status(200).json({

            success: true,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                monthlyLimit: user.monthlyLimit

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ===============================
// Change Password
// ===============================
const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });

        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({

            success: true,
            message: "Password Changed Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===============================
// Save Monthly Spending Limit
// ===============================
const saveMonthlyLimit = async (req, res) => {

    try {

        const { monthlyLimit } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        user.monthlyLimit = monthlyLimit;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Monthly Spending Limit Saved",

            monthlyLimit: user.monthlyLimit

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ===============================
// Export Controllers
// ===============================
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
   getProfile,
   changePassword,
    saveMonthlyLimit,
};

