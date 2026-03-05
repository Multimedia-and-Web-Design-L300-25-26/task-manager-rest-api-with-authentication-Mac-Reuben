import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate token
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    // Prepare user object for response (remove password)
    const userResponse = user.toObject();
    delete userResponse.password;

    // Flatten the response: merge user fields and token at the top level
    res.status(201).json({ ...userResponse, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Unable to login" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Unable to login" });
    }

    // Generate token
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    // Prepare user object for response (remove password)
    const userResponse = user.toObject();
    delete userResponse.password;

    // Flatten the response
    res.json({ ...userResponse, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};