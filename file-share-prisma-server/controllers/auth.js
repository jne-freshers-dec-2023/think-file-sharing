  import prisma from "../DB/db.config.js";
  // const prisma = require("../DB/db.config.js");
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
  // import { validationResult } from "express-validator";
  import * as expressValidator from "express-validator";

  export const register = async (req, res, next) => {
    try {
      // const errors = validationResult(req);
      const { validationResult: validationResultCommonJS } = expressValidator;
      validationResultCommonJS(req);

      if (!errors.isEmpty()) {
        const error = new Error("Validation Failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { email, username, password } = req.body;

      const hashPassword = await bcrypt.hash(password, 12);

      const result = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: hashPassword,
        },
      });

      res.status(200).json({ message: "User created!", userId: result.id });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      let loadedUser;

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        const error = new Error("User with this email could not be found.");
        error.status = 401;
        throw error;
      }

      loadedUser = user;

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        const error = new Error("Wrong Password.");
        error.status = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id.toString(),
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "User logged in successfully",
        data: {
          token: token,
          userId: loadedUser.id,
        },
        statusCode: 200,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
