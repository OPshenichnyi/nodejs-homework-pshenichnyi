import express from "express";
import authController from "../../controllers/auth-controler.js";
import { authenticate, isEmptyBody, upload } from "../../middlewares/index.js";

const authRouter = express.Router(); // Створюємо обєкт Router куди будуть записані маршрути

authRouter.post("/register", isEmptyBody, authController.signup);
authRouter.post("/login", isEmptyBody, authController.signin);
authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  authController.changeAvatar
);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.signout);

export default authRouter;
