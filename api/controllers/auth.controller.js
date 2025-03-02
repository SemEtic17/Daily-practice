import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import errorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(400, "Email not found"));

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Save token to user document
    user.resetToken = resetToken;
    await user.save();

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset",
      `Click here to reset your password: ${resetLink}`
    );

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user || user.resetToken !== token)
      return next(errorHandler(400, "Invalid or expired token"));

    // Hash new password
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null; // Remove token after successful reset
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      name === "" ||
      email === "" ||
      password === ""
    )
      return next(errorHandler(400, "All fields are required"));
    const hashedpassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ name, email, password: hashedpassword });
    await newUser.save();
    const { password: pass, ...rest } = newUser._doc;
    res.status(201).json({ message: `User ${name} created`, rest });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "")
      return next(errorHandler(400, "All fields are required"));
    const user = await User.findOne({ email });

    if (!user) return next(errorHandler(401, "Wrong credentials"));

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_REFRESH_KEY,
      { expiresIn: "7d" }
    );

    const { password: pass, ...rest } = user._doc;

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
      })
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Successfully signed in", token, rest });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .status(200)
      .json({
        message: "Logged out",
      });
  } catch (err) {
    next(err);
  }
};
