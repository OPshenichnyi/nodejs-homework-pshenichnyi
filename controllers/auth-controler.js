import User, { userSigninSchema } from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { userSignupSchema } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
dotenv.config();

const avatarsPath = path.resolve("public", "avatars"); // Створюємо абсолютний шлях куди будемо переміщати файл

const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { error } = userSignupSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL: gravatar.url(
        req.body.email,
        {
          s: "200",
          r: "g",
          d: "wavatar",
        },
        false
      ),
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { error } = userSigninSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res) => {
  const { subscription, email } = req.user;

  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      next(HttpError(400, "Not found file"));
    }
    const { path: oldPath, filename } = req.file; // Деструктуризуємо req.file шлях до файлу і змінюємо назву oldPath тако деструктуризуємо імя файлу
    const newPath = path.join(avatarsPath, filename);
    await Jimp.read(oldPath).then((image) => {
      // За допомогою бібліотеки Jimp обробляємо розміри фото 250 х 250
      image.resize(250, 250).write(newPath);
    });
    // Обєднуємо шлях до папки куди перемістити з іменем файлу
    const { _id } = req.user;
    await fs.unlink(oldPath);
    const avatarNewUrl = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL: avatarNewUrl });
    res.status(200).json({
      avatarURL: avatarNewUrl,
    });
  } catch (error) {
    next();
  }
};

export default {
  signup,
  signin,
  signout,
  getCurrent,
  changeAvatar,
};
