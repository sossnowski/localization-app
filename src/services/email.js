const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_TLS,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PW,
    },
  });

module.exports.sendEmail = (to, subject, html) => {
  const message = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  };
  const transporter = createTransporter();
  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
