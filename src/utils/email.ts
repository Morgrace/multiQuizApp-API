import nodemailer from "nodemailer";

if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USERNAME ||
  !process.env.EMAIL_PASSWORD ||
  !process.env.EMAIL_FROM
) {
  throw new Error("Missing Environment variables for sending mail");
}

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
