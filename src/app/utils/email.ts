import nodemailer from 'nodemailer';
import { envVars } from '../config/env';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs'
import { AppError } from '../errorHelpers/AppError';
import status from 'http-status';

const smtpPort = Number(envVars.EMAIL_SENDER.SMTP_PORT);
const smtpOptions: any = {
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    tls: {
        rejectUnauthorized: false,
    },
};

const createTransporter = (options = smtpOptions) => nodemailer.createTransport(options);
const transporter = createTransporter();

const sendMailWithRetry = async (mailOptions: nodemailer.SendMailOptions) => {
    try {
        return await transporter.sendMail(mailOptions);
    } catch (error: any) {
        const isGmail = envVars.EMAIL_SENDER.SMTP_HOST === 'smtp.gmail.com';
        const timedOut = error?.code === 'ETIMEDOUT' || error?.message?.includes('Connection timeout');

        if (isGmail && smtpPort === 465 && timedOut) {
            console.warn('SMTP port 465 timed out on Gmail; retrying with port 587 and STARTTLS');
            const retryTransporter = createTransporter({
                ...smtpOptions,
                port: 587,
                secure: false,
                requireTLS: true,
                tls: {
                    rejectUnauthorized: false,
                },
            });
            return await retryTransporter.sendMail(mailOptions);
        }

        throw error;
    }
};

//interface for email options
interface sendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string;
    }[]
}

//send email
export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: sendEmailOptions) => {
    try {
        //set the template path - support both source and built output locations
        const sourcePath = path.resolve(process.cwd(), "src/app/templates", `${templateName}.ejs`);
        const builtPath = path.resolve(process.cwd(), "dist/src/app/templates", `${templateName}.ejs`);
        
        // robust fallback using __dirname
        const currentFileDir = path.dirname(fileURLToPath(import.meta.url));
        const relativeTemplatePath = path.resolve(currentFileDir, "../templates", `${templateName}.ejs`);

        let templatePath = "";
        if (fs.existsSync(builtPath)) {
            templatePath = builtPath;
        } else if (fs.existsSync(sourcePath)) {
            templatePath = sourcePath;
        } else if (fs.existsSync(relativeTemplatePath)) {
            templatePath = relativeTemplatePath;
        } else {
            // Check one more place: src/app/templates relative to root if running from dist
            const rootTemplatesPath = path.resolve(process.cwd(), "src/app/templates", `${templateName}.ejs`);
            if (fs.existsSync(rootTemplatesPath)) {
                templatePath = rootTemplatesPath;
            }
        }

        if (!templatePath) {
            console.error(`Email template not found: ${templateName}. Tried paths:`, {
                builtPath,
                sourcePath,
                relativeTemplatePath
            });
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Email template ${templateName} not found`);
        }

        console.log(`Using email template path: ${templatePath}`);

        const html = await ejs.renderFile(templatePath, templateData)

        //send the email now
        const info = await sendMailWithRetry({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })

        console.log(`----Email sent to ${to} :${info.messageId}`)
        console.log(`----Email sent to ${to} with subject "${subject}" using template "${templateName}"`)

    } catch (error: any) {
        console.error("Email sending error detailed:", {
            message: error?.message,
            stack: error?.stack,
            code: error?.code ?? null,
            response: error?.response ?? null,
            templateName
        });
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email")
    }
}