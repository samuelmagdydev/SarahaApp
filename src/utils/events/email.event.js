import { error } from "node:console";
import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email.js";
import { verifyEmailTemplate } from "../email/templates/verfiy.email.template.js";

export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: data.subject || "Confirm Your Email",
    html: verifyEmailTemplate({otp: data.otp}),
  }).catch((error) => {
    console.log(`Error in sending email:${data.to}`);
  });
});
