import User from "../models/users.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/errorHandler.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      if (req.body.role && req.user.role !== "admin") {
        return next(
          errorHandler(
            403,
            "You have to be an admin to change the role of a user"
          )
        );
      }
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
          },
        },
        { new: true }
      );

      if (!updateUser) {
        return next(
          errorHandler(404, `User with id ${req.params.id} not found`)
        );
      }

      const { passowrd, ...rest } = updateUser._doc;
      res.status(200).json(rest);
    } else {
      next(errorHandler(403, "You can update only your account!"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      if (!deleteUser) {
        return next(
          errorHandler(404, `User with id ${req.params.id} not found`)
        );
      }

      res
        .status(200)
        .json({ message: `User with id ${req.params.id} deleted` });
    } else {
      next(errorHandler(403, "You can delete only your account!"));
    }
    res.status(200).json({ message: `User with id ${req.params.id} deleted` });
  } catch (err) {
    next(err);
  }
};

export const user = (req, res) => {
  res.status(200).json({ message: "Welcome User!" });
};
