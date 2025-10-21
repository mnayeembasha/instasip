import nodemailer from 'nodemailer';
import { SMTP_EMAIL, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT, NODE_ENV } from '../config';
import { generateOrderConfirmationEmail, generateOrderDeliveredEmail, generateOtpEmail, type PopulatedOrderDocument } from '../templates/emailTemplates';

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: parseInt(SMTP_PORT) === 465 ? true : false,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: NODE_ENV === "development" ? false : true,
    },
    pool: true,
    connectionTimeout: 10000,
    greetingTimeout: 8000,
    socketTimeout: 10000
});

export const sendVerificationOtp = async (email: string, otp: string, name: string) => {
    try {
        const mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject: 'Email Verification - InstaSip',
            html: generateOtpEmail(name, otp),
        };
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully to:', email);
        return { success: true };
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

export const sendOrderConfirmationEmail = async (
    email: string,
    userName: string,
    order: PopulatedOrderDocument
) => {
    try {
        const mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject: `Order Confirmation - ${order._id.toString().slice(-8)} - InstaSip`,
            html: generateOrderConfirmationEmail(order.user, order),
        };
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully to:', email);
        return { success: true };
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return { success: false, error };
    }
};

export const sendOrderDeliveredEmail = async (
    email: string,
    userName: string,
    order: PopulatedOrderDocument
) => {
    try {
        const mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject: `Order Delivered - ${order._id.toString().slice(-8)} - InstaSip`,
            html: generateOrderDeliveredEmail(order.user, order),
        };
        await transporter.sendMail(mailOptions);
        console.log('Order delivered email sent successfully to:', email);
        return { success: true };
    } catch (error) {
        console.error('Error sending order delivered email:', error);
        return { success: false, error };
    }
};