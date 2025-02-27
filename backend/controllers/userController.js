const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure:false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = (user, otp) => {
  const mailOptions = {
    from: {
      name: "Nitronics Gaming Store",
      address: process.env.EMAIL_USER,
    },
    to: user.email,
    subject: "OTP for Email Verification - Nitronics Gaming Store",
    text: `Hi ${user.firstName},\n\nYour OTP for email verification is ${otp}. Please use this code to complete your registration.\n\nThank you!`,
    html: `<p>Hi ${user.firstName},</p>
           <p>Your OTP for email verification is <strong>${otp}</strong>.</p>
           <p>Please use this code to complete your registration.</p>
           <p>Thank you!</p>`,
  };

  return transporter.sendMail(mailOptions);
};

const register = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingPhoneUser = await User.findOne({ where: { phoneNumber } });
    if (existingPhoneUser) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 15 * 60 * 1000;  // 15-minute expiration

    console.log("OTP expires at:", otpExpiresAt); // Log this value for debugging

    const user = await User.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      emailVerified: false,
      otp,
      otpExpiresAt,  // Make sure the expiration value is being set correctly
    });

    await sendOtpEmail(user, otp);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email using the OTP sent.",
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  console.log(emailOrPhone, password);
  

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.emailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ newToken });
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

const sendOtp = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 15 * 60 * 1000;  // 15-minute expiration

    await user.save();
    await sendOtpEmail(user, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("OTP from user:", user.otp);
    console.log("OTP from request:", otp);
    console.log("OTP expires at:", user.otpExpiresAt);
    console.log("Current time:", Date.now());

    // Ensure the OTP is valid and has not expired
    if (user.otp !== otp || Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.emailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const viewAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "createdAt",
        "updatedAt",
      ], // Exclude password
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const viewUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: { id },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "createdAt",
        "updatedAt",
        "emailVerified",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve user" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  viewAllUsers,
  viewUserById,
  verifyOtp,
  sendOtp,
};
