import nodemailer from "nodemailer";
import { env } from '../../infrastructure/env'

/**
   * nodemailer sent mail
   * @param {string} resetOTP
*/


const emailTemplate = (resetOTP: string) : string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kommuno - OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #e90000; text-align: center;"><img src="https://dev.kommuno.com/kwui1/content/images/kommuno-logo.png" alt="LOGO" style="max-width: 300px;"></h1>
        <p style="font-style: italic; color: #3498db; text-align: center;">In pursuit to connect our clients to their customers.</p>

        <h2 style="color: #333333; text-align: center;">Your One-Time Password (OTP)</h2>
        <p style="color: #555555; text-align: center;">Please use the following OTP to complete your action:</p>
        <p style="font-size: 24px; font-weight: bold; color: #1109fa; text-align: center;">${resetOTP}</p>
        <p style="color: #777777;">Note: This OTP is valid for a single use and should not be shared with anyone.</p>

        <div style="margin-top: 20px; text-align: center; color: #999999;">
            <p>This is an automated email. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

export const sendResetPasswordEmail = async (to: string, resetOTP: string): Promise<void> => {
    try {
      const transporter = nodemailer.createTransport({
        service: env.EMAIL_HOST,
        auth: {
          user: env.EMAIL_USERNAME,
          pass: env.EMAIL_PASSWORD
        }
      });
  
      const info = await transporter.sendMail({
        from: '"kommuno.com" <info@kommuno.com>',
        to: to,
        subject: "Your OTP Code",
        html: emailTemplate(resetOTP),
        headers: { 'x-myheader': 'header' }
      });
  
      console.log("Message sent: %s", info.response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };