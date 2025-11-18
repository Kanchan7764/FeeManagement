import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  try {
    // ✅ Get token from cookie instead of headers
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: Token missing" });
    }

    // ✅ Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid or expired token" });
    }

    // ✅ Find user from decoded JWT
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    req.user = user; // Attach user to request
    next(); // Continue to next middleware/route
  } catch (error) {
    console.error("verifyUser Error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export default verifyUser;
