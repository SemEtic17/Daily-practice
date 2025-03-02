import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(errorHandler(401, "Unauthorized"));
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_KEY,
      (err, user) => {
        if (err) return next(errorHandler(403, "Invalid token"));
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "30m" }
        );
        res
          .cookie("accessToken", token, {
            httpOnly: true,
          })
          .status(200)
          .json({ message: "new token created" });
      }
    );
  } catch (err) {
    next(err);
  }
};
