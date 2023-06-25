import { Router } from "express";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import * as jsonWebtoken from "jsonwebtoken";
import userModel from "../schemas/users.schema";
import { StatusCode } from "status-code-enum";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../validators/user.validator";

export const UserRouter = (secret) => {
  const router = Router();

  router.get("/user", async (req, res) => {
    const user = await userModel.findById(req.user.id);
    res.json(user);
  });

  router.post("/users", async (req, res) => {
    try {
      const result = validateRegisterUser(req.body);

      if (result.error) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .send(result.error.message);
      }

      const user = { ...req.body };
      const existingUser = await userModel.findOne({ email: user.email });
      if (existingUser) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .send(`user with email ${user.email} already exists`);
      }

      const saltRounds = 10;
      const salt = genSaltSync(saltRounds);
      user.password = hashSync(user.password, salt);

      await new userModel(user).save();
      res.json({
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.ServerErrorInternal).send("internal error");
    }
  });

  router.post("/users/auth", async (req, res) => {
    try {
      const result = validateLoginUser(req.body);

      if (result.error) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .send(result.error.message);
      }

      const user = await userModel.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res
          .status(StatusCode.ClientErrorNotFound)
          .send("user not found in database");
      }

      if (!compareSync(req.body.password, user.password)) {
        return res
          .status(StatusCode.ClientErrorUnauthorized)
          .send("incorrect password!");
      }

      const userPayload = { email: user.email, name: user.name, id: user.id };

      const token = jsonWebtoken.default.sign(userPayload, secret);
      res
        .cookie("token", token, {
          secure: true,
          sameSite: "none",
          httpOnly: true,
        })
        .json(userPayload);
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.ServerErrorInternal).send("internal error");
    }
  });

  return router;
};
