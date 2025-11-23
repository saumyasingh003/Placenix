import jwt from "jsonwebtoken";
import User from "../Models/user.js";

// Generate JWT token with user ID and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

  
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("invalid credentials!")
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successful login
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    console.log("error in login user:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Logout user
export const logoutUser = async (req, res) => {
  try {
    
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
