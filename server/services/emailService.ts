import nodemailer from 'nodemailer';
import { SMTP_EMAIL, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT,NODE_ENV } from '../config';

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: parseInt(SMTP_PORT) === 465 ? true : false,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: NODE_ENV==="development"?false:true, // TODO: Set to true in production after SSL certificate is properly configured
    },
});

export const sendVerificationOtp = async (email: string, otp: string, name: string) => {
    try {
        const mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject: 'Email Verification - InstaSip',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">InstaSip</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9f9f9; border-radius: 0 0 10px 10px;">
                        <p style="color: #333; font-size: 16px;">Hi ${name},</p>
                        <p style="color: #666; font-size: 14px;">Welcome to InstaSip! Please verify your email address using the OTP below.</p>
                        <div style="background-color: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                            <p style="color: #667eea; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">${otp}</p>
                        </div>
                        <p style="color: #999; font-size: 12px;">This OTP will expire in 10 minutes.</p>
                        <p style="color: #666; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">© 2024 InstaSip. All rights reserved.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email);
        return { success: true };
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};