import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  deleteUser,
  user,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { refreshToken } from "../controllers/token.controller.js";
import { authorizeroles } from "../middleware/roleAuthMiddleware.js";

const router = express.Router();

router.get(
  "/user-profile",
  authMiddleware,
  authorizeroles(["user", "admin"]),
  user
);
router.get(
  "/dashboard-users",
  authMiddleware,
  authorizeroles(["admin"]),
  getUsers
);
router.post(
  "/update/:id",
  authMiddleware,
  authorizeroles(["user", "admin"]),
  updateUser
);
router.delete(
  "/users/:id",
  authMiddleware,
  authorizeroles(["user", "admin"]),
  deleteUser
);
router.post("/refresh", refreshToken);

export default router;
