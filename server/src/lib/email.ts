import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const sesClient = new SESv2Client();

const transporter = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
});

const sendMail = transporter.sendMail.bind(transporter);

export { sendMail };
