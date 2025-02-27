const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_PASS = process.env.ADMIN_PASS;

const adminLogin = (req, res) => {
  const { username, password } = req.body;
  
  if (username !== ADMIN_NAME) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const hashedAdminPass = bcrypt.hashSync(ADMIN_PASS, 10);
  const isPasswordValid = bcrypt.compareSync(password, hashedAdminPass);
  console.log('Password valid:', isPasswordValid);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign({ username: username }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: 'Login successful', token });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.admin = decoded;
    next();
  });
};

// Endpoint to refresh access token
const refreshAdminToken = (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required." });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Issue a new access token
    const newToken = jwt.sign({ username: decoded.username }, JWT_SECRET, {
      expiresIn: "30m",
    });
    res.status(200).json({ newToken });
  });
};

module.exports = {
  adminLogin,
  verifyToken,
  refreshAdminToken,
};
