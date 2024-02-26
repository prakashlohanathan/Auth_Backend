import nodemailer from "nodemailer";
import dotenv from "dotenv";

//ENV configuration
dotenv.config();

export async function MailSender({ data }) {
  //Creating transport
  let sender = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
  let reciever = data.email;
  let subject = data.subject;
  let message = data.message;
  let from = {
    name: "Auth App",
    address: process.env.user,
  };
  //mail content
  let mailContent = {
    from: from,
    to: reciever,
    subject: subject,
    text: message,
  };
  sender.sendMail(mailContent, function (error, info) {
    if (error) {
      console.log("Error in sending mail", error);
      return false;
    }
  });
  return true;
}
