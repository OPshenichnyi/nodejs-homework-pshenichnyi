import express from "express";
import authController from "../../controllers/auth-controler.js";
import { authenticate, isEmptyBody, upload } from "../../middlewares/index.js";

const authRouter = express.Router(); // Створюємо обєкт Router куди будуть записані маршрути

// Створюємо шлях для реєстрації для перевірки порожнього тіла запиту використовуємо мідлвару isEmptyBody
authRouter.post("/register", isEmptyBody, authController.signup);
// Створюємо шлях для верифікації за допомогою посилання
authRouter.get("/verify/:verificationToken", authController.verify);
// Створюємо шлях для повторного надсилання листа для верифікації для перевірки порожнього тіла запиту використовуємо мідлвару isEmptyBody
authRouter.post("/verify", isEmptyBody, authController.resendVerify);
// Створюємо шлях для логіну для перевірки порожнього тіла запиту використовуємо мідлвару isEmptyBody
authRouter.post("/login", isEmptyBody, authController.signin);
// Створюємо шлях для зміни аватарки
authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  authController.changeAvatar
);

authRouter.get("/current", authenticate, authController.getCurrent);
// Створюємо шлях для виходу з профілю для перевірки користувача використовуємо мідлвару authenticate
authRouter.post("/logout", authenticate, authController.signout);

export default authRouter;
