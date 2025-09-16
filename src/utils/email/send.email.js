import nodemailer from "nodemailer";

export async function sendEmail({
  from = process.env.APP_EMAIL,
  to = "",
  cc = "",
  bcc = "",
  text = "",
  html = "",
  subject = "Saraha App",
  attachments = [],
} = {}) {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  const info = await transpoter.sendMail({
    from: `"Saraha App" <${from}>`,
    to,
    cc,
    bcc,
    text,
    html,
    subject,
    attachments,
  });
}
