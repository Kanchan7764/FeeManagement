import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ LOGIN CONTROLLER (session-style JWT)
import Student from "../models/Students.js"; // Make sure Student model is imported

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, error: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, error: "Password Not Match" });

    // ✅ Check student status if role is student
    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id }); // Assuming Student references User
      if (!student)
        return res.status(404).json({ success: false, error: "Student record not found" });

      if (student.status === "blocked") {
        return res.status(403).json({
          success: false,
          error: "Your account is blocked by admin",
        });
      }
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    // ✅ Send token via HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,  // true in production
      sameSite: "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { _id: user._id, name: user.name, role: user.role },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};


// ✅ VERIFY CONTROLLER
export const verify = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// ✅ LOGOUT CONTROLLER
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true, message: "Logged out successfully" });
};
