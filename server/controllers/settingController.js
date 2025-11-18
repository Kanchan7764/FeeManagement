import User from "../models/User.js";
import bcrypt from "bcrypt";

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // extracted from token by authMiddleware

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Change Password Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while changing password" });
  }
};

export { changePassword };
