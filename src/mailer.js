import nodemailer from 'nodemailer';

const from = '"ArabSandBox" <info@arabsandbox.com>';

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export function sendConfirmationEmail(user) {
  const tranpost = setup();
  const email = {
    from,
    to: user.email,
    subject: "Welcome to ArabSandBox",
    text: `
      Welcome to ArabSandBox, Please, confirm your email.

      ${user.generateConfirmationUrl()}
    `
  };

  tranpost.sendMail(email);
}