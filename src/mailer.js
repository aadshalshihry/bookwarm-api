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

export function sendResetPasswordEmail(user) {
  const tranpost = setup();
  const email = {
    from,
    to: user.email,
    subject: "Reset Password",
    text: `
      To reset password follow this link

      ${user.generateResetPasswordLink()}
    `
  };

  tranpost.sendMail(email);
}

export function sendNotifyPasswordChangeEmail(user) {
  const tranpost = setup();
  const email = {
    from,
    to: user.email,
    subject: "Password has changed",
    text: `
      Your Password has change, if you did not do it, please follow the link below

      ${user.generateResetPasswordLink()}
    `
  };

  tranpost.sendMail(email);
}