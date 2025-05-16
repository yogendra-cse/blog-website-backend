import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPwd = await bcrypt.compare(password, existingUser.password);
    if (!isValidPwd) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Fixed JWT generation
    try {
      const token = jwt.sign(
        { username, userId: existingUser._id, isAdmin: existingUser.isAdmin },
        "my_secret_key",
        { expiresIn: "7d" }
      );
      
      res
        .cookie("token", token, { 
          httpOnly: true, 
          sameSite: "strict",
          // Add secure: true in production with HTTPS
        })
        .status(200)
        .json({ id: existingUser._id, username });
    } catch (tokenErr) {
      return res.status(500).json({ message: "Token generation failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { 
    httpOnly: true, 
    sameSite: "strict",
    // Add secure: true in production with HTTPS
  })
  .status(200)
  .json({ message: "Logged out successfully" });
};