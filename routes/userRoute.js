import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/user/UserModels.js";
import { compareText, encryptText } from "../utils/bcrypt.js";
import { jwtSign } from "../utils/jwt.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, email } = req.body;
    let { password } = req.body;
    password = await encryptText(password);
    const data = await createUser({
      username,
      email,
      password,
    });

    return res.status(201).json({
      status: "success",
      message: "user created",
      data,
    });
  } catch (error) {
    if (error?.message.includes("E11000")) {
      next({
        statusCode: 400,
        message: "This user exists already",
      });
    } else {
      next({
        statusCode: 500,
        message: "Error while creating the user",
      });
    }
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await getUserByEmail(email);
    if (userData) {
      const loginSuccess = await compareText(password, userData.password);
      if (loginSuccess) {
        // Creating token and sending as a response
        const tokenData = {
          email: userData.email,
        };

        const token = await jwtSign(tokenData);

        return res.status(200).json({
          staus: "success",
          message: "login succesfull",
          accesToken: token,
        });
      } else {
        next({
          statusCode: 403,
          message: "Credintals unmatched !!!",
        });
      }
    } else {
      next({
        statusCode: 404,
        message: "login error",
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: "login error",
    });
  }
});
export default router;
