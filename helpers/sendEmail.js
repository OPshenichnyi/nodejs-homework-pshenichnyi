import nodemailer from "nodemailer"; // Встановлюємо та імпортуємо бібліотеку nodemailer
import dotenv from "dotenv"; // Імпортуємо dotenv для роботи зі зміними оточення
dotenv.config(); // ініціалізуємо dotenv

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env; // Імпортуємо значення змінних UKR_NET_PASSWORD UKR_NET_EMAIL з файлу .env

// Створюємо конфігурацію для відправки листів з пошти
// Вказуємо налаштування почтової скриньки
const nodemailerConfig = {
  host: "smtp.ukr.net", // host поштової скриньки
  port: 465, // port поштової скриньки
  secure: true, // Вказуємо чи потрібно шифрування
  auth: {
    // Вказуємо дані авторизації
    user: UKR_NET_EMAIL, // Адресу поштової скриньки
    pass: UKR_NET_PASSWORD, // Пароль для поштової скриньки беремо в налаштуванях поштової скриньки
  },
};

// Створюємо transport за допомогою методу createTransport та передаємо в нього налаштування nodemailerConfig
const transport = nodemailer.createTransport(nodemailerConfig);

// Створюємо функцію для відправлення повідомлень
// data буде отримувати дані у вигляді
// to: email - адреса куди відправити
// subject: "Verify email" - тема листу
// html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email<a>` - Дані у вигляді HTML
const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL }; // from: UKR_NET_EMAIL передаємо з якого адресу відправляємо мейл та розпилюємо дані з data
  return transport.sendMail(email); // Відправляємо лист за допомогою методу sendMail
};

export default sendEmail;
