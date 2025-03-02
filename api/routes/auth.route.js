import express from "express";
import {
  signup,
  login,
  logout,
  forgetPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);

export default router;
